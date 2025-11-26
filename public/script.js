const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const contactForm = document.getElementById("contactForm");
const formStatus = document.querySelector(".formStatus");
const previousBoardsModal = document.getElementById("previousBoardsModal");
const openPreviousBoardsButton = document.getElementById("openPreviousBoards");
const contactModal = document.getElementById("contactModal");
const openContactFormButton = document.getElementById("openContactForm");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");

navToggle.addEventListener("click", (e) => {
  e.preventDefault();
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!formStatus) return;

    formStatus.textContent = "Sending...";

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || "Failed to send");
      }

      contactForm.reset();
      formStatus.textContent = "Message sent successfully. We'll reply soon!";
    } catch (error) {
      formStatus.textContent = error.message || "Something went wrong.";
    }
  });
}

const openModal = (modal) => {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};

const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};

const openPreviousBoardsModal = () => openModal(previousBoardsModal);
const openContactModal = () => openModal(contactModal);

if (openPreviousBoardsButton) {
  openPreviousBoardsButton.addEventListener("click", openPreviousBoardsModal);
}

if (openContactFormButton) {
  openContactFormButton.addEventListener("click", openContactModal);
}

modalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = trigger.closest(".modal");
    closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal.is-open");
    if (openModal) {
      closeModal(openModal);
    }
  }
});

document.getElementById("joinusBtn").addEventListener("click", (e) => {
  e.preventDefault();
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSerlMCEtkZGH-eFunZyPiv1vsia88wSrp7Y2dyIlXE5BpdOfw/viewform?usp=dialog",
    "_blank"
  );
});

const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}
