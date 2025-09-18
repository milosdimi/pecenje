// Dynamisches kg-Feld anzeigen/verstecken (wie gehabt)
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

// Hidden-Input (wie gehabt)
(function () {
    const cb = document.getElementById("iseceno");
    const hidden = document.getElementById("iseceno-hidden");
    if (cb && hidden) {
        const syncHidden = () => { hidden.disabled = cb.checked; };
        cb.addEventListener("change", syncHidden);
        syncHidden();
    }
})();

// WhatsApp-Link Logik + Bootstrap Validation Hook
function sendeZuWhatsApp(event) {
    event.preventDefault();
    const form = document.getElementById("bestellFormular");

    // Native Constraint Validation
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return; // stop, wenn etwas ungültig ist
    }

    // Spezialfall: falls Menge "kg", aber Eingabe leer/ungültig
    const mengeSelect = document.getElementById("menge");
    const kgMenge = document.getElementById("kgMenge").value;
    if (mengeSelect.value === "kg" && (!kgMenge || Number(kgMenge) <= 0)) {
        form.classList.add("was-validated");
        return;
    }

    const telefonnummer = "+436606883121"; // Ziel-WhatsApp

    // Formulardaten
    const name = document.getElementById("name").value.trim();
    const telefon = document.getElementById("telefon").value.trim();
    const produkt = document.getElementById("produkt").value;
    let menge = mengeSelect.value;
    const fuerWannRaw = document.getElementById("fuerWann").value || "Nicht angegeben";
    const fuerWann = fuerWannRaw !== "Nicht angegeben"
        ? new Date(fuerWannRaw).toLocaleDateString("de-DE")
        : "Nicht angegeben";

    // Checkbox-Wert
    const iseceno = document.getElementById("iseceno").checked ? "Da" : "Ne";

    // Menge formatieren
    if (menge === "kg") {
        menge = `${kgMenge} kg`;
    }

    // Nachricht
    const text =
        `Bestellung von ${name}\n` +
        `Telefon: +43 ${telefon}\n` +
        `Produkt: ${produkt}\n` +
        `Menge: ${menge}\n` +
        `Isečeno na komade: ${iseceno}\n` +
        `Für wann: ${fuerWann}`;

    const whatsappUrl = `https://wa.me/${telefonnummer}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
}
