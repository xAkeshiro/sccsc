/*
 * Scroll effects for the v4 pages: each section's content fades up as it comes into view, with
 * cards staggered. The banner's entrance on load is CSS (v4-pages.css). Skipped for visitors who
 * prefer reduced motion; without JavaScript everything is simply visible.
 */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var docs = document.querySelectorAll(
    '[data-elementor-type]:not([data-elementor-type="header"]):not([data-elementor-type="footer"]):not([data-elementor-type="loop-item"]):not([data-elementor-type="popup"])',
  );
  var targets = [];
  docs.forEach(function (doc) {
    doc.querySelectorAll(".e-parent:not(.v4-hero)").forEach(function (section) {
      section.querySelectorAll(".elementor-widget, .v4-card, .e-loop-item").forEach(function (el) {
        // Animate a card or blog card as one piece, not its contents.
        if (el.matches(".elementor-widget") && el.closest(".v4-card, .e-loop-item")) return;
        // Skip the grid that holds blog cards; the cards themselves animate.
        if (el.querySelector(".e-loop-item")) return;
        // Carousels position their own slides.
        if (el.closest(".swiper, .elementor-swiper, [class*='carousel']")) return;
        targets.push(el);
      });
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("v4-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 },
  );

  targets.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return targets.indexOf(c) >= 0;
    });
    var i = siblings.indexOf(el);
    el.classList.add("v4-reveal");
    if (el.classList.contains("elementor-widget-image")) el.classList.add("v4-reveal--zoom");
    el.style.setProperty("--v4-delay", Math.min(Math.max(i, 0), 5) * 0.1 + "s");
    observer.observe(el);
  });
})();
