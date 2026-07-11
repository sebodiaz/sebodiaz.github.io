// Theme toggle — the initial theme is set inline in <head> to avoid a flash.
document.getElementById("theme-toggle").addEventListener("click", function () {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ASCII wave field — random interference pattern, drifting slowly.
// Random frequencies/phases per visit; ~9fps stepped updates keep the
// terminal feel and the cost negligible. Honors prefers-reduced-motion.
(function () {
  var el = document.getElementById("ascii-bg");
  if (!el) return;
  var chars = [" ", " ", " ", ".", "·", "~", "≈", "~"];
  var f1 = 0.1 + Math.random() * 0.06;
  var f2 = 0.05 + Math.random() * 0.03;
  var p1 = Math.random() * 6.28;
  var p2 = Math.random() * 6.28;
  var cols = 0, rows = 0;

  function measure() {
    var cw = 12, lh = 25; // match .ascii-bg font metrics
    cols = Math.ceil(window.innerWidth / cw) + 1;
    rows = Math.ceil(window.innerHeight / lh) + 1;
  }

  function render(t) {
    var a = p1 + t * 0.00028; // the two components roll in
    var b = p2 - t * 0.00019; // opposite directions
    var lines = [];
    for (var y = 0; y < rows; y++) {
      var line = "";
      for (var x = 0; x < cols; x++) {
        var v = Math.sin(x * f1 + y * 0.7 + a) + Math.sin(x * f2 + y * 0.35 + b);
        line += chars[Math.round(((v + 2) / 4) * (chars.length - 1))];
      }
      lines.push(line);
    }
    el.textContent = lines.join("\n");
  }

  measure();
  render(0);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var last = 0;
    requestAnimationFrame(function tick(now) {
      if (now - last >= 110) {
        last = now;
        render(now);
      }
      requestAnimationFrame(tick);
    });
  }

  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(function () {
      measure();
      render(performance.now());
    }, 200);
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
