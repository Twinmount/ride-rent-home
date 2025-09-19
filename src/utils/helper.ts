export const getNumberAfterSpace = (
  input: string
): { phoneNumber: string; countryCode: string } => {
  const match = input.trim().match(/^(\+\d{1,4})/);
  const phoneNumber = match ? match[2].trim() : "";
  return {
    phoneNumber,
    countryCode: match ? match[1] : "",
  };
};

export const getNumberAfterSpaceStrict = (
  input: string
): { phoneNumber: string; countryCode: string } => {
  const trimmedInput = input.trim();

  const spaceIndex = trimmedInput.search(/\s/);

  if (spaceIndex > 0) {
    const potentialCountryCode = trimmedInput.substring(0, spaceIndex);

    if (/^\+\d{1,4}$/.test(potentialCountryCode)) {
      return {
        countryCode: potentialCountryCode,
        phoneNumber: trimmedInput.substring(spaceIndex + 1).trim(),
      };
    }
  }

  const match = trimmedInput.match(/^(\+\d{1,4})(.*)$/);
  if (match) {
    return {
      countryCode: match[1],
      phoneNumber: match[2].trim(),
    };
  }

  return {
    phoneNumber: trimmedInput,
    countryCode: "",
  };
};
