import { CurrencyTableConstant, LIMIT_VALUE } from "./constants";

export const CREATE_CURRENCY_TABLE =
  'create table if not exists ' +
  CurrencyTableConstant.TABLE_NAME +
  '(' +
  CurrencyTableConstant.ID +
  ' integer primary key autoincrement,' +
  CurrencyTableConstant.TIMESTAMP +
  ' text,' +
  CurrencyTableConstant.CURRENCY_TYPE +
  ' text,' +
  CurrencyTableConstant.VALUE +
  ' text);';

export const FETCH_ALL_DATA_CURRENCY_TABLE =
  'Select * from ' + CurrencyTableConstant.TABLE_NAME;

export function currencyInsertCommand(value) {
  return (
    'INSERT INTO ' +
    CurrencyTableConstant.TABLE_NAME +
    ' (' +
    CurrencyTableConstant.TIMESTAMP +
    ', ' +
    CurrencyTableConstant.CURRENCY_TYPE +
    ', ' +
    CurrencyTableConstant.VALUE +
    ") VALUES ('" +
    value.timestamp +
    "', '" +
    value.currency_type +
    "', '" +
    value.value +
    "')"
  );
}

export function fetchCurrencyByType(type) {
  return (
    'Select * from ' +
    CurrencyTableConstant.TABLE_NAME +
    ' where ' +
    CurrencyTableConstant.CURRENCY_TYPE +
    " = '" +
    type +
    "'"
  );
}

export const REMOVE_OLD_VALUES =
  'Delete from ' +
  CurrencyTableConstant.TABLE_NAME +
  ' where id not IN (Select id from ' +
  CurrencyTableConstant.TABLE_NAME +
  ' ORDER BY id DESC limit ' +
  LIMIT_VALUE +
  ')';