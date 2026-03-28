const REQUISITOS_PASSWORD = {
  mayusculas: { regex: /[A-Z]/g, minimo: 2 },
  minusculas: { regex: /[a-z]/g, minimo: 2 },
  numeros: { regex: /[0-9]/g, minimo: 2 },
  especiales: { regex: /[!@#$%^&*()_+\-=[\]{};:'",.<>?\\|`~]/g, minimo: 2 },
  longitud: { minimo: 12 }
};

const p = 'AaBb12!!cccc';
console.log('pass:', p);
console.log('mayus:', (p.match(REQUISITOS_PASSWORD.mayusculas.regex) || []).length);
console.log('minus:', (p.match(REQUISITOS_PASSWORD.minusculas.regex) || []).length);
console.log('num:', (p.match(REQUISITOS_PASSWORD.numeros.regex) || []).length);
console.log('esp:', (p.match(REQUISITOS_PASSWORD.especiales.regex) || []).length);
console.log('len:', p.length);
