import "./SectionLoading.scss";

const SectionLoading = ({ className = "" }: { className?: string }) => {
  return (
    <section className={`lazy-loader ${className}`}>
      <div className="loader"></div>
    </section>
  );
};
export default SectionLoading;
