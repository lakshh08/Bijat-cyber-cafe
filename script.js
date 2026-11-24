const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const siteHeader = document.querySelector(".site-header");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    primaryNav.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    primaryNav.classList.remove("is-open");
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-wrap") && menuToggle.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    primaryNav.classList.remove("is-open");
  }
});

const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".section-heading, .service-card, .price-row, .order-copy, .order-form, .step-card, .student-checklist > div, .why-list > div, .about-visual, .about-content, .map-card, .faq-list details"
);
if (!reducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  document.querySelectorAll(".service-grid, .steps-grid, .student-checklist, .why-list, .price-list, .faq-list").forEach((group) => {
    group.classList.add("reveal-stagger");
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
}

const orderForm = document.querySelector("#order-form");
const fileInput = document.querySelector("#pdf-file");
const fileName = document.querySelector("#file-name");
const formMessage = document.querySelector("#form-message");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileName.textContent = file ? file.name : "Choose a file";
  formMessage.textContent = "";
  if (file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    formMessage.textContent = "Please choose a PDF file.";
    fileInput.value = "";
    fileName.textContent = "Choose a file";
  }
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (!orderForm.reportValidity()) return;

  const formData = new FormData(orderForm);
  const file = fileInput.files[0];
  if (file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    formMessage.textContent = "Please choose a PDF file.";
    fileInput.focus();
    return;
  }

  const message = [
    "Hi BIJAT Cyber Cafe, I would like to request a printing order.",
    "",
    `Name: ${formData.get("name")}`,
    `Mobile: ${formData.get("mobile")}`,
    `Number of pages: ${formData.get("pages")}`,
    `Printing type: ${formData.get("printType")}`,
    `Printing side: ${formData.get("side")}`,
    `Quantity: ${formData.get("quantity")}`,
    `Additional instructions: ${formData.get("instructions") || "None"}`,
    `PDF to attach: ${file ? file.name : "Not selected"}`,
    "",
    "I will attach my PDF in this WhatsApp chat."
  ].join("\n");

  window.location.assign(`https://wa.me/917807631613?text=${encodeURIComponent(message)}`);
});
