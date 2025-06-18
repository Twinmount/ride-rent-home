// import { ApplicationFormValues } from "@/types/careers";

export const sendCareerForm = async (payload: any, country: string) => {
  try {
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${BASE_URL}/applications/career`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send career form. Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`,
      );
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error sending career form:", error);
  }
};

export const sendInternForm = async (payload: any, country: string) => {
  try {
    const BASE_URL =
      country === "in"
        ? process.env.NEXT_PUBLIC_API_URL_INDIA
        : process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${BASE_URL}/applications/intern`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to send intern form. Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`,
      );
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error sending intern form:", error);
  }
};
