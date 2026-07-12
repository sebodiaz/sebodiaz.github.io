// Theme toggle — the initial theme is set inline in <head> to avoid a flash.
document.getElementById("theme-toggle").addEventListener("click", function () {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// Math rain — sparse terminal rain whose glyphs are LaTeX/math symbols.
// Each drop is one element falling via a CSS transform animation, so the
// motion is compositor-smooth with no per-frame JS. The trail is muted;
// the leading (bottom) glyph is brighter. prefers-reduced-motion pauses
// the animations mid-fall via CSS, leaving a static field.
(function () {
  var el = document.getElementById("ascii-bg");
  if (!el) return;

  var GLYPHS = "∂∇Σλθπ∫αβγμσφψΩξητ≈∞×01+−=";
  var CW = 6.6; // match .ascii-bg font metrics

  function glyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }

  var WEIGHTS = [300, 400, 500, 600, 700];

  function maxDrops() {
    return Math.max(8, Math.round(window.innerWidth / CW / 7));
  }

  function spawn(delay) {
    var len = 3 + Math.floor(Math.random() * 6);
    var trail = "";
    for (var i = 0; i < len - 1; i++) trail += glyph() + "\n";
    var drop = document.createElement("span");
    drop.className = "drop";
    drop.textContent = trail;
    var head = document.createElement("b");
    head.textContent = glyph();
    drop.appendChild(head);
    var col = Math.floor(Math.random() * (window.innerWidth / CW));
    drop.style.left = (col * CW).toFixed(1) + "px";
    // uniform weight sampling gives the rain depth: light drops read
    // as distant, heavy drops as near
    drop.style.fontWeight = WEIGHTS[Math.floor(Math.random() * WEIGHTS.length)];
    var duration = 11 + Math.random() * 12;
    drop.style.animationDuration = duration.toFixed(1) + "s";
    drop.style.animationDelay = delay.toFixed(1) + "s";

    // at one random moment of the descent, 75% chance the glyphs adjust
    var remaining = (duration + delay) * 1000;
    if (remaining > 500) {
      setTimeout(function () {
        if (!drop.isConnected || Math.random() >= 0.75) return;
        var text = drop.firstChild.nodeValue;
        var out = "";
        for (var j = 0; j < text.length; j++) {
          out += text[j] === "\n" ? "\n" : (Math.random() < 0.5 ? glyph() : text[j]);
        }
        drop.firstChild.nodeValue = out;
        if (Math.random() < 0.5) head.textContent = glyph();
      }, Math.random() * remaining);
    }

    drop.addEventListener("animationend", function () {
      drop.remove();
      if (el.childElementCount < maxDrops()) spawn(Math.random() * 4);
    });
    el.appendChild(drop);
  }

  // negative delays start the first drops mid-fall, so the screen is
  // already raining on load instead of waiting a full descent
  for (var i = 0, n = maxDrops(); i < n; i++) {
    spawn(-Math.random() * 16);
  }
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
