export function restoreVehicleCodeFormat(lowerCaseCode: string): string {
  // Split the code into the alphabetic part and numeric part based on the hyphen
  const [alphabets, numbers] = lowerCaseCode.split("-");

  if (!alphabets || !numbers) {
    return lowerCaseCode;
  }

  // Capitalize the alphabets and combine them back with the numbers
  return `${alphabets.toUpperCase()}-${numbers}`;
}
