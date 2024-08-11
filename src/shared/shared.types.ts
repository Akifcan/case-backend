export enum Locale {
  tr = 'tr',
  en = 'en',
  ar = 'ar',
}

export type CurrencyValue = 'tl' | 'euro' | 'dollar'

export enum Currency {
  tl = 'tl',
  euro = 'euro',
  dollar = 'dollar',
}

export const currencySymbols: Record<CurrencyValue, string> = {
  dollar: '$',
  tl: '₺',
  euro: '€',
}
