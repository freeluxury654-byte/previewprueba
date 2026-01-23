let data = null;
let isAdmin = false;

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    renderCatalogo();
    setupWhatsappHeader();
  });

function renderCatalogo() {
  const cont = document.getElementById("catalogo");
  cont.innerHTML = "";

  data.categorias.forEach(cat => {
    const catDiv = document.createElement("div");
    catDiv.className = "categoria";

    catDiv.innerHTML = `
      <h2 contenteditable="${isAdmin}">${cat.nombre}</h2>
      <p contenteditable="${isAdmin}">${cat.descripcion}</p>
      <div class="productos"></div>
    `;

    const productosDiv = catDiv.querySelector(".productos");

    cat.productos.forEach(prod => {
      const lowStock = prod.stock <= 5;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="tags">
          ${prod.etiquetas.map(e => `<span>${e}</span>`).join("")}
          ${lowStock ? `<span class="low-stock">Bajo stock</span>` : ""}
        </div>

        <h3 contenteditable="${isAdmin}">${prod.nombre}</h3>
        <p contenteditable="${isAdmin}">${prod.descripcion}</p>

        <div class="price" contenteditable="${isAdmin}">
          $${prod.precio}
        </div>

        <div class="stock ${lowStock ? "low" : ""}">
          Stock: <span contenteditable="${isAdmin}">${prod.stock}</span>
        </div>

        <div>Garantía: ${prod.garantia ? "Sí" : "No"}</div>

        <a href="${getWhatsappLink(prod)}" target="_blank">
          Comprar por WhatsApp
        </a>
      `;

      productosDiv.appendChild(card);
    });

    cont.appendChild(catDiv);
  });
}

function getWhatsappLink(prod) {
  const msg = encodeURIComponent(
    `Hola, estoy interesado en:\n\n` +
    `Producto: ${prod.nombre}\n` +
    `Precio: $${prod.precio}\n` +
    `Stock: ${prod.stock}\n\n`
  );

  return `https://wa.me/XXXXXXXXXXX?text=${msg}`;
}

function setupWhatsappHeader() {
  document.getElementById("ctaWhatsappHeader").href =
    "https://wa.me/XXXXXXXXXXX?text=" +
    encodeURIComponent("Hola, quiero información del catálogo mayorista.");
}

document.getElementById("btnAdmin").onclick = () => {
  const pass = prompt("Clave admin:");
  if (pass === "7777") {
    isAdmin = true;
    document.getElementById("btnExport").classList.remove("hidden");
    document.getElementById("adminIndicator").classList.remove("hidden");
    renderCatalogo();
  }
};

document.getElementById("btnExport").onclick = () => {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
};
