const TZ = 'America/Los_Angeles';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  timeZone: TZ,
});
const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: TZ,
});

export const dateFormatter = (rawDate: Date) => {
  const date = new Date(rawDate);
  return dateFmt.format(date);
};

export const timeFormatter = (rawDate: Date) => {
  const date = new Date(rawDate);
  return timeFmt.format(date);
};

export const moneyFormatter = (amount: number | null | undefined, currency = 'USD') =>
  amount == null
    ? ''
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
