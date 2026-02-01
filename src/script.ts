/* ==============================================================
   GLOBAL STATE
================================================================ */
interface OrderItem {
  type: string;
  params: Record<string, string>;
  material: string;
  quantity: number;
}

interface Order {
  type: string | null;
  params: Record<string, string>;
  material: string | null;
  quantity: number;
  contact: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  cart: OrderItem[];
}

/* Początkowy stan */
const order: Order = {
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
const prevButtons: Record<number, HTMLButtonElement> = {
  1: document.getElementById("back-1") as HTMLButtonElement,
  2: document.getElementById("back-2") as HTMLButtonElement,
  3: document.getElementById("back-3") as HTMLButtonElement,
  4: document.getElementById("back-4") as HTMLButtonElement,
};

const nextButtons: Record<number, HTMLButtonElement> = {
  2: document.getElementById("to-3") as HTMLButtonElement,
  3: document.getElementById("to-4") as HTMLButtonElement,
  4: document.getElementById("to-5") as HTMLButtonElement,
};

const sendBtn = document.getElementById("send-order") as HTMLButtonElement;

/* UI elements */
const illustrationDiv = document.getElementById("illustration") as HTMLElement;
const progressSteps = document.querySelectorAll(
  ".progress-step"
) as NodeListOf<HTMLElement>;

const langButtons = document.querySelectorAll(
  ".lang-btn"
) as NodeListOf<HTMLButtonElement>;

/* ==============================================================
   I18N – proste tłumaczenia (PL / EN)
================================================================ */
type Lang = "pl" | "en";
let currentLang: Lang = "pl";

const translations: Record<Lang, Record<string, string>> = {
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
    thankMsg:
      "Twoje zapytanie zostało wysłane. Odpowiemy w ciągu 2–3 dni roboczych.",
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