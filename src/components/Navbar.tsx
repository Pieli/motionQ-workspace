import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-4 border-b m-0 text-secondary-foreground">
            <DropdownMenu>
                <DropdownMenuTrigger> 
                    <span className="text-xl font-bold">Imagine</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Projects</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Files</DropdownMenuItem>
                    <DropdownMenuItem>Exports</DropdownMenuItem>
                    <DropdownMenuItem>Recents</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger> 
                    <Avatar>
                        <AvatarFallback>PG</AvatarFallback>
                    </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
        </div>
    );
}

