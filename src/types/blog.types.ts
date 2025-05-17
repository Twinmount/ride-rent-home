// single promotion type
export interface BlogPromotionType {
  promotionId: string;
  promotionImage: string;
  promotionLink: string;
}

//  get-all-promotions  API response
export interface FetchBlogPromotionsResponse {
  result: {
    list: BlogPromotionType[];
    page: string;
    limit: string;
    total: number;
  };
  status: string;
  statusCode: number;
}

// single blog type
export interface BlogType {
  blogId: string;
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  blogImage: string;
  blogCategory: string;
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
}

//  interface for the get-all-blogs  API response
export interface FetchBlogsResponse {
  result: {
    list: BlogType[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

//  GET specific blog API response
export interface FetchSpecificBlogResponse {
  result: BlogType;
  status: string;
  statusCode: number;
}
