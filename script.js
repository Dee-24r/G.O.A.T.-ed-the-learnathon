/* ============================================================
   G.O.A.T.'ed — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Countdown to Aug 15, 2026 09:00 ---------- */
  var EVENT = new Date("2026-08-15T09:00:00").getTime();
  var countdowns = document.querySelectorAll(".countdown");
  var navChip = document.getElementById("navCountdown");

  function tick() {
    var diff = EVENT - Date.now();
    var done = diff <= 0;
    var d = done ? 0 : Math.floor(diff / 86400000);
    var h = done ? 0 : Math.floor((diff % 86400000) / 3600000);
    var m = done ? 0 : Math.floor((diff % 3600000) / 60000);
    var s = done ? 0 : Math.floor((diff % 60000) / 1000);

    countdowns.forEach(function (cd) {
      set(cd, "days", d); set(cd, "hours", h);
      set(cd, "minutes", m); set(cd, "seconds", s);
    });
    if (navChip) navChip.textContent = done ? "Happening now! 🐐" : "Starts in " + d + "d";
  }
  function set(scope, unit, val) {
    var el = scope.querySelector('[data-unit="' + unit + '"]');
    if (el) el.textContent = val < 10 ? "0" + val : "" + val;
  }
  if (countdowns.length) { tick(); setInterval(tick, 1000); }

  /* ---------- Mobile drawer ---------- */
  var burger = document.getElementById("navBurger");
  var drawer = document.getElementById("drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.hasAttribute("hidden");
      if (open) drawer.removeAttribute("hidden"); else drawer.setAttribute("hidden", "");
      burger.setAttribute("aria-expanded", String(open));
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Schedule tabs ---------- */
  var tabWrap = document.getElementById("scheduleTabs");
  if (tabWrap) {
    var btns = tabWrap.querySelectorAll(".tabs__btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-tab");
        btns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", String(active));
        });
        tabWrap.querySelectorAll(".tabs__panel").forEach(function (p) {
          var show = p.id === target;
          p.classList.toggle("is-active", show);
          if (show) p.removeAttribute("hidden"); else p.setAttribute("hidden", "");
        });
      });
    });
  }

  /* ---------- Scroll reveal + stat counters ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.target.classList.contains("stats")) animateStats(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal, .stats").forEach(function (el) { io.observe(el); });

  function animateStats(scope) {
    scope.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var start = null, dur = 1200;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Email sign-up (no backend — friendly confirm) ---------- */
  function wireSignup(formId, noteId) {
    var form = document.getElementById(formId);
    var note = document.getElementById(noteId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (note) note.textContent = "🎉 You're on the list! We'll be in touch soon.";
      form.reset();
      if (input) input.blur();
    });
  }
  wireSignup("heroSignup", "heroSignupNote");
  wireSignup("finalSignup", "finalSignupNote");
})();
