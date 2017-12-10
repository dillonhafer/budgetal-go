import {_get} from 'api';

export function FindStatisticRequest({year, month}) {
  return _get(`/monthly-statistics/${year}/${month}`);
}
