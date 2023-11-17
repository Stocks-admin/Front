import React, { PropsWithChildren, useState } from "react";
import Sidebar from "../Sidebar";

const SidebarLayout = (props: PropsWithChildren) => {
  const [collapsed, setSidebarCollapsed] = useState(true);
  return (
    <div className="min-h-screen px-2 py-3 bg-[#eaebef] flex flex-col">
      <div
        className={`grid flex-1 bg-white rounded-3xl ${
          collapsed ? "grid-cols-sidebar-collapsed" : "grid-cols-sidebar"
        } transition-[grid-template-columns] duration-300 ease-in-out`}
      >
        {/* sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setSidebarCollapsed} />
        {/* content */}
        <div className="bg-white rounded-3xl shadow-xl">
          <div className="container mx-auto h-full">{props.children}</div>
        </div>
      </div>
    </div>
  );
};
export default SidebarLayout;
