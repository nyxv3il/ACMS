const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const contactForm = document.getElementById("contactForm");
const formStatus = document.querySelector(".formStatus");
const previousBoardsModal = document.getElementById("previousBoardsModal");
const openPreviousBoardsButton = document.getElementById("openPreviousBoards");
const modalCloseTriggers = document.querySelectorAll("[data-modal-close]");
const projectModal = document.getElementById("projectModal");
const projectModalTitle = document.getElementById("projectModalTitle");
const projectModalContent = document.getElementById("projectModalContent");
const projectModalCloseTriggers = document.querySelectorAll(
  "[data-project-modal-close]"
);
const projectButtons = document.querySelectorAll("[data-project]");
const achievementModal = document.getElementById("achievementModal");
const achievementModalCloseTriggers =
  document.querySelectorAll("[data-modal-close]");

// Project descriptions
const projectDescriptions = {
  apeiro: {
    title: "'APEIRO",
    description: `Apeiro'26 is an annual Mathematics day, organized by the Mathematics Society of Ananda College to motivate and transform a love for mathematics into action. The exciting event brings students from various schools together on a common platform for a day of challenging competitions, interesting activities, and fruitful problem-solving sessions. <br><br> Taking place annually this is not merely a competitive event; it is a celebration of creativity and innovation and critical thinking in mathematics. Propelling collaboration and igniting intellectual curiosity, the event aims for enhanced problem-solving abilities in participants while also promoting teamwork and friendly competition. With splendid planning and enthusiasm, Apeiro'26 perfectly embodies the society's commitment to foster the next generation of mathematical thinkers and a thriving community of aspiring mathematicians.`,
  },
  mathematics: {
    title: "MATHEMATICS",
    description: `Mathemics'26 is an all island inter school mathematics competition organized by the Ananda College Mathematics Society. This event seeks to bring together young mathematicians of this country to offer the challenge of performing excellently in mathematical problem solving and analytical thinking. <br> <br> By fostering collaboration, creativity, and love for mathematics amongst students, the competition attains the following goals of allowing them to display their talents, gain confidence, and inspire a sense of camaraderie. In support of its vision for inclusivity and excellence, Mathemics will provide a nurturing environment for the next generation of problem solvers and critical thinkers, which will bring vitality to the larger mathematics community.`,
  },
  numeracy: {
    title: "NUMERACY",
    description: `Organized by the Ananda College Mathematics Society, Numeracy is a captivating intra school quiz competition that aims to challenge students' mathematical abilities and inspires a love for the subject. In this opportunity for students to be light, they compete through challenging rounds with the aim of showcasing critical thinking and problem solving skills. With a mixed array of rounds, Numeracy pits individual performances against team concepts before moving into territory that invites the students to dig deep from basic arithmetic to crystalline applications in reality. <br> <br> It provides an opportunity for the students not only to test their academic upbringing but also the needlessly invincible spirit of being challenged to think creatively and work collaboratively to solve problems under a time constraint. Which may further be extended towards academic pursuit. By inclining to the notion of competition, Numeracy creates a friendly, motivational atmosphere for students to showcase their talents, develop their minds, and build self confidence to apply the concept in real time situations. Numeracy seeks in the long run to extent a lifelong love for learning, developing an interest in mathematics with the interpretation of academic excellence.`,
  },
};

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

// Project modal functions
const openProjectModal = (projectKey) => {
  if (!projectModal || !projectDescriptions[projectKey]) return;
  const project = projectDescriptions[projectKey];
  projectModalTitle.textContent = project.title;
  projectModalContent.innerHTML = `<p>${project.description}</p>`;
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};

const closeProjectModal = () => {
  if (!projectModal) return;
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};

projectButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const projectKey = button.getAttribute("data-project");
    openProjectModal(projectKey);
  });
});

projectModalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("is-open")) {
    closeProjectModal();
  }
});

// Achievement modal functions
const openAchievementModal = () => {
  if (!achievementModal) return;
  achievementModal.classList.add("is-open");
  achievementModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};

const closeAchievementModal = () => {
  if (!achievementModal) return;
  achievementModal.classList.remove("is-open");
  achievementModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};

// Achievement modal event listeners
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-modal='achievementModal']")) {
    e.preventDefault();
    openAchievementModal();
  }
});

achievementModalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeAchievementModal);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    achievementModal?.classList.contains("is-open")
  ) {
    closeAchievementModal();
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
