// Dynamisches kg-Feld anzeigen/verstecken
document.getElementById("menge").addEventListener("change", function () {
    const kgEingabe = document.getElementById("kgEingabe");
    const kgMengeInput = document.getElementById("kgMenge");
    if (this.value === "kg") {
        kgEingabe.style.display = "block";
        kgMengeInput.setAttribute("required", "true");
    } else {
        kgEingabe.style.display = "none";
        kgMengeInput.removeAttribute("required");
        kgMengeInput.value = "";
    }
});

// Hidden-Input sauber (nur für echte Form-Submits relevant)
(function () {
    const cb = document.getElementById("iseceno");
    const hidden = document.getElementById("iseceno-hidden");
    if (cb && hidden) {
        const syncHidden = () => {
            hidden.disabled = cb.checked; // checked => "Da" kommt (Checkbox), hidden wird ignoriert
        };
        cb.addEventListener("change", syncHidden);
        syncHidden();
    }
})();

// WhatsApp-Link Logik
function sendeZuWhatsApp(event) {
    event.preventDefault();

    const telefonnummer = "+436606883121";

    // Formulardaten holen
    const name = document.getElementById("name").value.trim();
    const telefon = document.getElementById("telefon").value.trim();
    const produkt = document.getElementById("produkt").value;
    let menge = document.getElementById("menge").value;
    const kgMenge = document.getElementById("kgMenge").value;
    const fuerWannRaw = document.getElementById("fuerWann").value || "Nicht angegeben";
    const fuerWann =
        fuerWannRaw !== "Nicht angegeben"
            ? new Date(fuerWannRaw).toLocaleDateString("de-DE")
            : "Nicht angegeben";

    // Checkbox-Wert für Isečeno na komade (Ja/Nein)
    const iseceno = document.getElementById("iseceno").checked ? "Da" : "Ne";

    // Wenn "kg" gewählt wurde, benutzerdefinierte Menge verwenden
    if (menge === "kg") {
        menge = kgMenge ? `${kgMenge} kg` : "Menge nicht angegeben";
    }

    // Nachricht zusammenstellen
    const text =
        `Bestellung von ${name}\n` +
        `Telefon: ${telefon}\n` +
        `Produkt: ${produkt}\n` +
        `Menge: ${menge}\n` +
        `Isečeno na komade: ${iseceno}\n` +
        `Für wann: ${fuerWann}`;

    // WhatsApp-URL erstellen
    const whatsappUrl = `https://wa.me/${telefonnummer}?text=${encodeURIComponent(text)}`;

    // WhatsApp öffnen
    window.open(whatsappUrl, "_blank");
}
