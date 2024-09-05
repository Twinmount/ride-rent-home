const ListingSkelton = () => {
  return (
    <div className=" pt-64 h-screen w-full flex flex-col items-center">
      <div className="flex space-x-2 justify-center dark:invert">
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>
      <p className="mt-3 italic text-gray-600">Searching for your result...</p>
    </div>
  )
}
export default ListingSkelton
