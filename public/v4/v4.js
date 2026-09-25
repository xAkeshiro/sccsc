/*
 * v4 scroll effects: section content fades up as it comes into view, with cards and counters
 * staggered. (The hero's entrance on load is pure CSS in v4.css.) Skipped entirely for visitors
 * who prefer reduced motion, and without JavaScript everything is simply visible.
 */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Elementor element IDs, section by section.
  var groups = [
    '[data-id="95ee5d7"] .elementor-widget', // Welcome
    '[data-id="5e43027"], [data-id="d02d5df"], [data-id="38be888"]', // Programs heading
    '[data-id="c7f367e"] > .e-con', // Program cards
    '[data-id="b4367cb"]', // View All Programs
    '[data-id="bcf2712"] .elementor-widget-counter', // Counters
    '[data-id="591ced0"] .elementor-widget', // Mission
    '[data-id="1030bb4"] .elementor-widget', // Donation band
    '[data-id="ce3c6db"], [data-id="18c75c2"]', // Blog heading
    '[data-id="87c0020"] .e-loop-item', // Blog cards
    '[data-id="9c6fcf4"]', // View All Blogs
  ];

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("v4-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  groups.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add("v4-reveal");
      if (el.classList.contains("elementor-widget-image")) el.classList.add("v4-reveal--zoom");
      el.style.setProperty("--v4-delay", Math.min(i, 5) * 0.1 + "s");
      observer.observe(el);
    });
  });
})();
