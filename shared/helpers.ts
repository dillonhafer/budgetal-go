import * as lodash from "lodash";
import * as parser from "ua-parser-js";
import * as moment from "moment";

const date = new Date();
const defaultMonth = date.getMonth() + 1;
const defaultYear = date.getFullYear();

export const defaultDate = {
  month: defaultMonth,
  year: defaultYear
};

export const monthName = (month: number) => {
  return moment.months()[month - 1];
};

export const currencyf = (
  number: string | number,
  dollarSign = "$",
  fixed = 2
) => {
  if (isNaN(parseFloat(String(number)))) {
    number = "0";
  }

  const group3Regex = /(\d)(?=(\d{3})+\.)/g;
  const newNumber = parseFloat(String(number)).toFixed(2);
  const str = dollarSign + newNumber.replace(group3Regex, "$1,");
  return fixed > 0 ? str : str.slice(0, -3);
};

export const cleanCurrencyString = (s: string) => {
  return s.replace(/[^\d|.]/g, "");
};

export const availableYears = () => {
  return lodash.range(2015, new Date().getFullYear() + 3);
};

export const pluralize = (count: number, singlular: string, plural: string) => {
  let word = plural;
  if (count === 1) word = singlular;

  return `${count} ${word}`;
};

export const humanUA = (userAgent: string) => {
  const p = new parser.UAParser(userAgent);
  const browser = p.getBrowser();
  const os = p.getOS();
  const ua = p.getUA();

  let text = `${browser.name} ${browser.major} on ${os.name}`;

  if (browser.name === undefined) {
    text = ua;
  }

  if (ua.search(/Budgetal/) || ua.search(/Expo/)) {
    text = "Budgetal App on iOS";
  }

  if (ua.search(/okhttp/)) {
    text = "Budgetal App on Android";
  }

  return text;
};

export const reduceSum = (array: any[], property = "amount") => {
  return lodash.reduce(
    array,
    (total: number, item: any) => {
      const sum = parseFloat(String(total)) + parseFloat(item[property]);
      return lodash.round(sum, 2);
    },
    0.0
  );
};

export const percentSpent = (budgeted: number, spent: number) => {
  const p = (spent / budgeted) * 100;
  if (p > 99.99) {
    return 100;
  }

  if (isNaN(p)) {
    return 0;
  }

  return parseInt(String(p), 10);
};

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+$/;
export const validEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};
