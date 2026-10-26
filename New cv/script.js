// Personal CV Website — navigation, filters and motion

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  setCurrentYear();
  setupMobileNavigation();
  setupProjectFilters();
  setupBackToTop(reducedMotion);
  setupSectionAnimations(reducedMotion);
  setupActiveNavigation();
});

function setCurrentYear() {
  const year = document.getElementById("current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function setupMobileNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (!toggle || !navigation) return;

  const closeMenu = ({ returnFocus = false } = {}) => {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");

    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
      return;
    }

    navigation.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    document.body.classList.add("menu-open");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu({ returnFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("is-open") &&
      !navigation.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function setupProjectFilters() {
  const buttons = [...document.querySelectorAll(".filter-btn")];
  const cards = [...document.querySelectorAll(".project-card")];
  const status = document.getElementById("project-status");

  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visibleCount = 0;

      buttons.forEach((item) => {
        const isSelected = item === button;
        item.classList.toggle("active", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });

      cards.forEach((card) => {
        const isVisible =
          category === "all" || card.dataset.category === category;

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (status) {
        const label = category === "all" ? "all" : category;
        const noun = visibleCount === 1 ? "project" : "projects";
        status.textContent = `Showing ${visibleCount} ${label} ${noun}.`;
      }
    });
  });
}

function setupBackToTop(reducedMotion) {
  const button = document.querySelector(".back-to-top");

  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  });
}

function setupSectionAnimations(reducedMotion) {
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const sections = document.querySelectorAll(".portfolio-section");
  const observer = new IntersectionObserver(
    (entries, sectionObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        sectionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  sections.forEach((section) => {
    section.classList.add("reveal-ready");
    observer.observe(section);
  });
}

function setupActiveNavigation() {
  if (!("IntersectionObserver" in window)) return;

  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      links.forEach((link) => {
        const isCurrent =
          link.getAttribute("href") === `#${visible.target.id}`;

        if (isCurrent) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-20% 0px -65% 0px",
      threshold: [0, 0.25, 0.5],
    },
  );

  sections.forEach((section) => observer.observe(section));
}
