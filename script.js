// ===============================
// Keys für LocalStorage
// ===============================
const LS_KEYS = {
    name: "pecenje_name",
    telefon: "pecenje_telefon",
    produkt: "pecenje_produkt",
    menge: "pecenje_menge",
    kg: "pecenje_kgMenge",
    // datum absichtlich NICHT gespeichert
};

// Safe-Wrapper für LS
function lsSet(key, value) {
    try { localStorage.setItem(key, value); } catch { }
}
function lsGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}

// ===============================
// Wiederherstellen + Live-Speichern
// ===============================
(function restoreAndBindPersistence() {
    const nameEl = document.getElementById("name");
    const telEl = document.getElementById("telefon");
    const prodEl = document.getElementById("produkt");
    const mengeEl = document.getElementById("menge");
    const kgWrap = document.getElementById("kgEingabe");
    const kgEl = document.getElementById("kgMenge");

    // 1) Wiederherstellen
    const savedName = lsGet(LS_KEYS.name);
    if (savedName && nameEl) nameEl.value = savedName;

    const savedTel = lsGet(LS_KEYS.telefon);
    if (savedTel && telEl) telEl.value = savedTel;

    const savedProd = lsGet(LS_KEYS.produkt);
    if (savedProd && prodEl) prodEl.value = savedProd;

    const savedMenge = lsGet(LS_KEYS.menge);
    if (savedMenge && mengeEl) {
        mengeEl.value = savedMenge;
        // Falls "kg" zuletzt gewählt -> UI + required setzen
        if (savedMenge === "kg" && kgWrap && kgEl) {
            kgWrap.style.display = "block";
            kgEl.setAttribute("required", "true");
            const savedKg = lsGet(LS_KEYS.kg);
            if (savedKg) kgEl.value = savedKg;
        }
    } else {
        // Fallback: sicherstellen, dass kg-Feld versteckt ist
        if (kgWrap && kgEl) {
            kgWrap.style.display = "none";
            kgEl.removeAttribute("required");
            kgEl.value = "";
        }
    }

    // 2) Live-Speichern (on input/change)
    if (nameEl) nameEl.addEventListener("input", () => lsSet(LS_KEYS.name, nameEl.value.trim()));
    if (telEl) telEl.addEventListener("input", () => lsSet(LS_KEYS.telefon, telEl.value.trim()));
    if (prodEl) prodEl.addEventListener("change", () => lsSet(LS_KEYS.produkt, prodEl.value));
    if (mengeEl) mengeEl.addEventListener("change", () => lsSet(LS_KEYS.menge, mengeEl.value));
    if (kgEl) kgEl.addEventListener("input", () => lsSet(LS_KEYS.kg, kgEl.value));
})();

// ===============================
// Dynamisches kg-Feld anzeigen/verstecken
// ===============================
document.getElementById("menge").addEventListener("change", function () {
    const kgEingabe = document.getElementById("kgEingabe");
    const kgMengeInput = document.getElementById("kgMenge");
    if (this.value === "kg") {
        kgEingabe.style.display = "block";
        kgMengeInput.setAttribute("required", "true");
        // Wert auch sofort speichern
        lsSet(LS_KEYS.menge, "kg");
    } else {
        kgEingabe.style.display = "none";
        kgMengeInput.removeAttribute("required");
        // kg-Wert leeren (und aus LS entfernen)
        kgMengeInput.value = "";
        lsSet(LS_KEYS.menge, this.value);
        lsSet(LS_KEYS.kg, "");
    }
});

// ===============================
// Hidden-Input für "Isečeno na komade"
// ===============================
(function () {
    const cb = document.getElementById("iseceno");
    const hidden = document.getElementById("iseceno-hidden");
    if (cb && hidden) {
        const syncHidden = () => { hidden.disabled = cb.checked; };
        cb.addEventListener("change", syncHidden);
        syncHidden();
    }
})();

// ===============================
// Vorwahl-Select: "Andere…" zeigt eigenes Vorwahlfeld an
// ===============================
(function () {
    const sel = document.getElementById("ccode");
    const other = document.getElementById("ccodeOther");
    if (!sel || !other) return;

    function toggleOther() {
        const useOther = sel.value === "other";
        other.classList.toggle("d-none", !useOther);
        other.required = useOther;
        if (!useOther) other.value = "";
    }
    sel.addEventListener("change", toggleOther);
    toggleOther();
})();

// ===============================
// WhatsApp-Link Logik + Bootstrap Validation Hook
// ===============================
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

    const zielWhatsApp = "+436606883121"; // Empfänger (bleibt gleich)

    // Formulardaten
    const name = document.getElementById("name").value.trim();

    // Vorwahl + Nummer
    const telefon = document.getElementById("telefon").value.trim();
    const ccodeSel = document.getElementById("ccode").value;
    const ccodeOther = (document.getElementById("ccodeOther").value || "").trim();
    const ccode = ccodeSel === "other" ? ccodeOther : ccodeSel;

    // Minimal-Check für "Andere…": muss mit + starten und 1–4 Ziffern enthalten
    if (!ccode || (ccodeSel === "other" && !/^\+\d{1,4}$/.test(ccode))) {
        form.classList.add("was-validated");
        return;
    }

    const produkt = document.getElementById("produkt").value;
    let menge = mengeSelect.value;
    const fuerWannRaw = document.getElementById("fuerWann").value || "Nicht angegeben";
    const fuerWann =
        fuerWannRaw !== "Nicht angegeben"
            ? new Date(fuerWannRaw).toLocaleDateString("de-DE")
            : "Nicht angegeben";

    // Checkbox-Wert
    const iseceno = document.getElementById("iseceno").checked ? "Da" : "Ne";

    // Menge formatieren
    if (menge === "kg") {
        menge = `${kgMenge} kg`;
    }

    // (Optional) Anzeigeformat für Telefonnummer: mehrere Spaces/Binderstriche schön machen
    const telPretty = telefon.replace(/\s+/g, " ").trim();

    // *** Vor dem Senden nochmal speichern (falls etwas zuletzt geändert wurde) ***
    lsSet(LS_KEYS.name, name);
    lsSet(LS_KEYS.telefon, telefon);
    lsSet(LS_KEYS.produkt, produkt);
    lsSet(LS_KEYS.menge, mengeSelect.value);
    lsSet(LS_KEYS.kg, document.getElementById("kgMenge").value || "");

    // Nachricht
    const text =
        `Bestellung von ${name}\n` +
        `Telefon: ${ccode} ${telPretty}\n` +
        `Produkt: ${produkt}\n` +
        `Menge: ${menge}\n` +
        `Isečeno na komade: ${iseceno}\n` +
        `Für wann: ${fuerWann}`;

    const whatsappUrl = `https://wa.me/${zielWhatsApp}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
}
