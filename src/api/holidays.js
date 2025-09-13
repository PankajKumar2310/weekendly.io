
export async function fetchIndianHolidays(year) {
  const apiKey = process.env.REACT_APP_CALENDARIFIC_API_KEY;
  const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=IN&year=${year}&type=national`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch holidays");

  const data = await res.json();
  return data.response.holidays || [];
}
