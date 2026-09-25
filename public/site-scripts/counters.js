/*
 * Count-up for the home page's stat counters (Elementor "counter" widgets). Simply Static didn't
 * export Elementor's own counter script, so this replaces it: each number starts at 0 and counts
 * up to its data-to-value when the counters scroll into view. The HTML already contains the final
 * numbers, so visitors without JavaScript, or who prefer reduced motion, just see those.
 */
(function () {
  var counters = document.querySelectorAll(".elementor-counter-number[data-to-value]");
  if (!counters.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function format(value, delimiter) {
    var text = String(Math.round(value));
    return delimiter ? text.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter) : text;
  }

  function run(el) {
    var target = Number(el.getAttribute("data-to-value")) || 0;
    var duration = Number(el.getAttribute("data-duration")) || 2000;
    var delimiter = el.getAttribute("data-delimiter") || "";
    var start = null;
    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3); // ease-out
      el.textContent = format(target * eased, delimiter);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        run(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach(function (el) {
    el.textContent = "0";
    observer.observe(el);
  });
})();
