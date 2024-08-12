export enum Locale {
  tr = 'tr',
  en = 'en',
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
