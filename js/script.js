(function () {
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    const setMenuState = open => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Κλείσιμο μενού" : "Άνοιγμα μενού");
      mobileNav.hidden = !open;
      document.body.classList.toggle("menu-open", open);
    };

    document.addEventListener("click", e => {
      if (mobileNav.hidden) return;
      if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) setMenuState(false);
    });

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      setMenuState(!open);
    });

    mobileNav.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        setMenuState(false);
      })
    );

    document.addEventListener("keydown", event => {
      if (event.key !== "Escape" || mobileNav.hidden) return;
      setMenuState(false);
      toggle.focus();
    });
  }

  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.rel = "noopener noreferrer";
    if (link.querySelector(".visually-hidden")) return;
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = " (ανοίγει σε νέα καρτέλα)";
    link.appendChild(note);
  });

  const tabs = document.querySelectorAll(".tabs .tab");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const arr = Array.from(tabs);
      const i = arr.indexOf(tab);
      const next = e.key === "ArrowRight"
        ? arr[(i + 1) % arr.length]
        : arr[(i - 1 + arr.length) % arr.length];
      next.focus();
      activate(next);
    });
  });

  function activate(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
    const target = tab.getAttribute("aria-controls");
    panels.forEach(p => {
      const on = p.id === target;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }

  const heroBtn = document.querySelector('.btn--hero-primary');
  if (heroBtn) {
    const obs = new IntersectionObserver(([entry]) => {
      heroBtn.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    }, { threshold: 0.5 });
    obs.observe(heroBtn);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  document.querySelectorAll("[data-deadline]").forEach(item => {
    const [year, month, day] = item.dataset.deadline.split("-").map(Number);
    const deadline = new Date(year, month - 1, day);
    deadline.setHours(23, 59, 59, 999);
    const isPastDeadline = deadline < today;
    item.classList.toggle("is-past-deadline", isPastDeadline);

    if (isPastDeadline && !item.querySelector(".deadline-status")) {
      const status = document.createElement("span");
      status.className = "visually-hidden deadline-status";
      status.textContent = " Η προθεσμία έχει παρέλθει.";
      item.appendChild(status);
    }
  });
})();
