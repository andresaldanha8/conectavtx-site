/* Conecta VTX — interações premium */
(function () {
  "use strict";

  // Ano dinâmico
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Nav scroll + mobile
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = document.getElementById("burger");
    if (burger) {
      burger.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
      document.querySelectorAll(".nav__links a, .nav__mobileCta").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
        });
      });
    }
  }

  // Reveal on scroll
  var items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var d = parseInt(e.target.getAttribute("data-delay") || "0", 10);
            setTimeout(function () {
              e.target.classList.add("is-in");
            }, d);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  // Hero mock: parallax + tilt compostos
  var mock = document.querySelector(".hero__mock");
  if (mock && window.matchMedia("(min-width: 900px)").matches) {
    var state = { ty: 0, rx: 0, ry: 0, tRx: 0, tRy: 0 };
    var raf = null;
    var apply = function () {
      mock.style.transform =
        "perspective(1400px) translateY(" +
        state.ty.toFixed(2) +
        "px)" +
        " rotateX(" +
        state.rx.toFixed(2) +
        "deg) rotateY(" +
        state.ry.toFixed(2) +
        "deg)";
    };
    var schedule = function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        state.rx += (state.tRx - state.rx) * 0.15;
        state.ry += (state.tRy - state.ry) * 0.15;
        apply();
        if (Math.abs(state.tRx - state.rx) > 0.01 || Math.abs(state.tRy - state.ry) > 0.01)
          schedule();
        raf = null;
      });
    };
    window.addEventListener(
      "scroll",
      function () {
        state.ty = Math.max(-40, Math.min(40, window.scrollY * -0.06));
        schedule();
      },
      { passive: true },
    );
    mock.addEventListener("mousemove", function (e) {
      var r = mock.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      state.tRx = py * -3;
      state.tRy = px * 4;
      schedule();
    });
    mock.addEventListener("mouseleave", function () {
      state.tRx = 0;
      state.tRy = 0;
      schedule();
    });
  }

  // Cursor spotlight (desktop apenas)
  var spot = document.querySelector(".cursor-spot");
  if (spot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var sx = 0,
      sy = 0,
      tx = 0,
      ty = 0,
      sraf = null;
    var loop = function () {
      sx += (tx - sx) * 0.18;
      sy += (ty - sy) * 0.18;
      spot.style.transform = "translate3d(" + sx + "px," + sy + "px,0) translate(-50%,-50%)";
      sraf = requestAnimationFrame(loop);
    };
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!spot.classList.contains("is-on")) spot.classList.add("is-on");
      if (!sraf) loop();
    });
    document.addEventListener("mouseleave", function () {
      spot.classList.remove("is-on");
    });
  }

  // Botões magnéticos
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transition = "transform .15s ease-out";
        btn.style.transform = "translate(" + x * 0.18 + "px," + y * 0.25 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transition = "transform .5s cubic-bezier(.2,.7,.2,1)";
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  // Contadores animados
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var dur = 1400,
        start = performance.now();
      var existingSmall = el.querySelector("small");
      var smallHTML = existingSmall ? existingSmall.outerHTML : "";
      var step = function (now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        if (existingSmall) el.innerHTML = val + " " + smallHTML;
        else el.textContent = val;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animate(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach(function (c) {
      cio.observe(c);
    });
  }
})();
