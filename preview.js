const html = document.documentElement;
const toggle = document.getElementById("themeToggle");
const toastC = document.getElementById("toastContainer");
const page = location.pathname.split("/").pop();

/* ===== UTIL ===== */
function getContainer(){
  return (
    document.getElementById("content") ||
    document.getElementById("catalogo")
  );
}

function toast(m,t="info"){
  if(!toastC) return;
  const d=document.createElement("div");
  d.className=`toast ${t}`;
  d.textContent=m;
  toastC.appendChild(d);
  setTimeout(()=>d.remove(),3000);
}

/* ===== THEME ===== */
const saved=localStorage.getItem("theme");
if(saved) html.dataset.theme=saved;

if(toggle){
  toggle.onclick=()=>{
    html.dataset.theme=html.dataset.theme==="dark"?"light":"dark";
    localStorage.setItem("theme",html.dataset.theme);
    toast("Tema actualizado");
  };
}

/* ===== NAV ACTIVE ===== */
document.querySelectorAll(".nav a").forEach(a=>{
  if(a.getAttribute("href")===page) a.classList.add("active");
});

/* ===== CONFIG ===== */
const WA="https://wa.me/XXXXXXXXXXX?text=";

toast("Cargando datos...");

/* ===== ROUTER ===== */
if(page==="catalogo.html") loadCatalogo();
if(page==="academy.html") loadSimple("data/academy.json","🎓 Academy");
if(page==="tools.html") loadSimple("data/tools.json","🛠 Tools");
if(page==="members.html") loadMembers();

/* ===== CATÁLOGO ===== */
function loadCatalogo(){
  fetch("data/catalogo.json")
    .then(r=>r.json())
    .then(d=>{
      const c = getContainer();
      if(!c) return;

      c.innerHTML="";

      d.categorias.forEach(cat=>{
        const s=document.createElement("section");
        s.className="categoria";
        s.innerHTML=`
          <h2>${cat.nombre}</h2>
          <p>${cat.descripcion}</p>
          <div class="productos"></div>
        `;

        const g=s.querySelector(".productos");

        cat.productos.forEach(p=>{
          const low=p.stock<=5;

          const card=document.createElement("div");
          card.className="card";
          card.innerHTML=`
            <div class="tags">
              ${p.oferta ? "<span class='offer'>🔥 Oferta</span>" : ""}
              ${p.recomendado ? "<span class='vip'>⭐ Recomendado</span>" : ""}
              ${low ? "<span class='warning'>⚠ Bajo stock</span>" : ""}
            </div>

            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>

            <div class="price">$${p.precio}</div>
            <div class="stock ${low?"low":""}">
              Stock: ${p.stock}
            </div>
            <div>Garantía: ${p.garantia?"Sí":"No"}</div>

            <a target="_blank"
               href="${WA+encodeURIComponent("Interesado en "+p.nombre)}">
               Comprar
            </a>
          `;
          g.appendChild(card);
        });

        c.appendChild(s);
      });

      toast("Catálogo cargado","success");
    })
    .catch(()=>toast("Error al cargar catálogo","error"));
}

/* ===== SIMPLE SECTIONS ===== */
function loadSimple(url,title){
  fetch(url)
    .then(r=>r.json())
    .then(d=>{
      const c = getContainer();
      if(!c) return;

      c.innerHTML=`
        <section class="categoria">
          <h2>${title}</h2>
          <div class="productos"></div>
        </section>
      `;

      const g=c.querySelector(".productos");

      (d.items||[]).forEach(i=>{
        const card=document.createElement("div");
        card.className="card";
        card.innerHTML=`
          <h3>${i.titulo}</h3>
          <p>${i.descripcion}</p>
          <a target="_blank"
             href="${WA+encodeURIComponent("Info "+i.titulo)}">
             Solicitar info
          </a>
        `;
        g.appendChild(card);
      });

      toast("Datos cargados","success");
    });
}

/* ===== MEMBERS ===== */
function loadMembers(){
  fetch("data/members.json")
    .then(r=>r.json())
    .then(d=>{
      const c = getContainer();
      if(!c) return;

      c.innerHTML=`
        <section class="categoria">
          <h2>👥 Members</h2>
          <div class="productos"></div>
        </section>
      `;

      const g=c.querySelector(".productos");

      d.planes.forEach(p=>{
        const card=document.createElement("div");
        card.className="card";
        card.innerHTML=`
          <h3>${p.nombre}</h3>
          <p>${p.detalle}</p>
          <a target="_blank"
             href="${WA+encodeURIComponent("Plan "+p.nombre)}">
             Unirme
          </a>
        `;
        g.appendChild(card);
      });

      toast("Planes cargados","success");
    });
}
