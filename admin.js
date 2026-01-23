let data = null;
let currentSection = "catalogo";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const sectionSelect = document.getElementById("sectionSelect");
  const addBtn = document.getElementById("addBtn");
  const exportBtn = document.getElementById("exportBtn");
  const editor = document.getElementById("editor");
  const preview = document.getElementById("previewCatalogo");

  /* LOGIN */
  loginBtn.onclick = () => {
    const pass = prompt("Clave admin:");
    if (pass !== "7777") return alert("Clave incorrecta");
    sectionSelect.classList.remove("hidden");
    addBtn.classList.remove("hidden");
    exportBtn.classList.remove("hidden");
    loadSection();
  };

  /* SELECTOR */
  sectionSelect.onchange = () => {
    currentSection = sectionSelect.value;
    loadSection();
  };

  /* LOAD DATA */
  function loadSection() {
    fetch(`data/${currentSection}.json`)
      .then(r => r.json())
      .then(j => {
        data = j;
        renderEditor();
        renderPreview();
      });
  }

  /* ADD */
  addBtn.onclick = () => {
    if (currentSection === "catalogo") {
      data.categorias.push({
        id: Date.now(),
        nombre: "Nueva categoría",
        descripcion: "",
        productos: []
      });
    } else {
      data.items.push({
        titulo: "Nuevo ítem",
        descripcion: ""
      });
    }
    renderEditor();
    renderPreview();
  };

  /* EDITOR */
  function renderEditor() {
    editor.innerHTML = "";

    if (currentSection === "catalogo") {
      data.categorias.forEach((cat, ci) => {
        const box = document.createElement("div");
        box.className = "card";

        box.innerHTML = `
          <h3 contenteditable>${cat.nombre}</h3>
          <textarea>${cat.descripcion}</textarea>
          <button>➕ Producto</button>
          <button>❌ Categoría</button>
          <hr>
        `;

        box.querySelector("h3").oninput = e => {
          cat.nombre = e.target.innerText;
          renderPreview();
        };

        box.querySelector("textarea").oninput = e => {
          cat.descripcion = e.target.value;
          renderPreview();
        };

        const [addP, delC] = box.querySelectorAll("button");

        addP.onclick = () => {
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

        delC.onclick = () => {
          data.categorias.splice(ci, 1);
          renderEditor();
          renderPreview();
        };

        cat.productos.forEach((p, pi) => {
          const prod = document.createElement("div");
          prod.innerHTML = `
            <input value="${p.nombre}">
            <textarea>${p.descripcion}</textarea>
            <input type="number" value="${p.precio}">
            <input type="number" value="${p.stock}">
            <label><input type="checkbox" ${p.garantia?"checked":""}> Garantía</label>
            <label><input type="checkbox" ${p.oferta?"checked":""}> Oferta</label>
            <label><input type="checkbox" ${p.recomendado?"checked":""}> Recomendado</label>
            <button>🗑</button>
          `;

          const els = prod.querySelectorAll("input,textarea");
          els[0].oninput = e => p.nombre = e.target.value;
          els[1].oninput = e => p.descripcion = e.target.value;
          els[2].oninput = e => p.precio = +e.target.value;
          els[3].oninput = e => p.stock = +e.target.value;
          els[4].onchange = e => p.garantia = e.target.checked;
          els[5].onchange = e => p.oferta = e.target.checked;
          els[6].onchange = e => p.recomendado = e.target.checked;

          prod.querySelector("button").onclick = () => {
            cat.productos.splice(pi, 1);
            renderEditor();
            renderPreview();
          };

          box.appendChild(prod);
        });

        editor.appendChild(box);
      });
    } else {
      data.items.forEach((it, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <input value="${it.titulo}">
          <textarea>${it.descripcion}</textarea>
          <button>🗑 Eliminar</button>
        `;
        card.querySelector("input").oninput = e => it.titulo = e.target.value;
        card.querySelector("textarea").oninput = e => it.descripcion = e.target.value;
        card.querySelector("button").onclick = () => {
          data.items.splice(i,1);
          renderEditor();
          renderPreview();
        };
        editor.appendChild(card);
      });
    }
  }

  /* PREVIEW */
  function renderPreview() {
    preview.innerHTML = `<h3>Vista previa: ${currentSection}</h3>`;
    if (currentSection !== "catalogo") return;

    data.categorias.forEach(cat => {
      const sec = document.createElement("section");
      sec.innerHTML = `<h4>${cat.nombre}</h4>`;
      cat.productos.forEach(p => {
        sec.innerHTML += `<div>${p.nombre} - $${p.precio}</div>`;
      });
      preview.appendChild(sec);
    });
  }

  /* EXPORT */
  exportBtn.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${currentSection}.json`;
    a.click();
  };
});
