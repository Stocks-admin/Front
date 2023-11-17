import { toast } from "react-toastify";

export function useToast() {
  const handle = (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    switch (type) {
      case "success":
        toast.success(message, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        break;
      case "error":
        toast.error(message, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        break;
      case "warning":
        toast.warn(message, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        break;
      case "info":
        toast.info(message, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        break;
      default:
        toast(message, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        break;
    }
  };
  return [handle];
}
