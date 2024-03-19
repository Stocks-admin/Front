import React, { PropsWithChildren, useState } from "react";
import Sidebar from "../Sidebar";

const SidebarLayout = ({ children }: PropsWithChildren) => {
  const [collapsed, setSidebarCollapsed] = useState(true);
  return (
    // <div className="min-h-screen h-full px-2 py-3 bg-[#eaebef] flex flex-col">
    //   <div
    //     className={`grid flex-1 bg-white rounded-3xl ${
    //       collapsed ? "grid-cols-sidebar-collapsed" : "grid-cols-sidebar"
    //     } transition-[grid-template-columns] duration-300 ease-in-out`}
    //   >
    //     {/* sidebar */}
    //     <Sidebar collapsed={collapsed} setCollapsed={setSidebarCollapsed} />
    //     {/* content */}
    //     <div className="bg-white rounded-3xl shadow-xl">
    //         <div className="container mx-auto h-full">{props.children}</div>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen h-full pe-2">
      <div
        className={`grid gap-2 flex-1 rounded-3xl ${
          collapsed ? "grid-cols-sidebar-collapsed" : "grid-cols-sidebar"
        } transition-[grid-template-columns] duration-300 ease-in-out`}
      >
        {/* sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      {/* content */}
      <div className="p-4 sm:ml-40">
        <div className="container mx-auto h-full">{children}</div>
      </div>
    </div>
  );
};
export default SidebarLayout;
