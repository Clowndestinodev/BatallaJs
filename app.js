// Variables globales
const personajes = [
  {
    id: 1,
    nombre: "Guerrero",
    vida: 320,
    mana: 40,
    ataque: 50,
    imagen: "imagenes/Guerrero.jpeg",
  },
  {
    id: 2,
    nombre: "Mago",
    vida: 150,
    mana: 200,
    ataque: 28,
    imagen: "imagenes/Mago.jpeg",
  },
  {
    id: 3,
    nombre: "Arquero",
    vida: 190,
    mana: 60,
    ataque: 32,
    imagen: "imagenes/Arquero.jpeg",
  },
];
let mensaje =
  "En la lejana y mística tierra de Midgart, una sombra oscura se cierne sobre el reino. El temido Dragón Negro Adulto ha despertado de su letargo, trayendo consigo destrucción y caos. Solo tres valientes héroes se atreven a enfrentarse a esta amenaza: el Guerrero, el Arquero y el Mago,El Guerrero, con su armadura reluciente y su espada imponente, es la encarnación de la fuerza y el coraje. Su misión es proteger a sus compañeros y enfrentarse al dragón en combate cuerpo a cuerpo,El Arquero, ágil y preciso, domina el arte del arco y la flecha. Desde las sombras, dispara con una puntería letal, buscando los puntos débiles del dragón para debilitarlo,El Mago, sabio y poderoso, controla las fuerzas arcanas. Con sus hechizos, puede conjurar tormentas de fuego y hielo, y proteger a sus aliados con barreras mágicas,Juntos, estos tres héroes deben unir sus habilidades y estrategias para derrotar al Dragón Negro Adulto y devolver la paz a Midgart. La batalla será feroz, y solo con valentía, inteligencia y trabajo en equipo podrán triunfar. ";

let demonio = {
  nombre: "Demonio",
  vida: 150,
  mana: 50,
  ataque: 10,
  imagen: "imagenes/Dragon Adulto Negro.jpeg",
};

let personajeSeleccionado;
let registroCombate = [];

// URL de la API para obtener el Dragon Adulto
const apiUrl = "https://www.dnd5eapi.co/api/monsters/adult-black-dragon";

//Funcion para cargar los datos del Dragon desde la Api
function cargarDatosMonstruo() {
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Ajustar los atributos del Dragon con los datos obtenidos
      demonio.nombre = data.name;
      demonio.vida = data.hit_points;
      demonio.intelligence = data.intelligence;
      demonio.ataque = data.strength;

      // Asignar una imagen predeterminada al Dragon(porque la api no tiene)
      demonio.imagen = "imagenes/Dragon Adulto Negro.jpeg";

      // Crear una card para el Dragón
      const card = document.createElement("div");
      card.classList.add("col-md-3", "card", "m-5");
      card.style.cursor = "pointer";
      card.innerHTML = `
          <img src="${demonio.imagen}" class="card-img-top" alt="${demonio.nombre}">
          <div class="card-body">
            <h5 class="card-title">${demonio.nombre}</h5>
            <p class="card-text">Vida: ${demonio.vida} | Mana: ${demonio.intelligence} | Ataque: ${demonio.ataque}</p>
          </div>
        `;

      // Insertar la card en el DOM
      const contenedorEnemigos = document.getElementById("contenedor-enemigos"); //
      if (contenedorEnemigos) {
        contenedorEnemigos.appendChild(card);
      }

      // Actualizar los atributos del demonio en el DOM
      document.getElementById(
        "atributos-demonio"
      ).textContent = `Enemigo: ${demonio.nombre} | Vida: ${demonio.vida} | Mana: ${demonio.intelligence} | Ataque: ${demonio.ataque}`;
    });
}

// Llamar a la función para cargar los datos antes de iniciar el juego
cargarDatosMonstruo().then(() => {
  generarSeleccionPersonajes();
});

// Función para generar la selección de personajes
function generarSeleccionPersonajes() {
  const characterSelection = document.getElementById("character-selection");
  personajes.forEach((personaje) => {
    const card = document.createElement("div");
    card.classList.add("col-md-3", "card", "m-5");
    card.style.cursor = "pointer";
    card.innerHTML = `
              <img src="${personaje.imagen}" class="card-img-top" alt="${personaje.nombre}">
              <div class="card-body">
                  <h5 class="card-title">${personaje.nombre}</h5>
                  <p class="card-text">Vida: ${personaje.vida} |   Mana: ${personaje.mana}| Ataque: ${personaje.ataque}</p>
              </div>
          `;
    card.addEventListener("click", () => seleccionPersonaje(personaje.id));
    characterSelection.appendChild(card);
  });
}

// Función para seleccionar un personaje
function seleccionPersonaje(id) {
  personajeSeleccionado = personajes.find((p) => p.id === id);
  document.getElementById("game-area").classList.remove("d-none");
  document.getElementById("character-selection").classList.add("d-none");
  iniciarJuego();
}

// Función para iniciar el juego
function iniciarJuego() {
  actualizarRegistro(
    `Inicia el combate entre ${personajeSeleccionado.nombre} y ${demonio.nombre}.`
  );
  mostrarAcciones();
  // Mostrar atributos iniciales
  actualizarAtributos();
}

