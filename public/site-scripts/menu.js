/*
 * Mobile menu. The header's menu icon opens an Elementor Pro "off-canvas" panel, but Simply
 * Static didn't export Elementor's off-canvas script, so the icon did nothing. This opens and
 * closes the panel the same way: the icon and close links carry
 * "#elementor-action:action=off_canvas:open|close&settings=<base64 {"id": ...}>".
 */
(function () {
  var style = document.createElement("style");
  style.textContent =
    "@keyframes sccsc-menu-in{from{opacity:0;transform:translateX(40px)}}" +
    ".e-off-canvas[aria-hidden=false] .e-off-canvas__content{animation:sccsc-menu-in .25s ease-out}" +
    "@media (prefers-reduced-motion:reduce){.e-off-canvas[aria-hidden=false] .e-off-canvas__content{animation:none}}";
  document.head.appendChild(style);

  var lastTrigger = null;

  function parse(href) {
    var hash = decodeURIComponent((href || "").split("#")[1] || "");
    var m = hash.match(/^elementor-action:action=off_canvas:(open|close|toggle)(?:&settings=(.+))?$/);
    if (!m) return null;
    var id = null;
    try {
      id = m[2] ? JSON.parse(atob(m[2])).id : null;
    } catch (e) {}
    return { action: m[1], id: id };
  }

  function panelFor(id, from) {
    if (id) return document.getElementById("off-canvas-" + id);
    return from ? from.closest(".e-off-canvas") : document.querySelector(".e-off-canvas");
  }

  function open(panel, trigger) {
    lastTrigger = trigger || null;
    panel.setAttribute("aria-hidden", "false");
    panel.removeAttribute("inert");
    document.body.classList.add("e-off-canvas__no-scroll");
    var first = panel.querySelector("a, button");
    if (first) first.focus({ preventScroll: true });
  }

  function close(panel) {
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");
    document.body.classList.remove("e-off-canvas__no-scroll");
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href*='off_canvas']");
    if (link) {
      var action = parse(link.getAttribute("href"));
      var panel = action && panelFor(action.id, link);
      if (!panel) return;
      event.preventDefault();
      var isOpen = panel.getAttribute("aria-hidden") === "false";
      if (action.action === "close" || (action.action === "toggle" && isOpen)) close(panel);
      else open(panel, link);
      return;
    }
    // Clicking the dimmed overlay closes the panel, and so does following a menu link (after the
    // click, so the link isn't made inert before the browser follows it).
    var openPanel = document.querySelector(".e-off-canvas[aria-hidden=false]");
    if (!openPanel) return;
    if (event.target.classList.contains("e-off-canvas__overlay")) close(openPanel);
    else if (event.target.closest(".e-off-canvas a[href]")) setTimeout(function () { close(openPanel); }, 0);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var openPanel = document.querySelector(".e-off-canvas[aria-hidden=false]");
    if (openPanel) close(openPanel);
  });
})();
