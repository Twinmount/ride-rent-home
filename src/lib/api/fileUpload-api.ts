import { GcsFilePaths } from "@/constants/fileUpload";

export interface SingleFileUploadResponse {
  result: {
    message: string;
    fileName: string;
    path: string;
  };
  status: string;
  statusCode: number;
}

export const uploadSingleFile = async (
  fileCategory: GcsFilePaths,
  file: File,
  country: string,
): Promise<SingleFileUploadResponse> => {
  const BASE_URL =
    country === "in"
      ? process.env.NEXT_PUBLIC_API_URL_INDIA
      : process.env.NEXT_PUBLIC_API_URL;

  try {
    const formData = new FormData();
    formData.append("fileCategory", fileCategory);
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/file/upload/no-auth/single`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Upload failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as SingleFileUploadResponse;

    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
