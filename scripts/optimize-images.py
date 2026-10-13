"""Convert large PNG/JPG uploads referenced by the site to WebP and point every reference at them.

Run after refreshing the WordPress export, before `npm run v4:build`:  python3 scripts/optimize-images.py
"""
import re, glob, os, subprocess
from PIL import Image

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
texts = [f for f in glob.glob("public/**/*", recursive=True)
         if os.path.isfile(f) and f.endswith((".html", ".css", ".js", ".json"))]
pat = re.compile(r'/wp-content/uploads/[^"\'\s)\\,]+\.(?:png|jpe?g)', re.I)
refs = set()
for f in texts:
    refs |= set(pat.findall(open(f, encoding="utf-8", errors="ignore").read()))

mapping = {}
before = after = 0
for u in sorted(refs):
    src = "public" + u
    if not os.path.isfile(src) or os.path.getsize(src) <= 120_000:
        continue
    dst_u = re.sub(r"\.(png|jpe?g)$", ".webp", u, flags=re.I)
    dst = "public" + dst_u
    if os.path.exists(dst):
        continue
    im = Image.open(src)
    im.load()
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if has_alpha else "RGB")
    im.save(dst, "WEBP", quality=80, method=6)
    s0, s1 = os.path.getsize(src), os.path.getsize(dst)
    if s1 >= s0 * 0.9:  # not worth it
        os.remove(dst)
        continue
    mapping[u] = dst_u
    before += s0
    after += s1

changed = 0
for f in texts:
    t = open(f, encoding="utf-8", errors="surrogateescape").read()
    n = t
    for old, new in mapping.items():
        n = n.replace(old, new)
    if n != t:
        open(f, "w", encoding="utf-8", errors="surrogateescape").write(n)
        changed += 1

# Drop the replaced originals only if nothing references them any more.
remaining = "".join(open(f, encoding="utf-8", errors="ignore").read() for f in texts)
removed = 0
for old in mapping:
    if old not in remaining:
        subprocess.run(["git", "rm", "-q", "public" + old], check=True)
        removed += 1
print(f"converted {len(mapping)} images: {before/1e6:.1f} MB -> {after/1e6:.1f} MB; rewrote {changed} files; removed {removed} old files")
