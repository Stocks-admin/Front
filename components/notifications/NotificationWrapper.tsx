interface IProps {
  children: React.ReactNode;
}

const NotificationWrapper = ({ children }: IProps) => {
  return (
    <div className="w-full bg-gray-300 text-black px-5 py-3 rounded-md">
      {children}
    </div>
  );
};
export default NotificationWrapper;
