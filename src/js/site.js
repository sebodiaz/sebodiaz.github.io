// Theme toggle — the initial theme is set inline in <head> to avoid a flash.
document.getElementById("theme-toggle").addEventListener("click", function () {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ASCII margin texture — a static generative field in the side margins.
// Character density ramps from nothing at the text column to heavy at the
// page edges, so the texture reads as depth vignetting toward the content.
// Random per visit; rebuilt on resize; the center column is left empty.
(function () {
  var el = document.getElementById("ascii-bg");
  if (!el) return;

  var RAMP = [" ", ".", "·", ":", "-", "=", "+", "*", "#"];
  var CW = 6.6, LH = 14;   // match .ascii-bg font metrics
  var COLUMN = 760 / 2 + 28; // half content width + breathing room

  var f1 = 0.35 + Math.random() * 0.2;
  var f2 = 0.16 + Math.random() * 0.1;
  var p1 = Math.random() * 6.28;
  var p2 = Math.random() * 6.28;

  function render() {
    var vw = window.innerWidth;
    var cols = Math.ceil(vw / CW);
    var rows = Math.ceil(window.innerHeight / LH);
    var maxEdge = vw / 2 - COLUMN;
    if (maxEdge < 40) { el.textContent = ""; return; } // no margins to draw in
    var lines = [];
    for (var y = 0; y < rows; y++) {
      var line = "";
      for (var x = 0; x < cols; x++) {
        var px = x * CW + CW / 2;
        var edge = Math.abs(px - vw / 2) - COLUMN;
        if (edge <= 0) { line += " "; continue; }
        var w = Math.min(1, edge / maxEdge);          // 0 at column, 1 at edge
        var n = 0.5 + 0.25 * Math.sin(x * f1 + y * 0.6 + p1)
                    + 0.25 * Math.sin(x * f2 - y * 0.3 + p2);
        var i = Math.round(Math.pow(w, 1.4) * n * (RAMP.length - 1) * 1.35);
        line += RAMP[i < 0 ? 0 : i >= RAMP.length ? RAMP.length - 1 : i];
      }
      lines.push(line);
    }
    el.textContent = lines.join("\n");
  }

  render();
  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(render, 150);
  });
})();

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
