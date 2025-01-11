import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, Menu } from "lucide-react";

export default function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <Menu /> <CircleUserRound />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>sign Up</DropdownMenuItem>
        <DropdownMenuItem>Log in</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
