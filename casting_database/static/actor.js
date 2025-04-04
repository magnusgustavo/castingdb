const API_URL = "http://127.0.0.1:8000/actors";
const DELETE_PHOTO_URL = "http://127.0.0.1:8000/delete-photo";

const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get("id");

function createDetailItem(label, value) {
    const container = document.createElement("div");
    container.className = "actor-grid-item";

    const labelDiv = document.createElement("div");
    labelDiv.className = "actor-label";
    labelDiv.textContent = label + ":";

    const valueDiv = document.createElement("div");
    valueDiv.className = "actor-value";
    valueDiv.textContent = value || "Neznámé";

    container.appendChild(labelDiv);
    container.appendChild(valueDiv);
    return container;
}

async function fetchActorDetails() {
    try {
        const response = await fetch(`${API_URL}/${actorId}`);
        if (!response.ok) {
            document.getElementById("actor-details").innerHTML = "<p>Herec nebyl nalezen.</p>";
            return;
        }

        const actor = await response.json();
        document.getElementById("actor-fullname").textContent = `${actor.act_name} ${actor.act_surname}`;

        const container = document.getElementById("actor-details");
        container.innerHTML = "";

        const items = [
            ["Rok narození", actor.birth_year],
            ["Pohlaví", actor.gender],
            ["Výška", actor.height_cm ? `${actor.height_cm} cm` : null],
            ["Váha", actor.weight_kg ? `${actor.weight_kg} kg` : null],
            ["Barva očí", actor.eyes_color],
            ["Barva vlasů", actor.hair_color],
            ["Barva pleti", actor.skin_color],
            ["Email", actor.email],
            ["Agentura", actor.agency],
            ["Národnost", actor.nationality],
            ["Rodinný stav", actor.family],
            ["Telefon (domů)", actor.home_phone],
            ["Dočasná adresa", actor.temp_address],
            ["WWW / sociální sítě", actor.www]
        ];

        items.forEach(([label, value]) => {
            const item = createDetailItem(label, value);
            if (item) container.appendChild(item);
        });

        const photoContainer = document.getElementById("actor-photos");
        photoContainer.innerHTML = "";

        if (actor.images && actor.images.length > 0) {
            actor.images.forEach(({ id, file_url }) => {
                const photoWrapper = document.createElement("div");
                photoWrapper.className = "photo-wrapper";
        
                const img = document.createElement("img");
                img.src = file_url;
                img.className = "actor-photo";
        
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "✖";
                deleteBtn.className = "delete-photo-btn";
                deleteBtn.onclick = () => deletePhoto(id);
        
                photoWrapper.appendChild(img);
                photoWrapper.appendChild(deleteBtn);
                photoContainer.appendChild(photoWrapper);
            });
        }
        
        const editButton = document.getElementById("edit-button");
        if (editButton && actor?.id) {
            editButton.href = `edit_actor.html?id=${actor.id}`;
            editButton.style.display = "inline-block";
        }

    } catch (error) {
        console.error("Chyba při načítání detailů herce:", error);
        document.getElementById("actor-details").innerHTML = "<p>Chyba při načítání dat.</p>";
    }
}

document.getElementById("photo-input").addEventListener("change", async () => {
    const photoInput = document.getElementById("photo-input");
    const file = photoInput.files[0];
    const uploadStatus = document.getElementById("upload-status");

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("actor_id", actorId);

    try {
        const res = await fetch("http://127.0.0.1:8000/upload-photo", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Nahrání selhalo");
        uploadStatus.textContent = "Fotka úspěšně nahrána!";
        photoInput.value = "";

        fetchActorDetails();
    } catch (err) {
        console.error(err);
        uploadStatus.textContent = "Chyba při nahrávání fotky.";
    }
});


async function deletePhoto(photoId) {
    if (!confirm("Opravdu chceš smazat tuto fotku?")) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/delete-photo/${photoId}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Smazání selhalo");
        fetchActorDetails();
    } catch (err) {
        console.error("Chyba při mazání fotky:", err);
        alert("Nepodařilo se smazat fotku.");
    }
}

document.getElementById("delete-button").addEventListener("click", async () => {
    if (!confirm("Opravdu chceš smazat tohoto herce? Tato akce je nevratná.")) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/actors/${actorId}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Nepodařilo se smazat herce.");

        window.location.href = "index.html";
    } catch (error) {
        alert("Chyba při mazání herce.");
        console.error(error);
    }
});

document.getElementById("export-csv").addEventListener("click", () => {
    const actorName = document.getElementById("actor-fullname").textContent;
    const rows = [["Atribut", "Hodnota"]];

    document.querySelectorAll(".actor-grid-item").forEach(item => {
        const label = item.querySelector(".actor-label").textContent.replace(":", "");
        const value = item.querySelector(".actor-value").textContent;
        rows.push([label, value]);
    });

    const csvContent = rows.map(e => e.map(field => `"${field}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${actorName}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    document.getElementById("export-modal").classList.add("modal-hidden");
});

document.getElementById("print-button").addEventListener("click", () => {
    document.getElementById("export-modal").classList.remove("modal-hidden");
});

document.getElementById("export-pdf").addEventListener("click", () => {
    document.getElementById("export-modal").classList.add("modal-hidden");
    window.print();
});

document.getElementById("close-export").addEventListener("click", () => {
    document.getElementById("export-modal").classList.add("modal-hidden");
});


fetchActorDetails();
