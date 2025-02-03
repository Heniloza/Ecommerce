import { adminSideBarMenu } from "@/config";
import { ChartNoAxesCombined } from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSideBarMenu.map((menuItem) => {
        const IconComponent = menuItem.icons;
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ?  setOpen(false) : null;
            }}
            className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground hover:bg-gray-200 text-lg font-bold"
          >
            <IconComponent className="w-5 h-5" /> <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="felx flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 py-2">
                <ChartNoAxesCombined size={30} />
                <span className="text-2xl font-extrabold ">Admin Panel </span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold hover:text-gray-500">
            Admin panel
          </h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}
export default Sidebar;
