document.addEventListener("DOMContentLoaded", function () {
  initNavigation();

  initSmoothScrolling();

  initDownloadFunctionality();

  initAnimations();

  initThemeSwitcher();
});

function initNavigation() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (this.classList.contains("dropdown-toggle")) {
        return;
      }
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false,
        });
        bsCollapse.hide();
      }
    });
  });
}

function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

function initDownloadFunctionality() {
  const downloadBtn = document.getElementById("downloadBtn");
  const videoUrlInput = document.getElementById("videoUrl");
  const downloadOptions = document.getElementById("downloadOptions");
  const qualityButtons = document.querySelectorAll(".quality-buttons .btn");

  const heroDownloadBtn = document.getElementById("heroDownloadBtn");
  const heroVideoUrlInput = document.getElementById("heroVideoUrl");

  function handleDownload(videoUrlInputElem, downloadBtnElem) {
    const videoUrl = videoUrlInputElem.value.trim();

    if (!videoUrl) {
      showAlert("Please enter a Facebook video URL", "warning");
      return;
    }

    if (!isValidFacebookUrl(videoUrl)) {
      showAlert("Please enter a valid Facebook video URL", "error");
      return;
    }

    downloadBtnElem.classList.add("loading");
    downloadBtnElem.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';

    setTimeout(() => {
      downloadBtnElem.classList.remove("loading");
      downloadBtnElem.innerHTML = '<i class="fas fa-download"></i> Download';

      if (downloadBtnElem.id === "downloadBtn") {
        downloadOptions.style.display = "block";
        downloadOptions.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      showAlert("Video found! Choose your preferred quality below.", "success");
    }, 2000);
  }

  downloadBtn.addEventListener("click", function () {
    handleDownload(videoUrlInput, downloadBtn);
  });

  heroDownloadBtn.addEventListener("click", function () {
    handleDownload(heroVideoUrlInput, heroDownloadBtn);
  });

  qualityButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quality = this.textContent.trim();

      qualityButtons.forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");

      simulateDownload(quality);
    });
  });

  videoUrlInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      downloadBtn.click();
    }
  });

  heroVideoUrlInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      heroDownloadBtn.click();
    }
  });
}

function isValidFacebookUrl(url) {
  const facebookRegex = /^https?:\/\/(www\.)?(facebook\.com|fb\.watch)/;
  return facebookRegex.test(url);
}

function simulateDownload(quality) {
  showAlert(`Preparing ${quality} download...`, "info");

  setTimeout(() => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "#";
    downloadLink.download = `facebook_video_${quality
      .toLowerCase()
      .replace(" ", "_")}.mp4`;

    showAlert(`Download started! Check your downloads folder.`, "success");

    setTimeout(() => {
      document.getElementById("videoUrl").value = "";
      document.getElementById("downloadOptions").style.display = "none";
      document.querySelectorAll(".quality-buttons .btn").forEach((btn) => {
        btn.classList.remove("active");
      });
    }, 3000);
  }, 1500);
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".feature-card, .step-card, .section-title, .section-subtitle"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  const style = document.createElement("style");
  style.textContent = `
        .feature-card, .step-card, .section-title, .section-subtitle {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature-card.animate, .step-card.animate, .section-title.animate, .section-subtitle.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
  document.head.appendChild(style);
}

function showAlert(message, type = "info") {
  const existingAlerts = document.querySelectorAll(".custom-alert");
  existingAlerts.forEach((alert) => alert.remove());

  const alert = document.createElement("div");
  alert.className = `custom-alert alert-${type}`;
  alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  const alertStyles = `
        .custom-alert {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease;
        }
        
        .alert-content {
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
        }
        
        .alert-success { background: linear-gradient(135deg, #27ae60, #2ecc71); }
        .alert-error { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        .alert-warning { background: linear-gradient(135deg, #f39c12, #e67e22); }
        .alert-info { background: linear-gradient(135deg, #3498db, #2980b9); }
        
        .alert-close {
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .alert-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideInRight {
            0% {
                transform: translateX(100%);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

  if (!document.querySelector("#alert-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "alert-styles";
    styleSheet.textContent = alertStyles;
    document.head.appendChild(styleSheet);
  }

  document.body.appendChild(alert);

  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}

function getAlertIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  };
  return icons[type] || "info-circle";
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function optimizePerformance() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  const preloadLinks = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
  ];

  preloadLinks.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = "style";
    document.head.appendChild(link);
  });
}

window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
  showAlert("An error occurred. Please try again.", "error");
});

function initThemeSwitcher() {
  setTimeout(() => {
    const colorOptions = document.querySelectorAll(".color-option");
    const body = document.body;

    if (colorOptions.length === 0) {
      console.warn("Color options not found");
      return;
    }

    let savedColor = localStorage.getItem("selectedColor");
    const validColors = Array.from(colorOptions).map((option) =>
      option.getAttribute("data-color")
    );

    if (!savedColor || !validColors.includes(savedColor)) {
      savedColor = "default";
      localStorage.setItem("selectedColor", savedColor);
    }

    applyColor(savedColor);
    updateActiveColor(savedColor);

    colorOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        const color = this.getAttribute("data-color");
        applyColor(color);
        updateActiveColor(color);
        localStorage.setItem("selectedColor", color);

        const colorName = this.textContent.trim();
        showAlert(`Theme changed to ${colorName}`, "success");
      });
    });

    function applyColor(color) {
      body.removeAttribute("data-color");
      document.documentElement.removeAttribute("data-color");

      // Apply color
      if (color !== "default") {
        body.setAttribute("data-color", color);
        document.documentElement.setAttribute("data-color", color);
      } else {
        body.setAttribute("data-color", "default");
        document.documentElement.setAttribute("data-color", "default");
      }

      const preloader = document.getElementById("preloader");
      if (preloader && preloader.style.display !== "none") {
        updatePreloaderColor(color);
      }
    }

    function updateActiveColor(activeColor) {
      colorOptions.forEach((option) => {
        option.classList.remove("active");
        if (option.getAttribute("data-color") === activeColor) {
          option.classList.add("active");
        }
      });
    }

    function updatePreloaderColor(color) {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.removeAttribute("data-color");
        if (color !== "default") {
          preloader.setAttribute("data-color", color);
        }
      }
    }
  }, 100);
}

optimizePerformance();
