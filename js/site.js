// Theme toggle — the initial theme is set inline in <head> to avoid a flash.
document.getElementById("theme-toggle").addEventListener("click", function () {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ASCII margin spotlight — the generative margin field is invisible except
// inside a small circle that pans around the margins at random. Inside it,
// glyph weight peaks at the center and fades toward the rim: the ramp index
// itself is boosted, so the "brightness" is real character weight.
// Random per visit; honors prefers-reduced-motion (static spotlight).
(function () {
  var el = document.getElementById("ascii-bg");
  if (!el) return;

  var RAMP = [" ", ".", "\u00b7", ":", "-", "=", "+", "*", "#"];
  var CW = 6.6, LH = 14;    // match .ascii-bg font metrics
  var COLUMN = 760 / 2 + 28; // half content width + breathing room
  var R = 200;               // spotlight radius, px

  var f1 = 0.35 + Math.random() * 0.2;
  var f2 = 0.16 + Math.random() * 0.1;
  var p1 = Math.random() * 6.28;
  var p2 = Math.random() * 6.28;

  var cols = 0, rows = 0, base = null, vw = 0, vh = 0;

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    cols = Math.ceil(vw / CW);
    rows = Math.ceil(vh / LH);
    var maxEdge = vw / 2 - COLUMN;
    base = new Float64Array(cols * rows);
    if (maxEdge < 40) return; // no margins: field stays empty
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var px = x * CW + CW / 2;
        var edge = Math.abs(px - vw / 2) - COLUMN;
        if (edge <= 0) continue;
        var w = Math.min(1, edge / maxEdge);
        var n = 0.5 + 0.25 * Math.sin(x * f1 + y * 0.6 + p1)
                    + 0.25 * Math.sin(x * f2 - y * 0.3 + p2);
        base[y * cols + x] = Math.pow(w, 1.4) * n * (RAMP.length - 1) * 1.35;
      }
    }
  }

  // spotlight wandering: eased hops between random points in the margins
  var sx = 0, sy = 0, ox = 0, oy = 0, tx = 0, ty = 0, t0 = 0, dur = 1;

  function randomPoint() {
    var band = vw / 2 - COLUMN;
    var left = Math.random() < 0.5;
    var x = 30 + Math.random() * Math.max(60, band - 60);
    return {
      x: left ? x : vw - x,
      y: vh * (0.12 + Math.random() * 0.76),
    };
  }

  function retarget(now) {
    var p = randomPoint();
    ox = sx; oy = sy;
    tx = p.x; ty = p.y;
    t0 = now;
    dur = 3500 + Math.random() * 4500;
  }

  function render() {
    var lines = [];
    for (var y = 0; y < rows; y++) {
      var line = "";
      var py = y * LH + LH / 2;
      var dy = py - sy;
      if (dy > R || dy < -R) { lines.push(""); continue; }
      for (var x = 0; x < cols; x++) {
        var b = base[y * cols + x];
        if (b === 0) { line += " "; continue; }
        var dx = x * CW + CW / 2 - sx;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d > R) { line += " "; continue; }
        var fac = 1 - d / R; // 1 at spotlight center, 0 at rim
        var i = Math.round(b * (0.2 + 1.25 * fac));
        line += RAMP[i < 0 ? 0 : i >= RAMP.length ? RAMP.length - 1 : i];
      }
      lines.push(line);
    }
    el.textContent = lines.join("\n");
  }

  measure();
  var start = randomPoint();
  sx = start.x; sy = start.y;
  render();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    retarget(performance.now());
    var last = 0;
    requestAnimationFrame(function loop(now) {
      if (now - last >= 80) {
        last = now;
        var u = (now - t0) / dur;
        if (u >= 1) {
          sx = tx; sy = ty;
          retarget(now);
        } else {
          var e = u * u * (3 - 2 * u); // smoothstep glide
          sx = ox + (tx - ox) * e;
          sy = oy + (ty - oy) * e;
        }
        render();
      }
      requestAnimationFrame(loop);
    });
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      measure();
      render();
    }, 150);
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
