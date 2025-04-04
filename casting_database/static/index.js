const API_URL = "http://127.0.0.1:8000/actors";

let currentFilteredActors = [];

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const actorsList = document.getElementById("actors-list");

    const filterContainer = document.getElementById("filter-container");
    const response = await fetch("filter.html");
    const filterHtml = await response.text();
    filterContainer.innerHTML = filterHtml;

    const filterForm = document.getElementById("filter-form");
    const filterModal = document.getElementById("filter-modal");
    const filterButton = document.getElementById("filter-button");
    const closeFilterButton = document.getElementById("close-filter");

    async function fetchActors() {
        try {
            const response = await fetch(API_URL);
            const actors = await response.json();
            renderActors(actors);
        } catch (error) {
            console.error("Chyba při načítání herců:", error);
        }
    }

    function renderActors(actors) {
        currentFilteredActors = actors;
    
        actorsList.innerHTML = "";
        if (actors.length === 0) {
            actorsList.innerHTML = "<p>Žádní herci nebyli nalezeni.</p>";
            return;
        }
    
        actors.forEach(actor => {
            const item = document.createElement("div");
            item.className = "actor-list-item";
            item.innerHTML = `
                <span class="actor-list-line">
                    <a href="actor.html?id=${actor.id}" class="actor-name-link">
                        ${actor.act_name} ${actor.act_surname}
                    </a>
                    <span class="separator">|</span>
                    <span class="atributes-in-list">rok narození:</span> ${actor.birth_year || "neznámý"},
                    <span class="atributes-in-list">pohlaví:</span> ${actor.gender || "neznámé"},
                    <span class="atributes-in-list">výška:</span> ${actor.height_cm ? actor.height_cm + " cm" : "neznámá"}, 
                    <span class="atributes-in-list">váha:</span> ${actor.weight_kg ? actor.weight_kg + " kg" : "neznámá"}
                </span>
            `;
            actorsList.appendChild(item);
        });
    }    

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInput.value.toLowerCase();

        try {
            const response = await fetch(API_URL);
            const actors = await response.json();
            const filtered = actors.filter(actor =>
                `${actor.act_name} ${actor.act_surname}`.toLowerCase().includes(query)
            );
            renderActors(filtered);
        } catch (error) {
            console.error("Chyba při hledání herců:", error);
        }
    });

    filterForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(filterForm);
        const filters = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(API_URL);
            const actors = await response.json();

            const filtered = actors.filter(actor => {
                return (!filters.act_name || actor.act_name?.toLowerCase().includes(filters.act_name.toLowerCase())) &&
                    (!filters.act_surname || actor.act_surname?.toLowerCase().includes(filters.act_surname.toLowerCase())) &&
                    (!filters.birth_year || actor.birth_year == filters.birth_year) &&
                    (!filters.gender || actor.gender === filters.gender) &&
                    (!filters.height_cm || actor.height_cm >= parseInt(filters.height_cm)) &&
                    (!filters.height_cm_max || actor.height_cm <= parseInt(filters.height_cm_max)) &&
                    (!filters.weight_kg_min || actor.weight_kg >= parseInt(filters.weight_kg_min)) &&
                    (!filters.weight_kg || actor.weight_kg <= parseInt(filters.weight_kg)) &&
                    (!filters.eyes_color || actor.eyes_color?.toLowerCase().includes(filters.eyes_color.toLowerCase())) &&
                    (!filters.hair_color || actor.hair_color?.toLowerCase().includes(filters.hair_color.toLowerCase())) &&
                    (!filters.skin_color || actor.skin_color?.toLowerCase().includes(filters.skin_color.toLowerCase())) &&
                    (!filters.email || actor.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
                    (!filters.agency || actor.agency?.toLowerCase().includes(filters.agency.toLowerCase())) &&
                    (!filters.nationality || actor.nationality?.toLowerCase().includes(filters.nationality.toLowerCase())) &&
                    (!filters.family || actor.family?.toLowerCase().includes(filters.family.toLowerCase())) &&
                    (!filters.home_phone || actor.home_phone?.toLowerCase().includes(filters.home_phone.toLowerCase())) &&
                    (!filters.temp_address || actor.temp_address?.toLowerCase().includes(filters.temp_address.toLowerCase())) &&
                    (!filters.www || actor.www?.toLowerCase().includes(filters.www.toLowerCase()));
            });

            renderActors(filtered);
            filterModal.classList.add("modal-hidden");
        } catch (error) {
            console.error("Chyba při filtrování:", error);
        }
    });

    filterButton.addEventListener("click", () => {
        filterModal.classList.remove("modal-hidden");
    });

    closeFilterButton.addEventListener("click", () => {
        filterModal.classList.add("modal-hidden");
    });

    document.getElementById("export-list-button").addEventListener("click", () => {
        if (currentFilteredActors.length === 0) {
            alert("Není co exportovat.");
            return;
        }
    
        const rows = [[
            "Jméno", "Příjmení", "Rok narození", "Pohlaví", "Výška (cm)", "Váha (kg)",
            "Barva očí", "Barva vlasů", "Barva pleti", "Email", "Agentura",
            "Národnost", "Rodinný stav", "Telefon (domů)", "Dočasná adresa", "WWW / sociální sítě"
        ]];
        currentFilteredActors.forEach(actor => {
            rows.push([
                actor.act_name,
                actor.act_surname,
                actor.birth_year || "",
                actor.gender || "",
                actor.height_cm || "",
                actor.weight_kg || "",
                actor.eyes_color || "",
                actor.hair_color || "",
                actor.skin_color || "",
                actor.email || "",
                actor.agency || "",
                actor.nationality || "",
                actor.family || "",
                actor.home_phone || "",
                actor.temp_address || "",
                actor.www || ""
            ]);
            
        });
    
        const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "herci_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    fetchActors();
});
