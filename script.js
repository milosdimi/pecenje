// Dynamisches kg-Feld anzeigen/verstecken
document.getElementById("menge").addEventListener("change", function () {
    const kgEingabe = document.getElementById("kgEingabe");
    if (this.value === "kg") {
        kgEingabe.style.display = "block";
        document.getElementById("kgMenge").setAttribute("required", "true");
    } else {
        kgEingabe.style.display = "none";
        document.getElementById("kgMenge").removeAttribute("required");
    }
});

// WhatsApp-Link Logik
function sendeZuWhatsApp(event) {
    event.preventDefault();

    const telefonnummer = "+49123456789"; // Ersetze mit deiner Nummer!

    // Formulardaten holen
    const name = document.getElementById("name").value;
    const telefon = document.getElementById("telefon").value;
    const produkt = document.getElementById("produkt").value;
    let menge = document.getElementById("menge").value;
    const kgMenge = document.getElementById("kgMenge").value;
    const fuerWann = document.getElementById("fuerWann").value || "Nicht angegeben";

    // Wenn "kg" gewählt wurde, die benutzerdefinierte Menge verwenden
    if (menge === "kg" && kgMenge) {
        menge = `${kgMenge} kg`;
    }

    // Nachricht zusammenstellen
    const text = `Bestellung von ${name}\nTelefon: ${telefon}\nProdukt: ${produkt}\nMenge: ${menge}\nFür wann: ${fuerWann}`;

    // WhatsApp-URL erstellen
    const whatsappUrl = `https://wa.me/${telefonnummer}?text=${encodeURIComponent(text)}`;

    // WhatsApp öffnen
    window.open(whatsappUrl, "_blank");
}