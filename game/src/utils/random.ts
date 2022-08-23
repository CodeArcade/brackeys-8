import { toNumber } from "lodash";

export function getRandomNumber(
  min: number,
  max: number,
  decimals: number = 0
): number {
  return toNumber((Math.random() * (min - max) + max).toFixed(decimals));
}
