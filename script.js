/* ============================================================
   G.O.A.T.'ed — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Countdown to Aug 14, 2026 09:00 ---------- */
  var EVENT = new Date("2026-08-14T09:00:00").getTime();
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
    if (navChip) navChip.textContent = done ? "Happening now!" : "Starts in " + d + "d";
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

  /* ---------- Modals (mentor / sponsor) ---------- */
  var lastFocused = null;
  function openModal(id) {
    var modal = document.getElementById("modal-" + id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  document.querySelectorAll("[data-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () { openModal(btn.getAttribute("data-modal")); });
  });
  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal(modal);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll('.modal[aria-hidden="false"]').forEach(closeModal);
    }
  });

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

  /* ---------- Forms → Netlify Forms (AJAX, so we keep the inline confirm) ---------- */
  function wireForm(formId, noteId, successMsg) {
    var form = document.getElementById(formId);
    var note = document.getElementById(noteId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function () {
        if (note) note.textContent = successMsg;
        form.reset();
      }).catch(function () {
        if (note) note.textContent = "Hmm, that didn't go through — please try again.";
      });
    });
  }
  wireForm("heroSignup", "heroSignupNote", "🎉 You're on the list! We'll be in touch soon.");
  wireForm("finalSignup", "finalSignupNote", "🎉 You're on the list! We'll be in touch soon.");
  wireForm("contactForm", "contactNote", "Thanks for reaching out! We'll get back to you soon.");
})();
