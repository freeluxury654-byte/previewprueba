let data = null;
let isAdmin = false;

const html = document.documentElement;
const toggle = document.getElementById("themeToggle");
const toastContainer = document.getElementById("toastContainer");

/* =====================
   TOAST SYSTEM
===================== */
function showToast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  toastContainer.appendChild(t);

  setTimeout(() => t.remove(), 3000);
}

/* =====================
   TEMA
===================== */
const savedTheme = localStorage.getItem("theme");
if (savedTheme) html.dataset.theme = savedTheme;

toggle.onclick = () => {
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", html.dataset.theme);
  showToast("Tema cambiado", "info");
};

/* =====================
   CARGA CATÁLOGO
===================== */
showToast("Cargando catálogo…", "info");

fetch("data.json")
  .then(r => r.json())
  .then(j => {
    data = j;
    render();
    setupWA();
    showToast("Catálogo cargado correctamente", "success");
  })
  .catch(() => showToast("Error al cargar catálogo", "error"));

function render() {
  const c = document.getElementById("catalogo");
  c.innerHTML = "";

  data.categorias.forEach(cat => {
    const div = document.createElement("div");
    div.className = "fade-in";
    div.innerHTML = `<h2>${cat.nombre}</h2><p>${cat.descripcion}</p>`;
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
    showToast("Modo admin activado", "success");
  } else {
    showToast("Clave incorrecta", "error");
  }
};

document.getElementById("btnExport").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  );
  a.download = "data.json";
  a.click();
  showToast("Archivo data.json exportado", "success");
};
