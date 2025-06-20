const LoginButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="text-sm min-w-[120px] px-3 py-3 bg-white text-black border border-gray-200 rounded-xl hover:bg-gray-100"
  >
    {children}
  </button>
);

export default LoginButton;
