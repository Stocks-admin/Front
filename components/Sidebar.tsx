import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faHome,
  faWallet,
  faArrowRightArrowLeft,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./Layout/assets/Iso logo.png";
import iso from "./Layout/assets/Iso.png";
import useLogout from "@/hooks/useLogout";

interface IProps {
  collapsed: boolean;
  setCollapsed(collapsed: boolean): void;
}

const Sidebar = ({ collapsed, setCollapsed }: IProps) => {
  const logout = useLogout();

  // 👇 use the correct icon depending on the state.
  const icon = collapsed ? faChevronRight : faChevronLeft;
  return (
    <aside
      className={`bg-white text-[#656565] rounded-lg font-poppins fixed top-0 left-0 z-40 h-screen transition-all -translate-x-full sm:translate-x-0 ${
        collapsed ? "w-20" : "w-40"
      }`}
    >
      <div className={"flex flex-col h-full"}>
        {/* logo and collapse button */}
        <div
          className={`flex items-center border-b border-b-indigo-800 ${
            collapsed ? "p-4 justify-center" : "py-4 justify-center px-3"
          }`}
        >
          <Link href="/">
            {collapsed ? (
              <Image src={iso.src} alt="Butter_logo" width={64} height={64} />
            ) : (
              <Image
                src={logo.src}
                alt="Butter_logo_full"
                width={150}
                height={64}
              />
            )}
          </Link>
        </div>
        {/* Menu Items */}
        <div className="flex-1">
          <div
            className={`flex items-center ${
              collapsed ? "p-4 justify-center" : "py-4 justify-start px-3"
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-2" />
            {!collapsed && <span className="whitespace-nowrap">Home</span>}
          </div>
          <div
            className={`flex items-center ${
              collapsed ? "p-4 justify-center" : "py-4 justify-start px-3"
            }`}
          >
            <Link href="/wallet" className="whitespace-nowrap">
              <FontAwesomeIcon icon={faWallet} className="w-5 h-5 mr-2" />
              {!collapsed && "Wallet"}
            </Link>
          </div>
          <div
            className={`flex items-center ${
              collapsed ? "p-4 justify-center" : "py-4 justify-start px-3"
            }`}
          >
            <Link href="/transactions" className="whitespace-nowrap">
              <FontAwesomeIcon
                icon={faArrowRightArrowLeft}
                className="w-5 h-5 mr-2"
              />
              {!collapsed && "Transactions"}
            </Link>
          </div>
        </div>
        {/* Bottom collapse button */}
        <div className="mb-5">
          <button
            className="flex items-center w-full font-semibold gap-2 px-3"
            style={{
              marginLeft: collapsed ? "auto" : "",
              marginRight: collapsed ? "auto" : "",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onClick={() => logout(true)}
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              color="red"
              size="xl"
            />
            {!collapsed && "Logout"}
          </button>
        </div>
        <div
          className={`self-bottom flex ${
            collapsed ? "justify-center" : "justify-end"
          }`}
        >
          <button
            className={
              "grid place-content-center hover:bg-indigo-800 w-10 h-10 rounded-full" // shape
            }
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon icon={icon} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
