import {
  faCross,
  faInfo,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer } from "flowbite";
import type { DrawerOptions, DrawerInterface } from "flowbite";
import { useEffect, useRef, useState } from "react";

interface IProps {
  children: React.ReactNode;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
  title?: string;
  position?: "left" | "right";
}

const SideDrawer = ({
  children,
  isDrawerOpen,
  setIsDrawerOpen,
  title = "",
  position = "right",
}: IProps) => {
  const [drawer, setDrawer] = useState<DrawerInterface | null>(null);
  const target = useRef<HTMLDivElement>(null);

  const closeSheet = () => {
    drawer?.hide();
  };

  useEffect(() => {
    console.log("isDrawerOpen", isDrawerOpen);
    if (!drawer) return;
    if (isDrawerOpen) {
      drawer.show();
    }
  }, [isDrawerOpen]);

  const options: DrawerOptions = {
    placement: position,
    backdrop: true,
    bodyScrolling: false,
    edge: false,
    edgeOffset: "",
    backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",
    onHide: () => {
      setIsDrawerOpen(false);
    },
  };

  useEffect(() => {
    if (!target.current) return;
    setDrawer(new Drawer(target.current, options));
  }, [target]);

  return (
    <>
      <div
        id="drawer-right-example"
        ref={target}
        className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800"
        tabIndex={-1}
        aria-labelledby="drawer-right-label"
      >
        {title && (
          <h5
            id="drawer-right-label"
            className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 me-2.5" />
            {title}
          </h5>
        )}
        <button
          type="button"
          onClick={closeSheet}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          <span className="sr-only">Close menu</span>
        </button>
        {children}
      </div>
    </>
  );
};

export default SideDrawer;
