import styles from "./BlogDetails.module.css"; // Import the module

type BlogDetailsProps = {
  blogContent: string; // Accept blogContent as a prop
};

export default function BlogDetails({ blogContent }: BlogDetailsProps) {
  return (
    <div className="w-full md:w-4/5">
      <div
        className={` ${styles.blogContent}`}
        dangerouslySetInnerHTML={{ __html: blogContent }} // Use the passed blogContent
      ></div>
    </div>
  );
}
