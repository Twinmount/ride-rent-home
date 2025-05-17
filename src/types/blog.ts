// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};
//  URL Query Delete params
export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type ParamsProps = {
  params: { state: string; category: string };
  searchParams: { [key: string]: string | undefined };
};

export type CategoryType =
  | "all"
  | "design"
  | "engineering"
  | "automotive"
  | "news"
  | "travel";
