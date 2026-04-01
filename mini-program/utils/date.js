// utils/date.js
function differenceInDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d1 - d2);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getRemainingDuration(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  let years = target.getFullYear() - now.getFullYear();
  let months = target.getMonth() - now.getMonth();
  let days = target.getDate() - now.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function formatDate(date, format = 'yyyy-MM-dd') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  if (format === 'yyyy.MM.dd') return `${year}.${month}.${day}`;
  return `${year}-${month}-${day}`;
}

module.exports = {
  differenceInDays,
  getRemainingDuration,
  formatDate
};
