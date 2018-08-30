import { SecureStore, StoreReview } from 'expo';
import moment from 'moment';

const LAST_CHECK_DATE = 'storeReviewLastCheckDate';
const initialDate = moment().format('YYYY-MM-DD');

export const moreThanAWeek = (today, lastCheck) => {
  const lastCheckDate = moment(lastCheck).startOf('day');
  const A_WEEK_OLD = moment(today)
    .clone()
    .subtract(7, 'days')
    .startOf('day');
  return !lastCheckDate.isAfter(A_WEEK_OLD);
};

export const updateLastCheck = (date = initialDate) => {
  return SecureStore.setItemAsync(LAST_CHECK_DATE, date);
};

const AskForReview = async () => {
  const lastCheckDate = await SecureStore.getItemAsync(LAST_CHECK_DATE);
  if (!moreThanAWeek(initialDate, lastCheckDate)) {
    return;
  }

  if (!StoreReview.isSupported()) {
    return;
  }

  StoreReview.requestReview();
  updateLastCheck();
};

export default AskForReview;
