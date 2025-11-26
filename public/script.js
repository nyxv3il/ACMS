const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const contactForm = document.getElementById("contactForm");
const formStatus = document.querySelector(".formStatus");
const previousBoardsModal = document.getElementById("previousBoardsModal");
const openPreviousBoardsButton = document.getElementById("openPreviousBoards");
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

const openModal = () => {
  if (!previousBoardsModal) return;
  previousBoardsModal.classList.add("is-open");
  previousBoardsModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};

const closeModal = () => {
  if (!previousBoardsModal) return;
  previousBoardsModal.classList.remove("is-open");
  previousBoardsModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};

if (openPreviousBoardsButton) {
  openPreviousBoardsButton.addEventListener("click", openModal);
}

modalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    previousBoardsModal?.classList.contains("is-open")
  ) {
    closeModal();
  }
});

document.getElementById("joinusBtn").addEventListener("click", (e) => {
  e.preventDefault();
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSerlMCEtkZGH-eFunZyPiv1vsia88wSrp7Y2dyIlXE5BpdOfw/viewform?usp=dialog",
    "_blank"
  );
});
