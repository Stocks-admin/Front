import React, { PropsWithChildren, useState } from "react";
import Sidebar from "../Sidebar";
import Notifications from "../notifications/Notifications";

const SidebarLayout = ({ children }: PropsWithChildren) => {
  const [collapsed, setSidebarCollapsed] = useState(true);
  return (
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
        <Notifications />
        <div className="container mx-auto h-full">{children}</div>
      </div>
    </div>
  );
};
export default SidebarLayout;
