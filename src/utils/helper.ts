import { toast, Bounce, ToastPosition } from "react-toastify";

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

export const tostHandler = (
  message: string,
  type: "success" | "error" | "warning" | "info"
) => {
  const tostSettings = {
    position: "top-right" as ToastPosition,
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  };
  switch (type) {
    case "success":
      toast.success(message, tostSettings);
      break;
    case "error":
      toast.error(message, tostSettings);
      break;
    case "warning":
      toast.warn(message, tostSettings);
      break;
    case "info":
      toast.info(message, tostSettings);
      break;
    default:
      toast(message, tostSettings);
      break;
  }
};

export const getDotCount = (str?: string | null): number => {
  if (!str || typeof str !== "string") {
    return 0;
  }

  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ".") {
      count++;
    }
  }
  return count;
};

export const maskPhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return "";
  const visibleDigits = phoneNumber.slice(-4); // last 4 digits
  const maskedSection = "•".repeat(Math.max(phoneNumber.length - 4, 0));
  return `${maskedSection}${visibleDigits}`;
};
