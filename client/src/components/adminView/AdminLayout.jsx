import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* Admin sidebar */}
      <Sidebar open={open} setOpen={setOpen}/>
      <div className="flex flex-1 flex-col">
        {/* Admin Heade */}
        <Header setOpen={setOpen}/>
        <main className="flex-1 flex flex-col bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
