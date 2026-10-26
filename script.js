// Personal CV Website - Interactive Features

document.addEventListener("DOMContentLoaded", () => {
  // Automatically update the footer year
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Filter projects by category
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectStatus = document.getElementById("project-status");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const shouldShow =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;

        card.hidden = !shouldShow;

        if (shouldShow) visibleCount++;
      });

      if (projectStatus) {
        projectStatus.textContent = `Showing ${visibleCount} ${selectedCategory} project(s).`;
      }
    });
  });

  // Back-to-top button
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 400);
    };

    window.addEventListener("scroll", updateBackToTop, {
      passive: true,
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }

  // Gentle section entrance animations
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.animate(
            [
              { opacity: 0.6, transform: "translateY(18px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 550,
              easing: "ease-out",
            },
          );

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll(".portfolio-section")
      .forEach((section) => sectionObserver.observe(section));
  }
});
