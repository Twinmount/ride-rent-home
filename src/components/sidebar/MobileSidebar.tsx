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
import RideRentNavbarLogo from "../common/RideRentNavbarLogo";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    country,
    state,
    category = "cars",
  } = useParams<{
    country: string;
    state: string;
    category: string;
  }>();

  const stateValue = state ? state : country === "in" ? "bangalore" : "dubai";

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-fit border-none outline-none" size="icon">
          <AlignRight className="h-6 w-6" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 bg-white px-0">
        <SheetTitle className="sr-only">Sidebar</SheetTitle>
        <SheetDescription className="text-lightGray-foreground sr-only">
          Sidebar
        </SheetDescription>
        <div className="relative flex h-full w-full flex-col justify-start px-4 py-6">
          <RideRentNavbarLogo
            country={country}
            state={stateValue}
            category={category}
          />
          {/* sidebar accordions */}
          <SidebarAccordion onLinkClick={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}