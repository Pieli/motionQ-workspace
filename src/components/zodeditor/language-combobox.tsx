"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { PropType } from "@/components/interfaces/compositions";

import { top250 as fonts } from "@/remotion-lib/popular-fonts";

export const FontCombobox: React.FC<{
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: PropType;
  readonly onChange: (compId: string, key: string, value: PropType) => void;
}> = ({ compId, fieldKey, value, onChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [val, setVal] = useState<PropType | undefined>("Inter");

  useEffect(() => {
    if (value !== val) {
      setVal(value);
    }
  }, [value, val, setVal]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {val || "Inter"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup>
              {fonts.map((font) => (
                <CommandItem
                  key={font.family}
                  value={font.family}
                  onSelect={(currentValue) => {
                    setVal(currentValue === val ? "" : currentValue);
                    onChange(compId, fieldKey, currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      val === font.family ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {font.family}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
