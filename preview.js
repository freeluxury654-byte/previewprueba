let data = null;
let isAdmin = false;

const html = document.documentElement;
const toggle = document.getElementById("themeToggle");
const toastContainer = document.getElementById("toastContainer");

/* =====================
   TOAST
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
   CARGA
===================== */
showToast("Cargando catálogo…", "info");

fetch("data.json")
  .then(r => r.json())
  .then(j => {
    data = j;
    renderCatalogo();
    setupWA();
    showToast("Catálogo cargado", "success");
  })
  .catch(() => showToast("Error al cargar catálogo", "error"));

function renderCatalogo() {
  const c = document.getElementById("catalogo");
  c.innerHTML = "";

  data.categorias.forEach(cat => {
    const catDiv = document.createElement("section");
    catDiv.className = "categoria";

    catDiv.innerHTML = `
      <h2>${cat.nombre}</h2>
      <p>${cat.descripcion}</p>
      <div class="productos"></div>
    `;

    const grid = catDiv.querySelector(".productos");

    cat.productos.forEach(p => {
      const low = p.stock <= 5;
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="tags">
          ${(p.etiquetas || []).map(e => `<span>${e}</span>`).join("")}
          ${low ? `<span class="warning">⚠ Bajo stock</span>` : ""}
        </div>
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <div class="price">$${p.precio}</div>
        <div class="stock ${low ? "low" : ""}">Stock: ${p.stock}</div>
        <div>Garantía: ${p.garantia ? "Sí" : "No"}</div>
        <a href="${waLink(p)}" target="_blank" rel="noopener">Comprar</a>
      `;

      grid.appendChild(card);
    });

    c.appendChild(catDiv);
  });
}

function waLink(p) {
  const msg = `Hola, estoy interesado en:\n${p.nombre}\nPrecio: $${p.precio}`;
  return `https://wa.me/XXXXXXXXXXX?text=${encodeURIComponent(msg)}`;
}

function setupWA() {
  document.getElementById("ctaWhatsappHeader").href =
    `https://wa.me/XXXXXXXXXXX?text=${encodeURIComponent("Hola, quiero información del catálogo.")}`;
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
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  a.download = "data.json";
  a.click();
  showToast("data.json exportado", "success");
};
