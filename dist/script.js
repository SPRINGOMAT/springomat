"use strict";
var _a, _b, _c;
/* Początkowy stan */
const order = {
    type: null,
    params: {},
    material: null,
    quantity: 1,
    contact: { name: "", email: "" },
    cart: []
};
/* ==============================================================
   ELEMENTS & CONSTANTS
================================================================ */
const steps = ["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"];
let currentStep = 0;
/* Nawigacja – przyciski */
const prevButtons = {
    1: document.getElementById("back-1"),
    2: document.getElementById("back-2"),
    3: document.getElementById("back-3"),
    4: document.getElementById("back-4"),
};
const nextButtons = {
    2: document.getElementById("to-3"),
    3: document.getElementById("to-4"),
    4: document.getElementById("to-5"),
};
const sendBtn = document.getElementById("send-order");
/* UI elements */
const illustrationDiv = document.getElementById("illustration");
const progressSteps = document.querySelectorAll(".progress-step");
const langButtons = document.querySelectorAll(".lang-btn");
let currentLang = "pl";
const translations = {
    pl: {
        title: "Sprężynomat",
        subtitle: "Automat ze sprężynami – zamów w kilku prostych krokach",
        chooseType: "Wybierz rodzaj sprężyny",
        compression: "Sprężyna naciskowa",
        tension: "Sprężyna naciągowa",
        torsion: "Sprężyna skrętna",
        plate: "Sprężyna talerzowa",
        other: "Inna / opisowa",
        parameters: "Parametry sprężyny",
        materialQty: "Materiał i ilość",
        contact: "Dane kontaktowe",
        summary: "Podsumowanie zamówienia",
        thankYou: "Dziękujemy!",
        thankMsg: "Twoje zapytanie zostało wysłane. Odpowiemy w ciągu 2–3 dni roboczych.",
        send: "Wyślij zapytanie",
        back: "Cofnij",
        next: "Dalej"
    },
    en: {
        title: "Spring-o-matic",
        subtitle: "Spring ordering wizard – simple steps",
        chooseType: "Select spring type",
        compression: "Compression spring",
        tension: "Tension spring",
        torsion: "Torsion spring",
        plate: "Plate spring",
        other: "Other / custom",
        parameters: "Spring parameters",
        materialQty: "Material & quantity",
        contact: "Contact details",
        summary: "Order summary",
        thankYou: "Thank you!",
        thankMsg: "Your inquiry has been sent. Expect a reply within 2‑3 business days.",
        send: "Send inquiry",
        back: "Back",
        next: "Next"
    }
};
/* Helper – zwraca przetłumaczony tekst */
function t(key) {
    var _a;
    return (_a = translations[currentLang][key]) !== null && _a !== void 0 ? _a : key;
}
/* ==============================================================
   UTILS – zmiana kroków, progress‑bar, itp.
================================================================ */
function showStep(idx) {
    // ukryj wszystkie sekcje
    steps.forEach(id => {
        const el = document.getElementById(id);
        if (el)
            el.classList.remove("active");
    });
    // pokaż wybraną
    const target = document.getElementById(steps[idx]);
    if (target)
        target.classList.add("active");
    currentStep = idx;
    updateProgressBar();
    // przycisk „Cofnij” ukrywamy w pierwszym kroku
    Object.values(prevButtons).forEach(btn => btn === null || btn === void 0 ? void 0 : btn.classList.toggle("hidden", idx === 0));
}
/* ---- Progress bar ---- */
function updateProgressBar() {
    progressSteps.forEach((el, i) => {
        // podświetlamy aktualny krok
        el.classList.toggle("active", i === currentStep);
        // zaznaczamy ukończone kroki
        el.classList.toggle("completed", i < currentStep);
    });
}
/* ==============================================================
   I18N – aktualizacja tekstów w UI
================================================================ */
function applyTranslations() {
    document.title = t("title");
    // wszystkie elementy posiadające atrybut data-key zostaną przetłumaczone
    document.querySelectorAll("[data-key]").forEach(node => {
        const key = node.dataset.key;
        node.textContent = t(key);
    });
}
/* Uruchom tłumaczenia przy starcie */
applyTranslations();
/* ==============================================================
   LANG SWITCHER – przełączanie języka
================================================================ */
langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentLang = btn.dataset.lang;
        langButtons.forEach(b => b.classList.toggle("selected", b === btn));
        applyTranslations();
    });
});
/* ==============================================================
   TYPE BUTTONS – wybór sprężyny + podpowiedź graficzna
================================================================ */
const typeButtons = document.querySelectorAll(".type-btn");
typeButtons.forEach(btn => {
    const type = btn.dataset.type;
    /* ---- kliknięcie (wybór) ---- */
    btn.addEventListener("click", () => {
        // zaznacz wybrany przycisk
        typeButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        // zapisz wybrany typ w stanie aplikacji
        order.type = type;
        // pokaż ilustrację od razu
        setIllustration(type);
        // automatycznie przejdź do kolejnego kroku (krok‑2)
        showStep(1);
    });
    /* ---- podpowiedź graficzna (hover) ---- */
    btn.addEventListener("mouseenter", () => setIllustration(type));
    btn.addEventListener("mouseleave", () => hideIllustration());
});
/* --------------------------------------------------------------
   ILLUSTRACJA – podmiana SVG
---------------------------------------------------------------- */
function setIllustration(type) {
    const map = {
        compression: "compression.svg",
        tension: "tension.svg",
        torsion: "torsion.svg",
        plate: "plate.svg",
        other: "other.svg"
    };
    const fileName = map[type];
    if (!fileName)
        return;
    // usuń poprzedni <img>, jeśli istnieje
    illustrationDiv.innerHTML = "";
    const img = document.createElement("img");
    img.src = `assets/${fileName}`;
    img.alt = `${type} illustration`;
    illustrationDiv.appendChild(img);
    illustrationDiv.classList.add("show");
}
function hideIllustration() {
    illustrationDiv.classList.remove("show");
    illustrationDiv.innerHTML = "";
}
/* ==============================================================
   KROK 2 – GENEROWANIE PÓL PARAMETRÓW
================================================================ */
function generateParamFields() {
    const container = document.getElementById("params-form");
    container.innerHTML = "";
    const fieldDefs = {
        compression: [
            { key: "d", label: "Średnica drutu (d)" },
            { key: "Dp", label: "Średnica podziałowa (Dp)" },
            { key: "Dz", label: "Średnica zewnętrzna (Dz)" },
            { key: "Lo", label: "Długość całkowita (Lo)" },
            { key: "z", label: "Ilość zwojów (z)" },
            {
                key: "direction",
                label: "Kierunek sprężyny",
                type: "select",
                options: ["Lewy", "Prawy"]
            }
        ],
        tension: [
            { key: "d", label: "Średnica drutu (d)" },
            { key: "Dp", label: "Średnica podziałowa (Dp)" },
            { key: "Dz", label: "Średnica zewnętrzna (Dz)" },
            { key: "Lo", label: "Długość całkowita (Lo)" },
            { key: "z", label: "Ilość zwojów (z)" },
            {
                key: "hook",
                label: "Typ zaczepu",
                type: "select",
                options: ["Zwykły", "Uchwyt"]
            },
            {
                key: "direction",
                label: "Kierunek sprężyny",
                type: "select",
                options: ["Lewy", "Prawy"]
            }
        ],
        torsion: [
            { key: "d", label: "Średnica drutu (d)" },
            { key: "Dp", label: "Średnica podziałowa (Dp)" },
            { key: "Dz", label: "Średnica zewnętrzna (Dz)" },
            { key: "Lo", label: "Długość całkowita (Lo)" },
            { key: "z", label: "Ilość zwojów (z)" },
            { key: "Lr", label: "Długość ramion (Lr)" },
            { key: "angle", label: "Kąt ustawienia ramion (°)" },
            {
                key: "direction",
                label: "Kierunek sprężyny",
                type: "select",
                options: ["Lewy", "Prawy"]
            }
        ],
        plate: [
            { key: "d", label: "Grubość materiału (d)" },
            { key: "Do", label: "Średnica zewnętrzna (Do)" },
            { key: "Di", label: "Średnica wewnętrzna (Di)" },
            { key: "H", label: "Wysokość (H)" }
        ],
        other: [{ key: "description", label: "Opis sprężyny", type: "textarea" }]
    };
    const chosen = fieldDefs[order.type];
    chosen.forEach(f => {
        var _a;
        const wrapper = document.createElement("div");
        wrapper.className = "field";
        const label = document.createElement("label");
        label.textContent = f.label;
        let input;
        if (f.type === "select") {
            input = document.createElement("select");
            ((_a = f.options) !== null && _a !== void 0 ? _a : []).forEach(opt => {
                const optEl = document.createElement("option");
                optEl.value = opt.toLowerCase();
                optEl.textContent = opt;
                input.appendChild(optEl);
            });
        }
        else if (f.type === "textarea") {
            input = document.createElement("textarea");
            input.rows = 3;
        }
        else {
            input = document.createElement("input");
            input.type = "number";
            // *** POPRAWIONA LINIA ***
            input.step = "any";
        }
        input.name = f.key;
        input.required = true;
        label.appendChild(input);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}
/* ---- Przejście dalej po wypełnieniu parametrów ---- */
(_a = document.getElementById("to-3")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const form = new FormData(document.getElementById("params-form"));
    order.params = Object.fromEntries(form.entries());
    showStep(2); // krok‑3 (materiał & ilość)
});
/* ==============================================================
   NAVIGACJA „Cofnij”
================================================================ */
Object.entries(prevButtons).forEach(([stepStr, btn]) => {
    const stepNum = Number(stepStr);
    btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", () => showStep(stepNum - 1));
});
/* ==============================================================
   KROK 3 – MATERIAŁ & ILOŚĆ
================================================================ */
const materialSelect = document.getElementById("material-select");
materialSelect.addEventListener("change", e => {
    order.material = e.target.value;
});
const quantityInput = document.getElementById("quantity");
quantityInput.addEventListener("input", e => {
    order.quantity = Number(e.target.value);
});
(_b = document.getElementById("to-4")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    if (!order.material)
        order.material = materialSelect.value;
    showStep(3); // krok‑4 (kontakt)
});
/* ==============================================================
   KROK 4 – DANE KONTAKTOWE
================================================================ */
(_c = document.getElementById("to-5")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    const form = new FormData(document.getElementById("contact-form"));
    order.contact = Object.fromEntries(form.entries());
    // podsumowanie
    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = `
    <strong>Rodzaj:</strong> ${order.type} 
    <strong>Parametry:</strong> ${JSON.stringify(order.params)} 
    <strong>Materiał:</strong> ${order.material} 
    <strong>Ilość:</strong> ${order.quantity} 
    <strong>Dane kontaktowe:</strong> ${JSON.stringify(order.contact)}
  `;
    showStep(4); // krok‑5 (podsumowanie)
});
/* ==============================================================
   KROK 5 – WYSŁANIE ZAPYTANIA
================================================================ */
const FORM_ENDPOINT = "https://formspree.io/f/your_form_id"; // <-- podmień na swój endpoint
sendBtn.addEventListener("click", async () => {
    const payload = {
        ...order,
        timestamp: new Date().toISOString()
    };
    try {
        const resp = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (resp.ok) {
            showStep(5); // krok‑6 (podziękowanie)
        }
        else {
            alert("Wysyłka nie powiodła się – spróbuj ponownie.");
        }
    }
    catch (e) {
        console.error(e);
        alert("Błąd podczas wysyłania. Sprawdź konsolę przeglądarki.");
    }
});
/* ==============================================================
   INICJALIZACJA – uruchamiamy pierwszy krok
================================================================ */
showStep(0); // startujemy od kroku‑1
