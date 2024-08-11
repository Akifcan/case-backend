import { CurrencyValue, currencySymbols } from './shared.types'

export const priceLabel = (value: string | number, currency: CurrencyValue) => {
  return `${value}${currencySymbols[currency]}`
}
