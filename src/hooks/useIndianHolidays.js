import { useQuery } from "@tanstack/react-query";
import { fetchIndianHolidays } from "../api/holidays";

export function useIndianHolidays(year) {
  return useQuery({
    queryKey: ["holidays", "IN", year],
    queryFn: () => fetchIndianHolidays(year),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
}
