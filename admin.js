let data=null;
const editor=document.getElementById("editor");

document.getElementById("loginBtn").onclick=()=>{
  if(prompt("Clave admin")==="7777"){
    fetch("data/catalogo.json").then(r=>r.json()).then(j=>{
      data=j;
      render();
      document.getElementById("exportBtn").classList.remove("hidden");
    });
  } else alert("Clave incorrecta");
};

function render(){
  editor.innerHTML="";
  data.categorias.forEach((c,ci)=>{
    const box=document.createElement("div");
    box.innerHTML=`
      <h2 contenteditable oninput="cName(${ci},this.innerText)">${c.nombre}</h2>
      <p contenteditable oninput="cDesc(${ci},this.innerText)">${c.descripcion}</p>
      <button onclick="addProd(${ci})">+ Producto</button>
      <button onclick="delCat(${ci})">Eliminar categoría</button>
    `;
    c.productos.forEach((p,pi)=>{
      const d=document.createElement("div");
      d.innerHTML=`
        <input value="${p.nombre}" oninput="upd(${ci},${pi},'nombre',this.value)">
        <input value="${p.descripcion}" oninput="upd(${ci},${pi},'descripcion',this.value)">
        <input type="number" value="${p.precio}" oninput="upd(${ci},${pi},'precio',this.value)">
        <input type="number" value="${p.stock}" oninput="upd(${ci},${pi},'stock',this.value)">
        <label><input type="checkbox" ${p.garantia?"checked":""} onchange="upd(${ci},${pi},'garantia',this.checked)"> Garantía</label>
        <label><input type="checkbox" ${p.oferta?"checked":""} onchange="upd(${ci},${pi},'oferta',this.checked)"> Oferta</label>
        <label><input type="checkbox" ${p.recomendado?"checked":""} onchange="upd(${ci},${pi},'recomendado',this.checked)"> Recomendado</label>
        <button onclick="delProd(${ci},${pi})">Eliminar</button>
      `;
      box.appendChild(d);
    });
    editor.appendChild(box);
  });
}

function cName(ci,v){data.categorias[ci].nombre=v}
function cDesc(ci,v){data.categorias[ci].descripcion=v}
function upd(ci,pi,k,v){data.categorias[ci].productos[pi][k]=v}
function addProd(ci){
  data.categorias[ci].productos.push({
    id:Date.now(),
    nombre:"Nuevo producto",
    descripcion:"",
    precio:0,
    stock:0,
    garantia:false,
    oferta:false,
    recomendado:false
  });
  render();
}
function delProd(ci,pi){data.categorias[ci].productos.splice(pi,1);render()}
function delCat(ci){data.categorias.splice(ci,1);render()}

document.getElementById("exportBtn").onclick=()=>{
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  a.download="catalogo.json";
  a.click();
};
