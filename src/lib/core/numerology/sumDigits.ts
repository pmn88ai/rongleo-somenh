// Sum all digits of a number. Single pass.
// Example: 1988 → 1+9+8+8 = 26
export function sumDigits(n: number): number {
  let sum = 0
  let r   = n
  while (r > 0) {
    sum += r % 10
    r    = Math.floor(r / 10)
  }
  return sum
}

// Reduce n to a single digit with no master-number preservation.
// Used for reducing date components before summing.
export function reducePlain(n: number): number {
  let r = n
  while (r > 9) r = sumDigits(r)
  return r
}
