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
  "[data-project-modal-close]",
);
const achievementModal = document.getElementById("achievementModal");
const achievementModalCloseTriggers =
  document.querySelectorAll("[data-modal-close]");
const achievementModalContent = document.getElementById(
  "achievementModalContent",
);

const boardFeatured = document.getElementById("boardFeatured");
const boardMembersList = document.getElementById("boardMembersList");
const currentBoardTitle = document.getElementById("currentBoardTitle");
const currentBoardImage = document.getElementById("currentBoardImage");
const projectsGrid = document.getElementById("projectsGrid");
const achievementsGrid = document.getElementById("achievementsGrid");

let projectDescriptions = {};
let achievementDetails = {};

const loadJson = async (path) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createFeaturedCard = (member) => `
  <div class="card">
    <img loading="lazy" src="${member.image}" alt="${member.alt || member.role}" class="cardImg" />
    <div class="cardInfo">
      <h3 class="cardName">${member.name}</h3>
      <p class="cardTitle">${member.role}</p>
    </div>
  </div>
`;

const renderBoardSection = (boardData) => {
  if (!boardData) return;

  if (boardFeatured && Array.isArray(boardData.featured)) {
    const president = boardData.featured.find(
      (member) => member.group === "president",
    );
    const others = boardData.featured.filter(
      (member) => member.group !== "president",
    );

    boardFeatured.innerHTML = `
      <div class="president">
        ${president ? createFeaturedCard(president) : ""}
      </div>
      <div class="others">
        ${others.map((member) => createFeaturedCard(member)).join("")}
      </div>
    `;
  }

  if (boardMembersList && Array.isArray(boardData.members)) {
    boardMembersList.innerHTML = boardData.members
      .map(
        (member) => `
          <span>${member.name} -
            <p>${member.role}</p>
          </span>
        `,
      )
      .join("");
  }

  if (boardData.currentBoard) {
    if (currentBoardTitle) {
      currentBoardTitle.textContent = boardData.currentBoard.title || "";
    }

    if (currentBoardImage) {
      currentBoardImage.src = boardData.currentBoard.image || "";
      currentBoardImage.alt = boardData.currentBoard.alt || "Board Photo";
    }
  }
};

const renderProjectsSection = (projects) => {
  if (!projectsGrid || !Array.isArray(projects)) return;

  projectDescriptions = projects.reduce((acc, project) => {
    acc[project.id] = {
      title: project.title,
      description: project.description,
      link: project.link || "",
      linkText: project.linkText || "",
    };
    return acc;
  }, {});

  projectsGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="projectCard" role="listitem">
          <img loading="lazy" src="${project.image}" alt="${project.alt || project.title}" class="projectCardImage" />
          <div class="projectCardBody">
            <h3 class="projectCardTitle">${project.title}</h3>
            <p class="projectCardDesc">
              ${project.summary}
            </p>
            <button class="projectButton" type="button" data-project="${project.id}">
              Learn More
            </button>
          </div>
        </article>
      `,
    )
    .join("");
};

const renderAchievementsSection = (achievements) => {
  if (!achievementsGrid || !Array.isArray(achievements)) return;

  achievementDetails = achievements.reduce((acc, achievement) => {
    acc[achievement.id] = {
      title: achievement.modalTitle || achievement.title,
      description: achievement.description,
    };
    return acc;
  }, {});

  achievementsGrid.innerHTML = achievements
    .map(
      (achievement) => `
        <article class="card">
          <h3 class="cardTitle">${achievement.title}</h3>
          <p class="cardDesc">
            ${achievement.summary}
          </p>
          <button class="learnMore" data-achievement="${achievement.id}">Learn More</button>
        </article>
      `,
    )
    .join("");
};

const initializeDynamicContent = async () => {
  const [boardData, projectsData, achievementsData] = await Promise.all([
    loadJson("/data/board-members.json"),
    loadJson("/data/projects.json"),
    loadJson("/data/achievements.json"),
  ]);

  renderBoardSection(boardData);
  renderProjectsSection(projectsData);
  renderAchievementsSection(achievementsData);
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

const openProjectModal = (projectKey) => {
  if (!projectModal || !projectDescriptions[projectKey]) return;
  const project = projectDescriptions[projectKey];
  projectModalTitle.textContent = project.title;
  const hasLink = Boolean(project.link);
  const linkHref = hasLink ? project.link : "#";
  const buttonText =
    project.linkText || (hasLink ? "Visit Website" : "Website Coming Soon");
  const linkAttributes = hasLink
    ? `target="_blank" rel="noopener noreferrer"`
    : `aria-disabled="true"`;

  projectModalContent.innerHTML = `
    <p>${project.description}</p>
    <a class="projectVisitButton${hasLink ? "" : " is-disabled"}" href="${linkHref}" ${linkAttributes}>${buttonText}</a>
  `;
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

document.addEventListener("click", (e) => {
  const projectButton = e.target.closest("[data-project]");
  if (!projectButton) return;
  e.preventDefault();
  const projectKey = projectButton.getAttribute("data-project");
  openProjectModal(projectKey);
});

projectModalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("is-open")) {
    closeProjectModal();
  }
});

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

document.addEventListener("click", (e) => {
  const achievementButton = e.target.closest("[data-achievement]");
  if (!achievementButton) return;

  const key = achievementButton.getAttribute("data-achievement");
  const data = achievementDetails[key];

  if (data && achievementModal) {
    achievementModalContent.innerHTML = `
      <h2>${data.title}</h2>
      <p>${data.description}</p>
    `;
    openAchievementModal();
  }
});

document.querySelectorAll("[data-modal-close]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    closeAchievementModal();
    closeModal();
  });
});

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
    "_blank",
  );
});

const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

initializeDynamicContent();
