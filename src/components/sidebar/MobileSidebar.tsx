import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { AlignRight } from "lucide-react";
import { SidebarAccordion } from "./SidebarAccordion";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="border-none outline-none" size="icon">
          <AlignRight className="h-6 w-6" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 bg-white px-0">
        <SheetTitle className="sr-only">Sidebar</SheetTitle>
        <SheetDescription className="sr-only text-muted-foreground">
          Sidebar
        </SheetDescription>
        <div className="flex h-full w-full flex-col justify-between px-4 py-6">
          <SidebarAccordion />
        </div>
      </SheetContent>
    </Sheet>
  );
}
