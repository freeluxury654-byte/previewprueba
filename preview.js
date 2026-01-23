let data = null;
let isAdmin = false;

const html = document.documentElement;
const toggle = document.getElementById("themeToggle");
const toastContainer = document.getElementById("toastContainer");

function showToast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) html.dataset.theme = savedTheme;

if (toggle) {
  toggle.onclick = () => {
    html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", html.dataset.theme);
    showToast("Tema actualizado", "info");
  };
}

function setActiveNav() {
  const page = location.pathname.split("/").pop();
  document.querySelectorAll(".nav a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
}
setActiveNav();

function wa(text) {
  return `https://wa.me/XXXXXXXXXXX?text=${encodeURIComponent(text)}`;
}

showToast("Cargando datos...", "info");
fetch("data.json")
  .then(r => r.json())
  .then(j => {
    data = j;
    route();
    showToast("Datos cargados", "success");
  })
  .catch(() => showToast("Error al cargar datos", "error"));

function route() {
  const page = location.pathname.split("/").pop();
  if (page === "catalogo.html") renderCatalogo();
  if (page === "academy.html") renderAcademy();
  if (page === "tools.html") renderTools();
  if (page === "members.html") renderMembers();
}

function renderCatalogo() {
  const c = document.getElementById("content");
  c.innerHTML = "";
  data.categorias.forEach(cat => {
    const sec = document.createElement("section");
    sec.className = "categoria";
    sec.innerHTML = `<h2>${cat.nombre}</h2><p>${cat.descripcion}</p><div class="productos"></div>`;
    const grid = sec.querySelector(".productos");
    cat.productos.forEach(p => {
      const low = p.stock <= 5;
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="tags">
          ${(p.etiquetas || []).map(e => `<span>${e}</span>`).join("")}
          ${low ? `<span class="warning">Bajo stock</span>` : ""}
        </div>
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <div class="price">$${p.precio}</div>
        <div class="stock ${low ? "low" : ""}">Stock: ${p.stock}</div>
        <div>Garantía: ${p.garantia ? "Sí" : "No"}</div>
        <a href="${wa(`Interesado en ${p.nombre}`)}" target="_blank" rel="noopener">Comprar</a>
      `;
      grid.appendChild(card);
    });
    c.appendChild(sec);
  });
}

function renderAcademy() {
  document.getElementById("content").innerHTML = `
    <section class="categoria">
      <h2>Academy</h2>
      <p>Formación estructurada, guías y laboratorios educativos.</p>
      <div class="productos">
        ${eduCard("Guías", "Aprendizaje estructurado")}
        ${eduCard("Laboratorios", "Entornos de práctica")}
        ${eduCard("Tutoriales", "Contenido paso a paso")}
      </div>
    </section>`;
}

function renderTools() {
  document.getElementById("content").innerHTML = `
    <section class="categoria">
      <h2>Tools</h2>
      <p>Herramientas educativas para análisis y pruebas.</p>
      <div class="productos">
        ${eduCard("Testing y QA", "Uso formativo")}
        ${eduCard("Automatización", "Casos de estudio")}
        ${eduCard("Análisis de datos", "Prácticas guiadas")}
      </div>
    </section>`;
}

function renderMembers() {
  document.getElementById("content").innerHTML = `
    <section class="categoria">
      <h2>Members</h2>
      <p>Planes y accesos privados.</p>
      <div class="productos">
        ${planCard("Básico", "Acceso a comunidad")}
        ${planCard("Pro", "Contenido avanzado")}
        ${planCard("VIP", "Todo incluido")}
      </div>
    </section>`;
}

function eduCard(t, d) {
  return `
    <div class="card">
      <div class="tags"><span>Educativo</span></div>
      <h3>${t}</h3>
      <p>${d}</p>
      <a href="${wa(`Información sobre ${t}`)}" target="_blank" rel="noopener">Solicitar info</a>
    </div>`;
}

function planCard(t, d) {
  return `
    <div class="card">
      <div class="tags"><span>Plan</span></div>
      <h3>${t}</h3>
      <p>${d}</p>
      <a href="${wa(`Plan ${t}`)}" target="_blank" rel="noopener">Unirme</a>
    </div>`;
}

/* Admin (solo en landing) */
const btnAdmin = document.getElementById("btnAdmin");
if (btnAdmin) {
  btnAdmin.onclick = () => {
    if (prompt("Clave admin") === "7777") {
      isAdmin = true;
      document.getElementById("btnExport").classList.remove("hidden");
      document.getElementById("adminIndicator").classList.remove("hidden");
      showToast("Modo admin activado", "success");
    } else {
      showToast("Clave incorrecta", "error");
    }
  };
}
const btnExport = document.getElementById("btnExport");
if (btnExport) {
  btnExport.onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = "data.json";
    a.click();
    showToast("data.json exportado", "success");
  };
}

/* WhatsApp header (landing) */
const cta = document.getElementById("ctaWhatsappHeader");
if (cta) cta.href = wa("Hola, quiero información del catálogo.");
