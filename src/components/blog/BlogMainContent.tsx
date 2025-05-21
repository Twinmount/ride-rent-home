import { Suspense } from "react";
import BlogDetails from "./blog-content/BlogDetails";
import PromotionCardSkelton from "../skelton/PromotionCardSkelton";
import Promotion from "./Promotion";
import PopularBlogs from "./PopularBlogs";
import PopularCardSkeleton from "../skelton/PopularCardSkelton";

type BlogMainContentProps = {
  blogContent: string;
};

export default function BlogMainContent({ blogContent }: BlogMainContentProps) {
  return (
    <div className="wrapper my-4 mt-8 flex gap-6 max-lg:flex-col lg:mt-12">
      {/* left section */}
      <BlogDetails blogContent={blogContent} />

      {/* right section */}
      <div className="flex flex-col gap-6">
        {/* promotions */}
        <Suspense fallback={<PromotionCardSkelton count={1} />}>
          <Promotion />
        </Suspense>

        {/* popular blogs */}
        <Suspense fallback={<PopularCardSkeleton count={4} />}>
          <PopularBlogs />
        </Suspense>
      </div>
    </div>
  );
}
