/* ================= SERVIDOR ================= */

let servidorActual = localStorage.getItem("srv") || "ody";

const srvOk  = document.getElementById("srvOk");
const srvOdy = document.getElementById("srvOdy");

/* pintar botón activo */
function pintarServidor(){
  srvOk?.classList.toggle("activo", servidorActual === "ok");
  srvOdy?.classList.toggle("activo", servidorActual === "ody");
}
pintarServidor();

srvOk?.addEventListener("click", () => {
  servidorActual = "ok";
  localStorage.setItem("srv","ok");
  pintarServidor();
  reproducir(episodioActual);
});

srvOdy?.addEventListener("click", () => {
  servidorActual = "ody";
  localStorage.setItem("srv","ody");
  pintarServidor();
  reproducir(episodioActual);
});


/* ================= EPISODIOS ================= */

const botones = document.querySelectorAll('.episodios button');
const player  = document.getElementById('player');
const iframe  = player.querySelector("iframe");

const btnAnterior  = document.getElementById('btnAnterior');
const btnActual    = document.getElementById('btnActual');
const btnSiguiente = document.getElementById('btnSiguiente');

const overlay    = document.getElementById("nextOverlay");
const nextCount  = document.getElementById("nextCount");
const cancelNext = document.getElementById("cancelNext");

let vistos = JSON.parse(localStorage.getItem('episodiosVistos')) || [];
let episodioActual = 0;

let nextTimer = null;
let nextCountdown = null;


/* marcar vistos */
botones.forEach((btn, index) => {

  if (vistos.includes(btn.dataset.video)) {
    btn.classList.add("visto");
  }

  btn.addEventListener("click", () => reproducir(index));
});


/* controles */
btnAnterior?.addEventListener('click', () => {
  if (episodioActual > 0) reproducir(episodioActual - 1);
});

btnActual?.addEventListener('click', () => {
  reproducir(episodioActual);
});

btnSiguiente?.addEventListener('click', () => {
  if (episodioActual < botones.length - 1) reproducir(episodioActual + 1);
});


/* ================= FUNCIÓN PRINCIPAL ================= */

function reproducir(index){

  episodioActual = index;
  const btn = botones[index];
  if (!btn) return;

  const id  = btn.dataset.video;
  const ody = btn.dataset.odysee;

  /* fallback automático inteligente */
  let servidor = servidorActual;

  if (servidor === "ody" && !ody){
    servidor = "ok";
  }

  srvOdy?.classList.toggle("disabled", !ody);

  let src;

  if (servidor === "ody" && ody){
    src = ody + "?autoplay=true";
  }else{
    src = `https://ok.ru/videoembed/${id}?nochat=1&autoplay=1&hd=1`;
  }

  iframe.src = src;

  /* guardar vistos */
  if (!vistos.includes(id)){
    vistos.push(id);
    localStorage.setItem('episodiosVistos', JSON.stringify(vistos));
  }

  botones.forEach(b => b.classList.remove("activo"));
  btn.classList.add("activo","visto");


  /* ================= OVERLAY NEXT ================= */

  clearTimeout(nextTimer);
  clearInterval(nextCountdown);

  overlay?.classList.remove("show");

  if (episodioActual >= botones.length - 1) return;

  nextTimer = setTimeout(() => {

    let segundos = 5;
    nextCount.textContent = segundos;
    overlay.classList.add("show");

    nextCountdown = setInterval(() => {

      segundos--;
      nextCount.textContent = segundos;

      if (segundos <= 0){
        clearInterval(nextCountdown);
        overlay.classList.remove("show");
        reproducir(episodioActual + 1);
      }

    },1000);

  }, 23 * 60 * 1000); // ajusta duración episodio

  cancelNext.onclick = () => {
    overlay.classList.remove("show");
    clearInterval(nextCountdown);
  };

  player.scrollIntoView({behavior:"smooth",block:"center"});
}


/* ================= START ================= */

reproducir(episodioActual);