export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  /** How many units of this currency per 1 MWK */
  ratePerMwk: number;
}

export const COUNTRY_CURRENCIES: Record<string, CurrencyInfo> = {
  MW: { code: "MWK", symbol: "MWK", name: "Malawian Kwacha", ratePerMwk: 1 },
  ZM: { code: "ZMW", symbol: "K", name: "Zambian Kwacha", ratePerMwk: 0.0155 },
  ZW: { code: "USD", symbol: "$", name: "US Dollar", ratePerMwk: 0.00058 },
  ZA: { code: "ZAR", symbol: "R", name: "South African Rand", ratePerMwk: 0.0105 },
  KE: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", ratePerMwk: 0.0746 },
  TZ: { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling", ratePerMwk: 1.508 },
  GH: { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", ratePerMwk: 0.0091 },
  NG: { code: "NGN", symbol: "₦", name: "Nigerian Naira", ratePerMwk: 0.917 },
  UG: { code: "UGX", symbol: "USh", name: "Ugandan Shilling", ratePerMwk: 2.146 },
  RW: { code: "RWF", symbol: "RF", name: "Rwandan Franc", ratePerMwk: 0.690 },
  ET: { code: "ETB", symbol: "Br", name: "Ethiopian Birr", ratePerMwk: 0.032 },
  MZ: { code: "MZN", symbol: "MT", name: "Mozambican Metical", ratePerMwk: 0.037 },
  BW: { code: "BWP", symbol: "P", name: "Botswana Pula", ratePerMwk: 0.0079 },
  AO: { code: "AOA", symbol: "Kz", name: "Angolan Kwanza", ratePerMwk: 0.484 },
  CM: { code: "XAF", symbol: "FCFA", name: "Central African CFA Franc", ratePerMwk: 0.347 },
  CI: { code: "XOF", symbol: "CFA", name: "West African CFA Franc", ratePerMwk: 0.347 },
  SN: { code: "XOF", symbol: "CFA", name: "West African CFA Franc", ratePerMwk: 0.347 },
  US: { code: "USD", symbol: "$", name: "US Dollar", ratePerMwk: 0.00058 },
  GB: { code: "GBP", symbol: "£", name: "British Pound", ratePerMwk: 0.000456 },
  DE: { code: "EUR", symbol: "€", name: "Euro", ratePerMwk: 0.000529 },
  FR: { code: "EUR", symbol: "€", name: "Euro", ratePerMwk: 0.000529 },
  CN: { code: "CNY", symbol: "¥", name: "Chinese Yuan", ratePerMwk: 0.00421 },
  IN: { code: "INR", symbol: "₹", name: "Indian Rupee", ratePerMwk: 0.0484 },
  AU: { code: "AUD", symbol: "A$", name: "Australian Dollar", ratePerMwk: 0.000893 },
  CA: { code: "CAD", symbol: "C$", name: "Canadian Dollar", ratePerMwk: 0.000789 },
  AE: { code: "AED", symbol: "AED", name: "UAE Dirham", ratePerMwk: 0.00213 },
  OTHER: { code: "USD", symbol: "$", name: "US Dollar", ratePerMwk: 0.00058 },
};

export const COUNTRIES = [
  { code: "MW", name: "Malawi" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "ZA", name: "South Africa" },
  { code: "KE", name: "Kenya" },
  { code: "TZ", name: "Tanzania" },
  { code: "GH", name: "Ghana" },
  { code: "NG", name: "Nigeria" },
  { code: "UG", name: "Uganda" },
  { code: "RW", name: "Rwanda" },
  { code: "ET", name: "Ethiopia" },
  { code: "MZ", name: "Mozambique" },
  { code: "BW", name: "Botswana" },
  { code: "AO", name: "Angola" },
  { code: "CM", name: "Cameroon" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "SN", name: "Senegal" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "AE", name: "UAE" },
  { code: "OTHER", name: "Other" },
];

export function getCurrency(countryCode: string | undefined): CurrencyInfo {
  return COUNTRY_CURRENCIES[countryCode ?? "MW"] ?? COUNTRY_CURRENCIES["MW"];
}

export function formatPrice(mwkPrice: number, countryCode: string | undefined): string {
  const currency = getCurrency(countryCode);
  const converted = mwkPrice * currency.ratePerMwk;

  if (currency.code === "MWK") {
    return `MWK ${Math.round(converted).toLocaleString()}`;
  }

  // For small values show 2 decimal places, large values round to integer
  const formatted =
    converted < 100
      ? converted.toFixed(2)
      : Math.round(converted).toLocaleString();

  return `${currency.symbol}${formatted}`;
}

export function formatPriceWithNote(mwkPrice: number, countryCode: string | undefined): { main: string; note?: string } {
  const currency = getCurrency(countryCode);
  if (currency.code === "MWK") {
    return { main: `MWK ${Math.round(mwkPrice).toLocaleString()}` };
  }
  const main = formatPrice(mwkPrice, countryCode);
  return {
    main,
    note: `≈ MWK ${Math.round(mwkPrice).toLocaleString()} (approx.)`,
  };
}
