const API_URL = "http://127.0.0.1:8000/actors";
const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get("id");

const form = document.getElementById("edit-form");
const statusMessage = document.getElementById("status-message");

let originalIdentCode = null;

async function loadActorData() {
    try {
        const response = await fetch(`${API_URL}/${actorId}`);
        if (!response.ok) throw new Error("Herec nebyl nalezen.");

        const actor = await response.json();

        originalIdentCode = actor.ident_code;

        form.elements["act_name"].value = actor.act_name || "";
        form.elements["act_surname"].value = actor.act_surname || "";
        form.elements["birth_year"].value = actor.birth_year || "";
        form.elements["height_cm"].value = actor.height_cm || "";
        form.elements["weight_kg"].value = actor.weight_kg || "";
        form.elements["gender"].value = actor.gender || "";
        form.elements["eyes_color"].value = actor.eyes_color || "";
        form.elements["hair_color"].value = actor.hair_color || "";
        form.elements["skin_color"].value = actor.skin_color || "";
        form.elements["email"].value = actor.email || "";
        form.elements["agency"].value = actor.agency || "";
        form.elements["nationality"].value = actor.nationality || "";
        form.elements["family"].value = actor.family || "";
        form.elements["home_phone"].value = actor.home_phone || "";
        form.elements["temp_address"].value = actor.temp_address || "";
        form.elements["www"].value = actor.www || "";

    } catch (error) {
        statusMessage.textContent = "Chyba při načítání: " + error.message;
        console.error(error);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const updatedActor = {
        ident_code: originalIdentCode,
        act_name: formData.get("act_name"),
        act_surname: formData.get("act_surname"),
        birth_year: formData.get("birth_year") || null,
        height_cm: formData.get("height_cm") || null,
        weight_kg: formData.get("weight_kg") || null,
        gender: formData.get("gender") || null,
        eyes_color: formData.get("eyes_color") || null,
        hair_color: formData.get("hair_color") || null,
        skin_color: formData.get("skin_color") || null,
        email: formData.get("email") || null,
        agency: formData.get("agency") || null,
        nationality: formData.get("nationality") || null,
        family: formData.get("family") || null,
        home_phone: formData.get("home_phone") || null,
        temp_address: formData.get("temp_address") || null,
        www: formData.get("www") || null
    };

    try {
        const response = await fetch(`${API_URL}/${actorId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedActor)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Chyba při ukládání: ${response.status} – ${errorText}`);
        }

        window.location.href = `actor.html?id=${actorId}`;
    } catch (error) {
        statusMessage.textContent = "Chyba: " + error.message;
        console.error(error);
    }
});

loadActorData();
