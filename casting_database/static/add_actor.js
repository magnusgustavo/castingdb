const API_URL = "http://127.0.0.1:8000/actors";

document.getElementById("actor-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const actor = {
        ident_code: "TEMP-" + Date.now(),
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
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actor)
        });

        if (!response.ok) throw new Error("Nepodařilo se přidat herce");

        const newActor = await response.json();
        window.location.href = `actor.html?id=${newActor.id}`;
    } catch (error) {
        document.getElementById("status-message").textContent = "Chyba: " + error.message;
        console.error(error);
    }
});
