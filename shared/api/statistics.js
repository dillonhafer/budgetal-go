import { _get } from "./index";

export function FindStatisticRequest({ year, month }) {
  return _get(`/monthly-statistics/${year}/${month}`);
}
