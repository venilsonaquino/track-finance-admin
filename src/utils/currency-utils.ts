export function formatCurrency(value: number, locale?: string, currency?: string): string {
  return new Intl.NumberFormat(locale || "pt-BR", { style: "currency", currency: currency || "BRL" }).format(value || 0);
}