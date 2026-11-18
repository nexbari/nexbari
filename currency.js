/* NEXBARI storefront currency helper. Load after Supabase client and before storefront app code. */
const NEXBARI_COUNTRY_CURRENCY = {
 BD:'BDT', US:'USD', GB:'GBP', EU:'EUR', DE:'EUR', FR:'EUR', IT:'EUR', ES:'EUR', NL:'EUR',
 IN:'INR', PK:'PKR', NP:'NPR', LK:'LKR', AE:'AED', SA:'SAR', QA:'QAR', KW:'KWD',
 SG:'SGD', MY:'MYR', TH:'THB', ID:'IDR', PH:'PHP', JP:'JPY', CN:'CNY', CA:'CAD',
 AU:'AUD', NZ:'NZD', CH:'CHF', TR:'TRY', ZA:'ZAR'
};
let NEXBARI_VISITOR_CURRENCY = 'BDT';
let NEXBARI_RATES = {};
async function detectNexbariCurrency(){
  try { const r=await fetch('https://ipapi.co/json/'); if(r.ok){const j=await r.json();NEXBARI_VISITOR_CURRENCY=j.currency||NEXBARI_COUNTRY_CURRENCY[j.country_code]||'BDT';} } catch(e) { NEXBARI_VISITOR_CURRENCY='BDT'; }
  return NEXBARI_VISITOR_CURRENCY;
}
async function loadNexbariRates(base){
  if(NEXBARI_RATES[base])return NEXBARI_RATES[base];
  try {const r=await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`);const j=await r.json();if(j.result==='success'){NEXBARI_RATES[base]=j.rates;return j.rates;}}catch(e){}
  return null;
}
async function formatNexbariPrice(amount, sourceCurrency, targetCurrency=NEXBARI_VISITOR_CURRENCY){
  const value=Number(amount||0), from=(sourceCurrency||'BDT').toUpperCase(), to=(targetCurrency||from).toUpperCase();
  let converted=value;
  if(from!==to){const rates=await loadNexbariRates(from);if(rates&&Number.isFinite(rates[to]))converted=value*rates[to];else return new Intl.NumberFormat(undefined,{style:'currency',currency:from}).format(value);}
  try{return new Intl.NumberFormat(undefined,{style:'currency',currency:to,maximumFractionDigits:to==='JPY'?0:2}).format(converted);}catch(e){return `${to} ${converted.toFixed(2)}`;}
}
