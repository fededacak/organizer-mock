"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "../../_components/section-card";
import { SectionHeader } from "../../_components/section-header";
import { Button } from "@/components/ui/button";

export function ConfirmationEmailCard() {
  const [replyToEmail, setReplyToEmail] = useState(false);

  return (
    <SectionCard>
      <SectionHeader
        title="Confirmation Email"
        description="Add custom info your attendees need to know — it'll be included in their confirmation email after checkout."
        actionLabel="Send Test Email"
        actionIcon={<Mail className="size-3.5" />}
      />
      <div className="flex flex-col gap-6 items-end w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-black">
              Reply-to email
            </span>
            <Switch checked={replyToEmail} onCheckedChange={setReplyToEmail} />
          </div>
          {/* Rich Text Editor Placeholder */}
          <div className="min-h-[120px] rounded-[16px] border p-3 text-sm text-gray transition-colors duration-200 ease focus-within:border-tp-blue">
            <textarea
              className="h-full w-full resize-none bg-transparent text-black outline-none placeholder:text-gray"
              placeholder="Write your confirmation email content..."
              rows={5}
            />
          </div>
        </div>
        <Button className="w-fit h-[42px] px-6" disabled>
          Save
        </Button>
      </div>
    </SectionCard>
  );
}
