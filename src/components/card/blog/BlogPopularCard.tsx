import { generateBlogHref } from "@/helpers/blog-helpers";
import Image from "next/image";
import Link from "next/link";

interface BlogPopularCardProps {
  blogImage: string;
  blogId: string;
  title: string;
  description: string;
}

const BlogPopularCard = ({
  blogImage,
  title,
  blogId,
  description,
}: BlogPopularCardProps) => {
  const href = generateBlogHref(title);

  return (
    <Link
      href={`/${href}/${blogId}`}
      className="mb-1 flex items-center gap-2 border-b border-gray-200 p-0 transition duration-200 hover:bg-gray-100"
    >
      {/* Blog Image */}
      <Image
        width={200}
        height={200}
        src={blogImage}
        alt={title}
        className="h-20 w-20 rounded-xl object-cover"
      />
      {/* Blog Text Info */}
      <div className="py-1 pl-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default BlogPopularCard;
