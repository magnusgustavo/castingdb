const API_URL = "http://127.0.0.1:8000/actors";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query").toLowerCase();

async function fetchActors() {
    try {
        const response = await fetch(API_URL);
        const actors = await response.json();
        const filteredActors = actors.filter(actor => 
            `${actor.act_name} ${actor.act_surname}`.toLowerCase().includes(query)
        );
        renderActors(filteredActors);
    } catch (error) {
        console.error("Failed to fetch actors:", error);
    }
}

function renderActors(actors) {
    const actorsContainer = document.getElementById("actors-container");
    actorsContainer.innerHTML = "";

    if (actors.length === 0) {
        actorsContainer.innerHTML = "<p>Žádní herci nebyli nalezeni.</p>";
        return;
    }

    actors.forEach(actor => {
        const card = document.createElement("div");
        card.className = "actor-card";
        card.innerHTML = `
            <h3>${actor.act_name} ${actor.act_surname}</h3>
            <p>Rok narození: ${actor.birth_year || "Neznámý"}</p>
            <a href="actor.html?id=${actor.id}">Zobrazit</a>
        `;
        actorsContainer.appendChild(card);
    });
}

fetchActors();
