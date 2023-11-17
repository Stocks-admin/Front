const FullWidthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-300 px-2 py-3 min-h-screen flex flex-col">
      <div className="bg-white rounded-3xl flex-1 flex flex-col">
        <div className="container mx-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
export default FullWidthLayout;
