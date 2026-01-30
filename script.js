/* ---------- GLOBAL STATE ---------- */
const order = {
  type: null,
  params: {},
  material: null,
  quantity: 1,
  contact: {}
};

/* ---------- UTILS ---------- */
function showStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ---------- STEP 1 – TYPE ---------- */
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    order.type = btn.dataset.type;
    document.getElementById('to-2').classList.remove('hidden');
  });
});

document.getElementById('to-2').addEventListener('click', () => {
  generateParamFields();   // tworzy pola w kroku 2
  showStep('step-2');
});

/* ---------- STEP 2 – PARAMETERS ---------- */
function generateParamFields() {
  const container = document.getElementById('params-form');
  container.innerHTML = '';

  const fields = {
    compression: [
      {key:'d', label:'Średnica drutu (d)'},
      {key:'Dp', label:'Średnica podziałowa (Dp)'},
      {key:'Dz', label:'Średnica zewnętrzna (Dz)'},
      {key:'Lo', label:'Długość całkowita (Lo)'},
      {key:'z',  label:'Ilość zwojów (z)'},
      {key:'direction', label:'Kierunek sprężyny', type:'select',
       options:['Lewy','Prawy']}
    ],
    tension: [
      {key:'d', label:'Średnica drutu (d)'},
      {key:'Dp', label:'Średnica podziałowa (Dp)'},
      {key:'Dz', label:'Średnica zewnętrzna (Dz)'},
      {key:'Lo', label:'Długość całkowita (Lo)'},
      {key:'z',  label:'Ilość zwojów (z)'},
      {key:'hook', label:'Typ zaczepu', type:'select',
       options:['Zwykły','Uchwyt']},
      {key:'direction', label:'Kierunek sprężyny', type:'select',
       options:['Lewy','Prawy']}
    ],
    torsion: [
      {key:'d', label:'Średnica drutu (d)'},
      {key:'Dp', label:'Średnica podziałowa (Dp)'},
      {key:'Dz', label:'Średnica zewnętrzna (Dz)'},
      {key:'Lo', label:'Długość całkowita (Lo)'},
      {key:'z',  label:'Ilość zwojów (z)'},
      {key:'Lr', label:'Długość ramion (Lr)'},
      {key:'angle', label:'Kąt ustawienia ramion (°)'},
      {key:'direction', label:'Kierunek sprężyny', type:'select',
       options:['Lewy','Prawy']}
    ],
    plate: [
      {key:'d', label:'Grubość materiału (d)'},
      {key:'Do', label:'Średnica zewnętrzna (Do)'},
      {key:'Di', label:'Średnica wewnętrzna (Di)'},
      {key:'H',  label:'Wysokość (H)'}
    ],
    other: [
      {key:'description', label:'Opis sprężyny', type:'textarea'}
    ]
  };

  const chosen = fields[order.type];
  chosen.forEach(f => {
    const wrapper = document.createElement('div');
    wrapper.className = 'field';

    const label = document.createElement('label');
    label.textContent = f.label;

    let input;
    if (f.type === 'select') {
      input = document.createElement('select');
      f.options.forEach(opt => {
        const optEl = document.createElement('option');
        optEl.value = opt.toLowerCase();
        optEl.textContent = opt;
        input.appendChild(optEl);
      });
    } else if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
    }

    input.name = f.key;
    input.required = true;
    label.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

/* Zapis parametrów i przejście dalej */
document.getElementById('to-3').addEventListener('click', () => {
  const form = new FormData(document.getElementById('params-form'));
  order.params = Object.fromEntries(form.entries());
  showStep('step-3');
});

/* ---------- NAVIGATION BACK ---------- */
document.getElementById('back-1').onclick = () => showStep('step-1');
document.getElementById('back-2').onclick = () => showStep('step-2');
document.getElementById('back-3').onclick = () => showStep('step-3');
document.getElementById('back-4').onclick = () => showStep('step-4');

/* ---------- STEP 3 – MATERIAL ---------- */
document.getElementById('material-select').addEventListener('change', e => {
  order.material = e.target.value;
});
document.getElementById('quantity').addEventListener('input', e => {
  order.quantity = Number(e.target.value);
});
document.getElementById('to-4').addEventListener('click', () => {
  if (!order.material) order.material = document.getElementById('material-select').value;
  showStep('step-4');
});

/* ---------- STEP 4 – CONTACT ---------- */
document.getElementById('to-5').addEventListener('click', () => {
  const form = new FormData(document.getElementById('contact-form'));
  order.contact = Object.fromEntries(form.entries());

  // podsumowanie
  const sumDiv = document.getElementById('summary');
  sumDiv.innerHTML = `
    <strong>Rodzaj:</strong> ${order.type} 
    <strong>Parametry:</strong> ${JSON.stringify(order.params)} 
    <strong>Materiał:</strong> ${order.material} 
    <strong>Ilość:</strong> ${order.quantity} 
    <strong>Dane kontaktowe:</strong> ${JSON.stringify(order.contact)}
  `;
  showStep('step-5');
});

/* ---------- STEP 5 – SEND ---------- */
// 👉 Zastąp poniższy URL swoim endpointem z Formspree (lub innym serwisem)
const FORM_ENDPOINT = 'https://formspree.io/f/mzdgrqdd';   // <‑‑ <<< ZMIEŃ TO

document.getElementById('send-order').addEventListener('click', async () => {
  const payload = {
    ...order,
    timestamp: new Date().toISOString()
  };

  try {
    const resp = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (resp.ok) {
      showStep('step-6');
    } else {
      alert('Wysyłka nie powiodła się – spróbuj ponownie.');
    }
  } catch (e) {
    console.error(e);
    alert('Błąd podczas wysyłania. Sprawdź konsolę przeglądarki.');
  }
});