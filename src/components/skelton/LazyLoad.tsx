const LazyLoad = () => {
  return (
    <section className="">
      <div className="flex h-screen items-center justify-center space-x-2 bg-white dark:invert">
        <div className="h-8 w-8 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 animate-bounce rounded-full bg-black"></div>
      </div>
    </section>
  );
};
export default LazyLoad;
