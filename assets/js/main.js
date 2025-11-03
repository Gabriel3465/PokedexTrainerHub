//fecha
document.addEventListener("DOMContentLoaded", (event) => {
    const fecha = document.getElementById("fecha");
    const now = new Date();
    fecha.innerText = now.toLocaleDateString();
})

//regex de letras y email
function onlyLetters(event) {

    const pressedKey = event.key;

    if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/.test(pressedKey)) {
        event.preventDefault();
    }
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validarEmailMensaje() {
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("mensaje");

    if (validateEmail(email)) {
        mensaje.textContent = "Correo válido";
        mensaje.style.color = "green";
    } else {
        mensaje.textContent = "Correo no válido";
        mensaje.style.color = "red";
    }
}

// Guardar entrenador
function saveTrainer() {
    let trainer = JSON.parse(localStorage.getItem("trainer"));

    if (trainer === null || typeof trainer !== "object") {
        trainer = {
            id: Date.now(),
            trainerName: document.getElementById("Name").value,
            email: document.getElementById("email").value,
            startDate: document.getElementById("fecha").textContent,
            equipo: []
        };
    }

    localStorage.setItem("trainer", JSON.stringify(trainer));

    window.location.href = "search.html";

    return false;
}


//buscar pokemon
function getPokeData() {

    fetch(`https://pokeapi.co/api/v2/pokemon/${document.getElementById('poke_input').value.toLowerCase().trim()}`)
        .then(
            response => response.json()
        )
        .then(data => {
            document.getElementById('poke_data').innerHTML = `<img src="${data.sprites.front_default}" alt="${data.name}"> 
            <button id="add_btn" onclick="addToTeam(${data.id}, '${data.name}', '${data.sprites.front_default}')">
                    Añadir al Equipo
            </button>`;
            document.getElementById('poke_name').innerHTML = data.name.toUpperCase();

            document.getElementById('error_mensage').innerHTML = "";
        })
        .catch(error => {
            document.getElementById('poke_data').innerHTML = `<img src="">`;
            document.getElementById('poke_name').innerHTML = "";

            document.getElementById('error_mensage').innerHTML =
                "No se encontró el Pokémon. Intenta de nuevo.";
        }
        );

}


function addToTeam(id, nombre, sprite) {
    let trainer = JSON.parse(localStorage.getItem("trainer"));

    const exists = trainer.equipo.some(poke => poke.id === id);
    if (exists) {
        alert(`${nombre} ya está en tu equipo.`);
        return;
    }

    // Agregar Pokémon al equipo
    trainer.equipo.push({
        id: id,
        nombre: nombre,
        sprite: sprite,
    });

    localStorage.setItem("trainer", JSON.stringify(trainer));

    alert(`${nombre.toUpperCase()} añadido a tu equipo.`);
}

//mostrar equipo
function renderTeam() {
    const container = document.getElementById("equipo_container");

    let trainer = JSON.parse(localStorage.getItem("trainer"));
    if (!trainer || !trainer.equipo) return;

    let html = "<div class='team-grid'>";
    trainer.equipo.forEach((poke, index) => {
        html += `
        <div class="pokemon-card">
            <img src="${poke.sprite}" alt="${poke.nombre}">
            <h3>${poke.nombre.toUpperCase()}</h3>
        </div>`;
    });
    html += "</div>";

    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("equipo_container")) {
        renderTeam();
    }
});





