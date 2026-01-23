let data = null;

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const exportBtn = document.getElementById("exportBtn");
  const editor = document.getElementById("editor");
  const preview = document.getElementById("previewCatalogo");

  /* ========= LOGIN ========= */
  loginBtn.onclick = () => {
    const pass = prompt("Ingresa la clave admin:");
    if (pass !== "7777") {
      alert("Clave incorrecta");
      return;
    }
    loadData();
  };

  /* ========= LOAD DATA ========= */
  function loadData() {
    fetch("data/catalogo.json")
      .then(r => r.json())
      .then(j => {
        data = j;
        addCategoryBtn.classList.remove("hidden");
        exportBtn.classList.remove("hidden");
        renderEditor();
        renderPreview();
      });
  }

  /* ========= EDITOR ========= */
  function renderEditor() {
    editor.innerHTML = "";

    data.categorias.forEach((cat, ci) => {
      const catBox = document.createElement("div");
      catBox.className = "card";

      catBox.innerHTML = `
        <h3 contenteditable>${cat.nombre}</h3>
        <textarea>${cat.descripcion}</textarea>

        <button>➕ Añadir producto</button>
        <button>❌ Eliminar categoría</button>
        <hr>
      `;

      const [addProdBtn, delCatBtn] = catBox.querySelectorAll("button");

      catBox.querySelector("h3").oninput =
        e => { cat.nombre = e.target.innerText; renderPreview(); };

      catBox.querySelector("textarea").oninput =
        e => { cat.descripcion = e.target.value; renderPreview(); };

      addProdBtn.onclick = () => {
        cat.productos.push({
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
        renderPreview();
      };

      delCatBtn.onclick = () => {
        if (confirm("Eliminar esta categoría?")) {
          data.categorias.splice(ci, 1);
          renderEditor();
          renderPreview();
        }
      };

      cat.productos.forEach((p, pi) => {
        const prod = document.createElement("div");
        prod.style.border = "1px dashed #555";
        prod.style.padding = "8px";
        prod.style.marginBottom = "8px";

        prod.innerHTML = `
          <input placeholder="Nombre" value="${p.nombre}">
          <textarea placeholder="Descripción">${p.descripcion}</textarea>
          <input type="number" placeholder="Precio" value="${p.precio}">
          <input type="number" placeholder="Stock" value="${p.stock}">

          <label><input type="checkbox" ${p.garantia ? "checked" : ""}> Garantía</label>
          <label><input type="checkbox" ${p.oferta ? "checked" : ""}> Oferta</label>
          <label><input type="checkbox" ${p.recomendado ? "checked" : ""}> Recomendado</label>

          <br>
          <button>🗑 Eliminar producto</button>
        `;

        const inputs = prod.querySelectorAll("input, textarea");

        inputs[0].oninput = e => { p.nombre = e.target.value; renderPreview(); };
        inputs[1].oninput = e => { p.descripcion = e.target.value; renderPreview(); };
        inputs[2].oninput = e => { p.precio = Number(e.target.value); renderPreview(); };
        inputs[3].oninput = e => { p.stock = Number(e.target.value); renderPreview(); };
        inputs[4].onchange = e => { p.garantia = e.target.checked; renderPreview(); };
        inputs[5].onchange = e => { p.oferta = e.target.checked; renderPreview(); };
        inputs[6].onchange = e => { p.recomendado = e.target.checked; renderPreview(); };

        prod.querySelector("button").onclick = () => {
          cat.productos.splice(pi, 1);
          renderEditor();
          renderPreview();
        };

        catBox.appendChild(prod);
      });

      editor.appendChild(catBox);
    });
  }

  /* ========= ADD CATEGORY ========= */
  addCategoryBtn.onclick = () => {
    data.categorias.push({
      id: Date.now(),
      nombre: "Nueva categoría",
      descripcion: "",
      productos: []
    });
    renderEditor();
    renderPreview();
  };

  /* ========= PREVIEW ========= */
  function renderPreview() {
    preview.innerHTML = "";

    data.categorias.forEach(cat => {
      const sec = document.createElement("section");
      sec.className = "categoria";

      sec.innerHTML = `
        <h2>${cat.nombre}</h2>
        <p>${cat.descripcion}</p>
        <div class="productos"></div>
      `;

      const grid = sec.querySelector(".productos");

      cat.productos.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <div class="tags">
            ${p.oferta ? "<span>Oferta</span>" : ""}
            ${p.recomendado ? "<span>Recomendado</span>" : ""}
            ${p.stock <= 5 ? "<span class='warning'>Bajo stock</span>" : ""}
          </div>
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <div class="price">$${p.precio}</div>
          <div class="stock ${p.stock <= 5 ? "low" : ""}">Stock: ${p.stock}</div>
          <div>Garantía: ${p.garantia ? "Sí" : "No"}</div>
        `;

        grid.appendChild(card);
      });

      preview.appendChild(sec);
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

});
