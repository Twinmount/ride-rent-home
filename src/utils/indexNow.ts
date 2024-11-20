const INDEXNOW_API_URL = "https://api.indexnow.org/indexnow";
const HOST = process.env.NEXT_PUBLIC_HOST;
const KEY = process.env.NEXT_PUBLIC_INDEXNOW_KEY;

export const submitUrlsToIndexNow = async (urlList: string[]): Promise<any> => {
  const keyLocation = `${HOST}/${KEY}.txt`;

  try {
    const response = await fetch(INDEXNOW_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation, urlList }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting URLs to IndexNow:", error);
    throw error;
  }
};
