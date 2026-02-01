"use strict";
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
        contact: "Contact
    }
};
