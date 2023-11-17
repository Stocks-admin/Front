import Sheet from "react-modal-sheet";

interface IProps {
  children: React.ReactNode;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
  title?: string;
}

const BottomCard = ({
  children,
  isDrawerOpen,
  setIsDrawerOpen,
  title = "",
}: IProps) => {
  const closeSheet = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Sheet isOpen={isDrawerOpen} onClose={closeSheet}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
};

export default BottomCard;
