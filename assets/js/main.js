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
        document.getElementById('error_mensage').innerHTML = `${nombre} ya está en tu equipo.`;
        document.getElementById('error_mensage').style.color = 'red'

        return;
    }

    // Agregar Pokémon al equipo
    trainer.equipo.push({
        id: id,
        nombre: nombre,
        sprite: sprite,
        favorito: false
    });

    localStorage.setItem("trainer", JSON.stringify(trainer));

    document.getElementById('error_mensage').innerHTML = `${nombre} se agrego correctamente`;
    document.getElementById('error_mensage').style.color = 'green'
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

                <label>
                    <input 
                        type="checkbox"
                        ${poke.favorito ? "checked" : ""}
                        onchange="favorite(${poke.id}, this.checked)"
                    >
                    Favorito
                </label>

                <button onclick="deletePokemon(${poke.id})">Liberar</button>

            </div>`;
    });
    html += "</div>";

    container.innerHTML = html;
}

//carga los pokemones
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("equipo_container")) {
        renderTeam();
    }
});

//elimina pokemones
function deletePokemon(pokeId) {
    let trainer = JSON.parse(localStorage.getItem("trainer"));

    const index = trainer.equipo.findIndex(p => p.id === pokeId);

    if (index !== -1) {
        trainer.equipo.splice(index, 1);
    }

    localStorage.setItem("trainer", JSON.stringify(trainer));

    renderTeam();
}

//favorito
function favorite(pokeId, isChecked) {
    const trainer = JSON.parse(localStorage.getItem("trainer"));

    const index = trainer.equipo.findIndex(p => p.id === pokeId);

    if (index !== -1) {
        trainer.equipo[index].favorito = isChecked;
    }

    localStorage.setItem("trainer", JSON.stringify(trainer));
}

