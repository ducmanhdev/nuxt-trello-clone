export const centsToDollars = (amountInCents: number): number => {
  if (Number.isNaN(amountInCents)) {
    console.error('Invalid input: amount is not a number')
    return 0
  }

  if (amountInCents < 0) {
    console.error('Invalid input: amount cannot be negative')
    return 0
  }

  return amountInCents / 100
}
