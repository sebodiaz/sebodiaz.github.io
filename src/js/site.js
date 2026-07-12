// Theme toggle — the initial theme is set inline in <head> to avoid a flash.
document.getElementById("theme-toggle").addEventListener("click", function () {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// Math rain — sparse terminal rain whose glyphs are LaTeX/math symbols.
// Trails render muted on the base layer; each drop's leading glyph renders
// full-contrast on the overlay. Stepped ~7fps for the terminal cadence.
// Honors prefers-reduced-motion (static frame, no fall).
(function () {
  var el = document.getElementById("ascii-bg");
  var headEl = document.getElementById("ascii-bg-ripples");
  if (!el || !headEl) return;

  var GLYPHS = "∂∇Σλθπ∫αβγμσφψΩξητ≈∞×01+−=";
  var CW = 6.6, LH = 14; // match .ascii-bg font metrics
  var cols = 0, rows = 0;
  var drops = [];

  function glyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  function measure() {
    cols = Math.ceil(window.innerWidth / CW) + 1;
    rows = Math.ceil(window.innerHeight / LH) + 1;
  }

  function spawn() {
    var len = 3 + Math.floor(Math.random() * 6);
    var chars = [];
    for (var i = 0; i < len; i++) chars.push(glyph());
    drops.push({
      col: Math.floor(Math.random() * cols),
      y: -len,                            // enter from above the fold
      period: 2 + Math.floor(Math.random() * 3), // ticks per row-step
      phase: 0,
      len: len,
      chars: chars,
    });
  }

  function render() {
    var grid = [], heads = [];
    for (var y = 0; y < rows; y++) {
      grid.push(new Array(cols).fill(" "));
      heads.push(new Array(cols).fill(" "));
    }
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i];
      var headRow = Math.floor(d.y);
      for (var j = 0; j < d.len; j++) {
        var y2 = headRow - j;
        if (y2 < 0 || y2 >= rows || d.col >= cols) continue;
        if (j === 0) heads[y2][d.col] = d.chars[0];
        else grid[y2][d.col] = d.chars[j];
      }
    }
    el.textContent = grid.map(function (r) { return r.join(""); }).join("\n");
    headEl.textContent = heads.map(function (r) { return r.join(""); }).join("\n");
  }

  function tick() {
    var moved = false;
    for (var i = drops.length - 1; i >= 0; i--) {
      var d = drops[i];
      if (++d.phase >= d.period) {
        d.phase = 0;
        d.y += 1;
        moved = true;
        // a rare glyph mutation, like a flaky display
        if (Math.random() < 0.03) d.chars[1 + Math.floor(Math.random() * (d.len - 1))] = glyph();
      }
      if (d.y - d.len > rows) drops.splice(i, 1);
    }
    // keep the storm sparse: aim for ~1 drop per 12 columns
    if (drops.length < cols / 12 && Math.random() < 0.35) spawn();
    if (moved) render();
  }

  measure();
  // pre-roll so the first paint already has rain mid-fall
  for (var w = 0; w < 120; w++) tick();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var last = 0;
    requestAnimationFrame(function loop(now) {
      if (now - last >= 140) {
        last = now;
        tick();
      }
      requestAnimationFrame(loop);
    });
  }

  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(function () {
      measure();
      render();
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
