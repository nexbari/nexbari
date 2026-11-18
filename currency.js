// Currency helper for NEXBARI
function formatNxbPrice(amount, currency = 'BDT') {
    if (amount === null || amount === undefined || amount === '') return '';
    const num = Number(amount);
    if (isNaN(num)) return String(amount);
    if (currency === 'BDT') {
        return '৳' + num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 2
    }).format(num);
}
