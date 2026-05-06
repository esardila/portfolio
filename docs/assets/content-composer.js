let portfolioData = null;
let resumeData = null;

Promise.all([
  fetch("./data/portfolio.json").then((r) => r.json()),
  fetch("./data/resume.json").then((r) => r.json()),
])
  .then(([portfolio, resume]) => {
    portfolioData = portfolio;
    resumeData = resume;
    render();
  })
  .catch((err) => console.error("Failed to load data:", err));

// document.getElementById("pageTabs").addEventListener("click", (e) => {
//   if (e.target.dataset.page) {
//     document
//       .querySelectorAll("#pageTabs .nav-link")
//       .forEach((btn) => btn.classList.remove("active"));
//     e.target.classList.add("active");
//     switchPage(e.target.dataset.page);
//   }
// });

function switchPage(page) {
  document
    .getElementById("portfolio-view")
    .classList.toggle("d-none", page !== "portfolio");
  document
    .getElementById("resume-view")
    .classList.toggle("d-none", page !== "resume");
}

function render() {
  renderHeader(portfolioData.identity);
  renderPortfolio(portfolioData);
  renderResume(resumeData);
}

function renderHeader(identity) {
  const photo = identity.photo
    ? `<img src="${identity.photo}" class="rounded-circle" width="140" height="140" alt="${identity.name}" />`
    : "";
  const mailLink = identity.email
    ? `<a href="mailto:${identity.email}">Email</a>`
    : "";
  const linkedin = identity.linkedin
    ? `<a href="${identity.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`
    : "";
  const sep =
    mailLink && linkedin ? '<span class="text-white-50 mx-2">|</span>' : "";
  document.getElementById("header").innerHTML = `
<div class="container">
<div class="row align-items-center">
<div class="col-auto pe-4">${photo}</div>
<div class="col">
  <h1>${identity.name}</h1>
  <p class="lead text-white-50 mb-1">${identity.title}</p>
  <p class="text-white-50 mb-2">${identity.location}</p>
  <nav class="header-links">${mailLink}${sep}${linkedin}</nav>
</div>
</div>
</div>
`;
}

function renderPortfolio(data) {
  const el = document.getElementById("portfolio-view");
  let html = "";

  if (data?.about?.trim()) {
    html += `
<div class="mb-5">
<h2>About</h2>
<hr class="mb-4" />
<p>${data.about}</p>
</div>`;
  }

  if (data.projects && data.projects.length > 0) {
    const cards = data.projects
      .map(
        (p) => `
  <div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h5 class="card-title">${p.name}</h5>
        <p class="card-text">${p.description}</p>
        <div class="mb-3">
          ${p.tags.map((t) => `<span class="badge bg-light text-dark me-1 mb-1">${t}</span>`).join("")}
        </div>
        <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Project</a>
      </div>
    </div>
  </div>`,
      )
      .join("");
    html += `
<div class="mb-5">
<h2>Projects</h2>
<hr class="mb-4" />
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">${cards}</div>
</div>`;
  }

  if (data.skills) {
    const groups = Object.entries(data.skills)
      .filter(([_, items]) => items && items.length > 0)
      .map(
        ([group, items]) => `
  <div class="col">
    <div class="card h-100">
      <div class="card-body">
        <h6 class="card-subtitle mb-2 text-muted">${group}</h6>
        <div class="d-flex flex-wrap gap-1">
          ${items.map((i) => `<span class="badge bg-light text-dark">${i}</span>`).join("")}
        </div>
      </div>
    </div>
  </div>`,
      )
      .join("");
    if (groups) {
      html += `
<div>
<h2>Skills</h2>
<hr class="mb-4" />
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">${groups}</div>
</div>`;
    }
  }

  el.innerHTML = html;
}

function renderResume(data) {
  const el = document.getElementById("resume-view");
  let html = "";

  if (data?.summary?.trim()) {
    html += `
<div class="mb-5">
<h2>Summary</h2>
<hr class="mb-4" />
<p>${data.summary}</p>
</div>`;
  }

  if (data?.phone || data?.work_rights) {
    const meta = [];
    if (data.phone) meta.push(`Phone: ${data.phone}`);
    if (data.work_rights) meta.push(`Work Rights: ${data.work_rights}`);
    html += `
<div class="mb-5">
<p class="text-muted mb-0">${meta.join(" &middot; ")}</p>
</div>`;
  }

  if (data.experience && data.experience.length > 0) {
    const items = data.experience
      .map(
        (job) => `
  <div class="card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-1">${job.role}</h5>
        <span class="badge bg-secondary">${job.period}</span>
      </div>
      <p class="card-subtitle mb-2 text-muted">${job.company}</p>
      ${job.summary ? `<p class="card-text">${job.summary}</p>` : ""}
      ${job.highlights && job.highlights.length > 0 ? `<ul>${job.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>` : ""}
      ${job.techstack && job.techstack.length > 0 ? `<div class="d-flex flex-wrap gap-1 mt-2">${job.techstack.map((t) => `<span class="badge bg-light text-dark">${t}</span>`).join("")}</div>` : ""}
    </div>
  </div>`,
      )
      .join("");
    html += `
<div class="mb-5">
<h2>Experience</h2>
<hr class="mb-4" />
${items}
</div>`;
  }

  if (data.education && data.education.length > 0) {
    const items = data.education
      .map(
        (edu) => `
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">${edu.degree}</h5>
      <p class="card-subtitle mb-2 text-muted">${edu.institution}</p>
      ${edu.details ? `<p class="card-text mb-2">${edu.details}</p>` : ""}
      ${edu.techstack && edu.techstack.length > 0 ? `<div class="d-flex flex-wrap gap-1 mt-2">${edu.techstack.map((t) => `<span class="badge bg-light text-dark">${t}</span>`).join("")}</div>` : ""}
      <span class="badge bg-secondary">${edu.year}</span>
    </div>
  </div>`,
      )
      .join("");
    html += `
<div class="mb-5">
<h2>Education</h2>
<hr class="mb-4" />
${items}
</div>`;
  }

  if (data.certifications && data.certifications.length > 0) {
    const items = data.certifications
      .map((c) => `<li><strong>${c.name}</strong> — ${c.year}</li>`)
      .join("");
    html += `
<div class="mb-5">
<h2>Certifications</h2>
<hr class="mb-4" />
<ul>${items}</ul>
</div>`;
  }

  if (data.languages && data.languages.length > 0) {
    const items = data.languages
      .map((l) => `<li>${l.language} — ${l.level}</li>`)
      .join("");
    html += `
<div>
<h2>Languages</h2>
<hr class="mb-4" />
<ul>${items}</ul>
</div>`;
  }

  el.innerHTML = html;
}
