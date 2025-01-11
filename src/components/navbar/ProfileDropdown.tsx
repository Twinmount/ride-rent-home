import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, Menu, User } from "lucide-react";

export default function ProfileDropdown({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none outline-none ring-0 focus:outline-none focus:ring-0">
        {isMobile ? (
          <div className="flex-center w-fit flex-col gap-y-1">
            <User />
            <span className="text-xs text-gray-600">account </span>
          </div>
        ) : (
          <div className="flex-center gap-x-1 rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200">
            <Menu width={16} /> <CircleUserRound />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl bg-white data-[side=bottom]:right-4">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-300" />
        <DropdownMenuItem className="!hover:bg-slate-100 cursor-pointer">
          sign Up
        </DropdownMenuItem>
        <DropdownMenuItem className="!hover:bg-slate-100 cursor-pointer">
          Log in
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
