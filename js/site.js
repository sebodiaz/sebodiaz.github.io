// Scroll-spy: highlight the TOC entry for the section currently in view
(function () {
  var toc = document.querySelector(".toc");
  if (!toc || !("IntersectionObserver" in window)) return;
  var links = {};
  toc.querySelectorAll("a[href^='#']").forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var current = null;
  var observer = new IntersectionObserver(function (observations) {
    observations.forEach(function (obs) {
      if (obs.isIntersecting && links[obs.target.id]) {
        if (current) current.classList.remove("active");
        current = links[obs.target.id];
        current.classList.add("active");
      }
    });
  }, { rootMargin: "0px 0px -70% 0px" });
  Object.keys(links).forEach(function (id) {
    var heading = document.getElementById(id);
    if (heading) observer.observe(heading);
  });
})();

// Image lightbox for publication figures
(function () {
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  var img = document.getElementById("lightbox-img");
  var caption = document.getElementById("lightbox-caption");

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".lightbox-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      img.src = trigger.getAttribute("data-src");
      caption.textContent = trigger.getAttribute("data-caption") || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox || event.target.classList.contains("lightbox-close")) close();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) close();
  });
})();
