let data = null;
let isAdmin = false;

fetch("data.json")
  .then(r => r.json())
  .then(j => {
    data = j;
    render();
    setupWA();
  });

function render() {
  const c = document.getElementById("catalogo");
  c.innerHTML = "";

  data.categorias.forEach(cat => {
    const div = document.createElement("div");
    div.className = "categoria";

    div.innerHTML = `
      <h2 contenteditable="${isAdmin}">${cat.nombre}</h2>
      <p contenteditable="${isAdmin}">${cat.descripcion}</p>
      <div class="productos"></div>
    `;

    const grid = div.querySelector(".productos");

    cat.productos.forEach(p => {
      const low = p.stock <= 5;
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="tags">
          ${p.etiquetas.map(e => `<span>${e}</span>`).join("")}
          ${low ? `<span class="low-stock">⚠ Bajo</span>` : ""}
        </div>
        <h3 contenteditable="${isAdmin}">${p.nombre}</h3>
        <p contenteditable="${isAdmin}">${p.descripcion}</p>
        <div class="price">$${p.precio}</div>
        <div class="stock ${low ? "low" : ""}">Stock: ${p.stock}</div>
        <div>Garantía: ${p.garantia ? "Sí" : "No"}</div>
        <a href="${wa(p)}" target="_blank">Comprar</a>
      `;
      grid.appendChild(card);
    });

    c.appendChild(div);
  });
}

function wa(p) {
  return `https://wa.me/XXXXXXXXXXX?text=${encodeURIComponent(
    `Hola, quiero:\n${p.nombre}\nPrecio: $${p.precio}`
  )}`;
}

function setupWA() {
  document.getElementById("ctaWhatsappHeader").href =
    wa({ nombre: "información del catálogo", precio: "" });
}

document.getElementById("btnAdmin").onclick = () => {
  if (prompt("Clave admin") === "7777") {
    isAdmin = true;
    document.getElementById("btnExport").classList.remove("hidden");
    document.getElementById("adminIndicator").classList.remove("hidden");
    render();
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
