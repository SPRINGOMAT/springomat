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
  cart: OrderItem[];               // lista zamówień (funkcjonalność „koszyka”)
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
    contact: "Contact details",
    summary: "Order summary",
    thankYou: "Thank you!",
    thankMsg:
      "Your inquiry has been sent. Expect a reply within 2‑3 business days.",
    send: "Send inquiry",
    back: "Back",
    next: "Next"
  }
};

/* Helper – zwraca przetłumaczony tekst */
function t(key: keyof typeof translations["pl"]): string {
  return translations[currentLang][key] ?? key;
}

/* ==============================================================
   UTILS – zmiana kroków, progress‑bar, itp.
================================================================ */
function showStep(idx: number): void {
  // ukryj wszystkie sekcje
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  // pokaż wybraną
  const target = document.getElementById(steps[idx]);
  if (target) target.classList.add("active");

  currentStep = idx;
  updateProgressBar();

  // przycisk „Cofnij” ukrywamy w pierwszym kroku
  Object.values(prevButtons).forEach(btn =>
    btn?.classList.toggle("hidden", idx === 0)
  );
}

/* ---- Progress bar ---- */
function updateProgressBar(): void {
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
function applyTranslations(): void {
  document.title = t("title");
  // wszystkie elementy posiadające atrybut data-key zostaną przetłumaczone
  document.querySelectorAll("[data-key]").forEach(node => {
    const key = (node as HTMLElement).dataset.key as keyof typeof translations["pl"];
    (node as HTMLElement).textContent = t(key);
  });
}

/* Uruchom tłumaczenia przy starcie */
applyTranslations();

/* ==============================================================
   LANG SWITCHER – przełączanie języka
================================================================ */
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang as Lang;
    langButtons.forEach(b => b.classList.toggle("selected", b === btn));
    applyTranslations();
  });
});

/* ==============================================================
   TYPE BUTTONS – wybór sprężyny + podpowiedź graficzna
================================================================ */
const typeButtons = document.querySelectorAll(
  ".type-btn"
) as NodeListOf<HTMLButtonElement>;

typeButtons.forEach(btn => {
  const type = btn.dataset.type as string;

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
function setIllustration(type: string): void {
  const map: Record<string, string> = {
    compression: "compression.svg",
    tension: "tension.svg",
    torsion: "torsion.svg",
    plate: "plate.svg",
    other: "other.svg"
  };
  const fileName = map[type];
  if (!fileName) return;

  // usuń poprzedni <img>, jeśli istnieje
  illustrationDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = `assets/${fileName}`;
  img.alt = `${type} illustration`;
  illustrationDiv.appendChild(img);
  illustrationDiv.classList.add("show");
}
function hideIllustration(): void {
  illustrationDiv.classList.remove("show");
  illustrationDiv.innerHTML = "";
}

/* ==============================================================
   KROK 2 – GENEROWANIE PÓL PARAMETRÓW
================================================================ */
function generateParamFields(): void {
  const container = document.getElementById("params-form") as HTMLElement;
  container.innerHTML = "";

  const fieldDefs: Record<
    string,
    Array<{
      key: string;
      label: string;
      type?: "select" | "textarea";
      options?: string[];
    }>
  > = {
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

  const chosen = fieldDefs[order.type as string];
  chosen.forEach(f => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = f.label;

    let input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    if (f.type === "select") {
      input = document.createElement("select");
      (f.options ?? []).forEach(opt => {
        const optEl = document.createElement("option");
        optEl.value = opt.toLowerCase();
        optEl.textContent = opt;
        (input as HTMLSelectElement).appendChild(optEl);
      });
    } else if (f.type === "textarea") {
      input = document.createElement("textarea");
      (input as HTMLTextAreaElement).rows = 3;
    } else {
      input = document.createElement("input");
      input.type = "number";
      (input as HTMLInputElement).step = "a