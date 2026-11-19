
/* =========================================================
   Student Portfolio - script.js
   1. Mobile menu
   2. Projects from JSON
   3. GitHub API
   4. Contact form validation
   5. Back to top button
   ========================================================= */

// GitHub username
const GITHUB_USERNAME = "lykataguding";


/* ---------- 1. Mobile menu ---------- */

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("open");

    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });
}


/* ---------- 2. Load projects from JSON ---------- */

const projectsGrid = document.getElementById("projectsGrid");

async function loadProjects() {
  if (!projectsGrid) {
    console.error("Projects section not found. Check the projectsGrid ID.");
    return;
  }

  try {
    const response = await fetch("data/projects.json");

    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }

    const projects = await response.json();

    projectsGrid.innerHTML = "";

    projects.forEach(function (project) {
      projectsGrid.appendChild(createProjectCard(project));
    });

  } catch (error) {
    console.error("Projects could not be loaded:", error);

    projectsGrid.innerHTML =
      '<p class="status-message error">Unable to load projects. Please try again later.</p>';
  }
}


// Create project cards

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "card project-card";

  const img = document.createElement("img");
  img.src = project.screenshot;
  img.alt = "Screenshot of " + project.title;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "project-body";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const badges = document.createElement("ul");
  badges.className = "badges";

  (project.technologies || []).forEach(function (tech) {
    const li = document.createElement("li");
    li.textContent = tech;
    badges.appendChild(li);
  });

  const role = document.createElement("p");
  role.className = "project-role";
  role.textContent = "My role: " + project.role;

  const link = document.createElement("a");
  link.className = "btn btn-outline";
  link.href = project.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = project.liveLink
    ? "View Source Code"
    : "View Project";

  body.append(title, description, badges, role, link);

  if (project.liveLink) {
    const liveLink = document.createElement("a");
    liveLink.className = "btn btn-primary";
    liveLink.href = project.liveLink;
    liveLink.target = "_blank";
    liveLink.rel = "noopener noreferrer";
    liveLink.textContent = "View Live Project";

    body.appendChild(liveLink);
  }

  // Download Android APK
  if (project.apkLink) {
    const apkLink = document.createElement("a");
    apkLink.className = "btn btn-primary";
    apkLink.href = project.apkLink;
    apkLink.target = "_blank";
    apkLink.rel = "noopener noreferrer";
    apkLink.textContent = "Download Android App";

    body.appendChild(apkLink);
  }

  card.append(img, body);

  return card;
}

/* ---------- 3. GitHub repositories ---------- */

const repoList = document.getElementById("repoList");

async function loadRepos() {
  if (!repoList) {
    console.error("GitHub repository section not found. Check the repoList ID.");
    return;
  }

  try {
    const url =
      "https://api.github.com/users/" +
      GITHUB_USERNAME +
      "/repos?sort=updated&per_page=10";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }

    const repos = await response.json();

    repoList.innerHTML = "";

    if (repos.length === 0) {
      repoList.innerHTML =
        '<li class="status-message">No public repositories found.</li>';
      return;
    }

    repos.forEach(function (repo) {
      const item = document.createElement("li");
      item.className = "repo-item";

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = repo.name;

      const language = document.createElement("span");
      language.className = "repo-lang";
      language.textContent =
        repo.language || "Language not specified";

      item.append(link, language);
      repoList.appendChild(item);
    });

  } catch (error) {
    console.error("GitHub repositories could not be loaded:", error);

    repoList.innerHTML =
      '<li class="status-message error">GitHub repositories are currently unavailable. Please try again later.</li>';
  }
}


/* ---------- 4. Contact form validation ---------- */

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formSuccess = document.getElementById("formSuccess");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(input, errorId, message) {
  const errorElement = document.getElementById(errorId);

  if (errorElement && input) {
    errorElement.textContent = message;
    input.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", message !== "");
  }
}

if (
  form &&
  nameInput &&
  emailInput &&
  messageInput &&
  formSuccess
) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    formSuccess.textContent = "";

    let valid = true;

    if (nameInput.value.trim() === "") {
      showError(nameInput, "nameError", "Please enter your name.");
      valid = false;
    } else {
      showError(nameInput, "nameError", "");
    }

    if (emailInput.value.trim() === "") {
      showError(
        emailInput,
        "emailError",
        "Please enter your email address."
      );
      valid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      showError(
        emailInput,
        "emailError",
        "Please enter a valid email address."
      );
      valid = false;
    } else {
      showError(emailInput, "emailError", "");
    }

    if (messageInput.value.trim() === "") {
      showError(
        messageInput,
        "messageError",
        "Please enter a message."
      );
      valid = false;
    } else {
      showError(messageInput, "messageError", "");
    }

    if (!valid) {
      return;
    }

    formSuccess.textContent =
      "Thank you! Your message has been received.";

    form.reset();
  });
}


/* ---------- 5. Back to top button ---------- */

const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", function () {
    backToTop.classList.toggle(
      "visible",
      window.scrollY > 300
    );
  });

  backToTop.addEventListener("click", function () {
    const home = document.getElementById("home");

    if (home) {
      home.scrollIntoView({ behavior: "smooth" });
    }
  });
}


/* ---------- Start all functions ---------- */

loadProjects();
loadRepos();