// Funciones de combate
const jugador = {
  ataque: () => {
    const danio = Math.floor(Math.random() * personajeSeleccionado.ataque) + 10;
    demonio.vida -= danio;
    actualizarRegistro(
      `${personajeSeleccionado.nombre} ataca por ${danio} de daño!`
    );
    actualizarAtributos();
    finTurno();
  },
  defensa: () => {
    const bloqueo = Math.floor(Math.random() * 5) + 10;
    personajeSeleccionado.vida += bloqueo;
    actualizarRegistro(
      `${personajeSeleccionado.nombre} se defiende y recupera ${bloqueo} de vida!`
    );
    actualizarAtributos();
    finTurno();
  },
  curacion: () => {
    if (personajeSeleccionado.mana >= 10) {
      const curacionCantidad = Math.floor(Math.random() * 15) + 10;
      personajeSeleccionado.vida += curacionCantidad;
      personajeSeleccionado.mana -= 10;
      actualizarRegistro(
        `${personajeSeleccionado.nombre} se cura por ${curacionCantidad} de vida!`
      );
    } else {
      actualizarRegistro("¡No tienes suficiente mana para curarte!");
    }
    actualizarAtributos();
    finTurno();
  },
};

// Manejo del registro de combate en el DOM
function actualizarRegistro(mensaje) {
  registroCombate.push(mensaje);
  const log = document.getElementById("combat-log");
  log.innerHTML += `<p>${mensaje}</p>`;
  log.scrollTop = log.scrollHeight;
}

// Actualizar atributos en el DOM
function actualizarAtributos() {
  document.getElementById(
    "atributos-jugador"
  ).textContent = `Jugador: ${personajeSeleccionado.nombre} | Vida: ${personajeSeleccionado.vida} | Ataque: ${personajeSeleccionado.ataque} | Mana: ${personajeSeleccionado.mana}`;
  document.getElementById(
    "atributos-demonio"
  ).textContent = `Enemigo: ${demonio.nombre} | Vida: ${demonio.vida} | Ataque: ${demonio.ataque}`;
}

// Fin del turno
function finTurno() {
  if (demonio.vida <= 0) {
    finalizarJuego(true);
  } else {
    setTimeout(() => {
      demonioAtaca();
    }, 1000);
  }
}

// Función para la acción del demonio
function demonioAtaca() {
  const danio = Math.floor(Math.random() * demonio.ataque) + 15;
  personajeSeleccionado.vida -= danio;
  actualizarRegistro(`${demonio.nombre} ataca por ${danio} de daño!`);
  actualizarAtributos();
  verificarVidaJugador();
}

// Verifica si el jugador sigue vivo
function verificarVidaJugador() {
  if (personajeSeleccionado.vida <= 0) {
    finalizarJuego(false);
  }
}

function finalizarJuego(victoria) {
  const mensaje = victoria
    ? "¡Victoria! Has derrotado al enemigo y salvado Midgart."
    : "Has sido derrotado... El enemigo ha conquistado Midgart.";

  Swal.fire({
    title: victoria ? "¡Victoria!" : "Derrota...",
    text: mensaje,
    icon: victoria ? "success" : "error",
    confirmButtonText: "Reiniciar",
    allowOutsideClick: false,
    showCancelButton: false,
  }).then((result) => {
    if (result.isConfirmed) {
      reiniciarJuego();
    }
  });

  // Guardar registro en el localStorage
  localStorage.setItem("registroCombate", JSON.stringify(registroCombate));
}

// Función para reiniciar el juego
function reiniciarJuego() {
  // Reinicia las variables y el juego
  demonio.vida = 150;
  personajeSeleccionado.vida = personajes.find(
    (p) => p.id === personajeSeleccionado.id
  ).vida;
  personajeSeleccionado.mana = personajes.find(
    (p) => p.id === personajeSeleccionado.id
  ).mana;
  registroCombate = [];
  // Limpia el registro de combate
  document.getElementById("combat-log").innerHTML = "";
  iniciarJuego();
}

// Mostrar acciones disponibles
function mostrarAcciones() {
  const actions = document.getElementById("actions");
  actions.innerHTML = `
          <button class="btn btn-dark btn-lg m-1" onclick="jugador.ataque()">Atacar</button>
          <button class="btn btn-dark btn-lg m-1" onclick="jugador.defensa()">Defender</button>
          <button class="btn btn-dark btn-lg m-1" onclick="jugador.curacion()">Curar</button>
      `;
}

// Mostrar modal de bienvenida al cargar la página
window.onload = function () {
  const bienvenidaModal = new bootstrap.Modal(
    document.getElementById("bienvenidaModal")
  );
  bienvenidaModal.show();
};

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    return response.json();
  })
  .then((data) => {});

try {
  localStorage.setItem("registroCombate", JSON.stringify(registroCombate));
} catch (e) {}

const log = document.getElementById("combat-log");
if (log) {
  log.innerHTML += `<p>${mensaje}</p>`;
}
