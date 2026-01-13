const WHATSAPP = "12494792518";

fetch("data.json")
  .then(r => r.json())
  .then(data => {
    const cont = document.getElementById("catalogo");
    cont.innerHTML = "";

    data.categorias.forEach(cat => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h2>${cat.nombre}</h2>`;

      cat.items.forEach(it => {
        const msg = encodeURIComponent(
          `Hola, quiero comprar:\n` +
          `Producto: ${it.nombre}\n` +
          `Precio unitario: $${it.precio_unitario}\n` +
          `Precio mayorista (5+): $${it.precio_mayor}`
        );

        card.innerHTML += `
          <div class="item">
            <div class="item-title">${it.nombre}</div>

            <div class="price">
              <span class="unit">$${it.precio_unitario}</span> ·
              <span class="mayor">MAYOR (5+): $${it.precio_mayor}</span>
            </div>

            <div class="meta">
              <span>📦 Stock: ${it.stock}</span>
              <span class="badge ${it.garantia ? "ok" : "no"}">
                ${it.garantia ? "Con garantía" : "Sin garantía"}
              </span>
            </div>

            <div class="meta">
              ${it.oferta ? `<span class="badge offer">🔥 OFERTA</span>` : `<span></span>`}
              <a class="wa-btn"
                 href="https://wa.me/${WHATSAPP}?text=${msg}"
                 target="_blank"
                 title="Pedir por WhatsApp">💬</a>
            </div>
          </div>
        `;
      });

      cont.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("catalogo").innerHTML =
      "<p style='padding:20px'>❌ Error cargando catálogo</p>";
  });
