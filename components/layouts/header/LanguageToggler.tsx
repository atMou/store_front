import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
} from "@/shared/ui";
import { EarthIcon } from "@/shared/ui/icons";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { useState } from "react";

function LanguageToggler() {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const changeLanguage = () => {
    // TODO: Implement language change
    console.log("Change language to:", selectedLang);
    setOpen(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group relative inline-flex items-center gap-1 cursor-pointer py-1  transition-colors duration-200">
            <span
              className="
            text-gray-500 
            relative
            after:content-[''] 
            after:block 
            after:h-0.5 
            after:bg-gray-500 
            after:w-0 
            after:absolute 
            after:left-0 
            after:-bottom-1 
            group-hover:after:w-full 
            after:transition-all 
            after:duration-300"
            >
              {selectedLang.toUpperCase()}
            </span>
            <EarthIcon />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" xClassName="size-6">
          <DialogHeader className="mt-6">
            <DialogTitle className="text-xl">
              Which language would you like to use?
            </DialogTitle>
          </DialogHeader>
          <RadioGroup
            className="mt-3 mb-3"
            defaultValue={selectedLang}
            onValueChange={setSelectedLang}
          >
            <div className="flex items-center gap-3 text-2xl  cursor-pointer">
              <RadioGroupItem value="en" id="en" />
              <Label className="text-base cursor-pointer" htmlFor="en">
                Englsh
              </Label>
            </div>
            <div className="flex items-center gap-3 text-2xl cursor-pointer">
              <RadioGroupItem value="de" id="de" />
              <Label className="text-base cursor-pointer" htmlFor="de">
                Deutsch
              </Label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="plain"
                className=" rounded-none text-black-900 border-2 border-collapse"
                type="submit"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="plain"
              className="bg-neutral-900 rounded-none text-accent-foreground"
              onClick={changeLanguage}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LanguageToggler;
