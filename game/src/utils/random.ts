export function getRandomNumber(
  min: number,
  max: number,
): number {
  min = 0
  return Math.floor(Math.random() * max) + min
}
