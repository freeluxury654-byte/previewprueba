fetch("data.json")
  .then(r => r.json())
  .then(data => {
    const cont = document.getElementById("catalogo");

    data.categorias.forEach(cat => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h2>${cat.nombre}</h2>`;

      cat.items.forEach(it => {
        card.innerHTML += `
          <div class="item">
            <strong>${it.nombre}</strong><br>
            💵 $${it.precio_unitario} | Mayor (5+): $${it.precio_mayor}<br>
            📦 Stock: ${it.stock}<br>
            ${it.garantia ? "🛡️ Con garantía" : "❌ Sin garantía"}<br>
            <a class="btn" href="https://wa.me/12494792518" target="_blank">
              📲 Pedir por WhatsApp
            </a>
          </div>
        `;
      });

      cont.appendChild(card);
    });
  });
