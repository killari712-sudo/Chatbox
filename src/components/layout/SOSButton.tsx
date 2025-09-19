"use client";

import { LifeBuoy, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SOSButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-transform"
          aria-label="Emergency Support"
        >
          <LifeBuoy className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glassmorphism sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Emergency Support</DialogTitle>
          <DialogDescription>
            If you are in a crisis, please reach out for help immediately. Here are some resources.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold">National Suicide Prevention Lifeline</p>
              <a href="tel:988" className="text-primary hover:underline">Dial 988</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold">Crisis Text Line</p>
              <p>Text HOME to <a href="sms:741741" className="text-primary hover:underline">741741</a></p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <p className="text-xs text-muted-foreground text-center w-full">You are not alone. Help is available.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
