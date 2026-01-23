let data = null;
let isAdmin = false;

const html = document.documentElement;
const toggle = document.getElementById("themeToggle");
const notice = document.getElementById("progressNotice");

/* =====================
   TEMA
===================== */
const savedTheme = localStorage.getItem("theme");
if (savedTheme) html.dataset.theme = savedTheme;

toggle.onclick = () => {
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", html.dataset.theme);
};

/* =====================
   CARGA CATÁLOGO
===================== */
notice.classList.remove("hidden");

fetch("data.json")
  .then(r => r.json())
  .then(j => {
    data = j;
    render();
    setupWA();
    notice.textContent = "✅ Catálogo cargado";
    setTimeout(() => notice.classList.add("hidden"), 2000);
  });

function render() {
  const c = document.getElementById("catalogo");
  c.innerHTML = "";

  data.categorias.forEach(cat => {
    const div = document.createElement("div");
    div.className = "fade-in";

    div.innerHTML = `
      <h2>${cat.nombre}</h2>
      <p>${cat.descripcion}</p>
    `;

    c.appendChild(div);
  });
}

function setupWA() {
  document.getElementById("ctaWhatsappHeader").href =
    "https://wa.me/XXXXXXXXXXX?text=" +
    encodeURIComponent("Hola, quiero información del catálogo.");
}

/* =====================
   ADMIN
===================== */
document.getElementById("btnAdmin").onclick = () => {
  if (prompt("Clave admin") === "7777") {
    isAdmin = true;
    document.getElementById("btnExport").classList.remove("hidden");
    document.getElementById("adminIndicator").classList.remove("hidden");
  }
};

document.getElementById("btnExport").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  );
  a.download = "data.json";
  a.click();
};
