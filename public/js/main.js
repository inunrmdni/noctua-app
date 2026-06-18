// ============================================================
// NOCTUA COFFEE — Main JavaScript
// ============================================================

// ---- Theme Toggle (Dark / Light Mode) ----
(function () {
  // Apply saved theme ASAP to avoid flash
  const saved = localStorage.getItem("noctua_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
})();

document.addEventListener("DOMContentLoaded", () => {
  // Wire up theme toggle button
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("noctua_theme", next);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // ---- Mobile nav toggle ----
  const toggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // ---- Menu filter ----
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      const menuCards = document.querySelectorAll(".menu-card");
      menuCards.forEach((card) => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // ---- Scroll reveal ----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  window.applyScrollReveal = function (elementsOrSelector) {
    let targets;
    if (typeof elementsOrSelector === "string") {
      targets = document.querySelectorAll(elementsOrSelector);
    } else if (elementsOrSelector instanceof NodeList) {
      targets = elementsOrSelector;
    } else if (Array.isArray(elementsOrSelector)) {
      targets = elementsOrSelector;
    } else if (elementsOrSelector instanceof HTMLElement) {
      targets = [elementsOrSelector];
    } else {
      return;
    }

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });
  };

  // Run scroll reveal for initial static features/stats
  const initialReveals = document.querySelectorAll(
    ".feature-card, .featured-card, .stat-card, .value-item",
  );
  window.applyScrollReveal(initialReveals);

  // ---- Navbar shrink on scroll ----
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.padding =
        window.scrollY > 50 ? "0.8rem 2.5rem" : "1.2rem 2.5rem";
    });
  }
});

// Helper to normalize image paths input by the user/admin
window.normalizeImagePath = function (path) {
  if (!path) return "";
  let clean = path.trim();
  
  // Remove starting /public if it exists (Express serves public folder content from root)
  if (clean.startsWith("/public")) {
    clean = clean.substring(7);
  }
  
  // Change singular /image/ to plural /images/
  if (clean.startsWith("/image/")) {
    clean = "/images/" + clean.substring(7);
  }
  
  // Ensure starting slash
  if (!clean.startsWith("/") && !clean.startsWith("http")) {
    clean = "/" + clean;
  }
  
  // If it starts with /images/ and has no extension, default to .jpg
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(clean);
  if (clean.startsWith("/images/") && !hasExtension) {
    clean = clean + ".jpg";
  }
  
  return clean;
};

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();

  deferredPrompt = e;

  const btn = document.getElementById("installBtn");

  if (btn) {
    btn.style.display = "block";

    btn.addEventListener("click", async () => {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => {
      console.log("PWA aktif");
    })
    .catch(err => {
      console.log(err);
    });
}