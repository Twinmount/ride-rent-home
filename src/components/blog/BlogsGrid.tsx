import LoadMoreBlogs from "@/components/blog/LoadMoreBlogs";
import { fetchBlogsData } from "@/app/(root)/blog/actions";

type BlogsGridProps = {
  selectedTag: string;
};

export default async function BlogsGrid({ selectedTag }: BlogsGridProps) {
  const data = await fetchBlogsData({ selectedTag, page: 1 });

  const blogs = data.blogs;

  return (
    <div>
      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs}
          </div>

          <LoadMoreBlogs selectedTag={selectedTag} />
        </>
      ) : (
        <div className="flex-center h-72 text-lg font-thin">
          No Blogs Found{" "}
          {selectedTag !== "all" && (
            <span>
              under tag &nbsp;
              <span className="rounded-lg bg-slate-200 px-1 capitalize italic text-slate-800">
                {selectedTag}
              </span>
            </span>
          )}
          &nbsp;:/
        </div>
      )}
    </div>
  );
}
