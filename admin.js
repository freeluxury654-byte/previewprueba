let data = null;
let isAdmin = false;

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const exportBtn = document.getElementById("exportBtn");
  const editor = document.getElementById("editor");

  /* ========= LOGIN ADMIN ========= */
  loginBtn.onclick = () => {
    const pass = prompt("Ingresa la clave admin:");
    if (pass !== "7777") {
      alert("Clave incorrecta");
      return;
    }
    isAdmin = true;
    loadCatalogo();
  };

  /* ========= CARGAR JSON ========= */
  function loadCatalogo() {
    fetch("data/catalogo.json")
      .then(r => r.json())
      .then(j => {
        data = j;
        renderEditor();
        exportBtn.classList.remove("hidden");
      })
      .catch(() => alert("Error cargando catalogo.json"));
  }

  /* ========= RENDER EDITOR ========= */
  function renderEditor() {
    editor.innerHTML = "";

    data.categorias.forEach((cat, ci) => {
      const catBox = document.createElement("div");
      catBox.className = "card";

      catBox.innerHTML = `
        <h2 contenteditable oninput="updateCatName(${ci}, this.innerText)">${cat.nombre}</h2>
        <p contenteditable oninput="updateCatDesc(${ci}, this.innerText)">${cat.descripcion}</p>

        <button onclick="addProduct(${ci})">➕ Añadir producto</button>
        <button onclick="deleteCategory(${ci})">❌ Eliminar categoría</button>
        <hr>
      `;

      cat.productos.forEach((p, pi) => {
        const prod = document.createElement("div");
        prod.style.border = "1px dashed #555";
        prod.style.padding = "10px";
        prod.style.marginBottom = "10px";

        prod.innerHTML = `
          <input value="${p.nombre}" placeholder="Nombre"
            oninput="updateProd(${ci},${pi},'nombre',this.value)">
          
          <textarea placeholder="Descripción"
            oninput="updateProd(${ci},${pi},'descripcion',this.value)">${p.descripcion}</textarea>

          <input type="number" value="${p.precio}" placeholder="Precio"
            oninput="updateProd(${ci},${pi},'precio',this.value)">
          
          <input type="number" value="${p.stock}" placeholder="Stock"
            oninput="updateProd(${ci},${pi},'stock',this.value)">

          <label>
            <input type="checkbox" ${p.garantia ? "checked" : ""}
              onchange="updateProd(${ci},${pi},'garantia',this.checked)">
            Garantía
          </label>

          <label>
            <input type="checkbox" ${p.oferta ? "checked" : ""}
              onchange="updateProd(${ci},${pi},'oferta',this.checked)">
            Oferta
          </label>

          <label>
            <input type="checkbox" ${p.recomendado ? "checked" : ""}
              onchange="updateProd(${ci},${pi},'recomendado',this.checked)">
            Recomendado
          </label>

          <br>
          <button onclick="deleteProduct(${ci},${pi})">🗑 Eliminar producto</button>
        `;

        catBox.appendChild(prod);
      });

      editor.appendChild(catBox);
    });
  }

  /* ========= EXPORT ========= */
  exportBtn.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "catalogo.json";
    a.click();
  };

  /* ========= FUNCIONES GLOBALES ========= */
  window.updateCatName = (ci, val) => data.categorias[ci].nombre = val;
  window.updateCatDesc = (ci, val) => data.categorias[ci].descripcion = val;

  window.updateProd = (ci, pi, key, val) => {
    data.categorias[ci].productos[pi][key] = val;
  };

  window.addProduct = (ci) => {
    data.categorias[ci].productos.push({
      id: Date.now(),
      nombre: "Nuevo producto",
      descripcion: "",
      precio: 0,
      stock: 0,
      garantia: false,
      oferta: false,
      recomendado: false
    });
    renderEditor();
  };

  window.deleteProduct = (ci, pi) => {
    data.categorias[ci].productos.splice(pi, 1);
    renderEditor();
  };

  window.deleteCategory = (ci) => {
    data.categorias.splice(ci, 1);
    renderEditor();
  };

});
