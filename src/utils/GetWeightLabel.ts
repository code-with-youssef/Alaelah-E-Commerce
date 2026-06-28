export function getWeightLabel(
  variant: string,
  unitType: string | number,
  unit: string
): string {
  if (Number(unitType) === 0) {
    return variant;
  }

  return unit;
}