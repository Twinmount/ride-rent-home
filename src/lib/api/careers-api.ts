import { API } from "@/utils/API";

export const sendCareerForm = async (payload: any, country: string) => {
  try {
    const response = await API({
      path: "/applications/career",
      options: {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      },
      country,
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error sending career form:", error);
  }
};

export const sendInternForm = async (payload: any, country: string) => {
  try {
    const response = await API({
      path: "/applications/intern",
      options: {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      },
      country,
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error sending intern form:", error);
  }
};
