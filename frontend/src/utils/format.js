export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

export const numberWithCommas = (value) =>
  new Intl.NumberFormat('en-IN').format(Number(value) || 0);