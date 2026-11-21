/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { Label } from "@/src/elements/ui/label";
import { useTestConnectionMutation } from "@/src/redux/api/whatsappApi";
import { MessageSquarePlus, Send, Loader2, Sparkles, Phone } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface StartNewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhoneNumberId?: string | null;
  onSuccess?: (contactId?: string) => void;
}

export const StartNewChatModal = ({
  isOpen,
  onClose,
  selectedPhoneNumberId,
  onSuccess,
}: StartNewChatModalProps) => {
  const [recipientNumber, setRecipientNumber] = useState("");
  const [message, setMessage] = useState("");
  const [testConnection, { isLoading }] = useTestConnectionMutation();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned = recipientNumber.replace(/[^\d+]/g, "").trim();
    if (!cleaned) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const res = await testConnection({
        phone_number_id: selectedPhoneNumberId || undefined,
        recipient_number: cleaned,
        message: message.trim() || undefined,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        setRecipientNumber("");
        setMessage("");
        onClose();
        if (onSuccess && res.data?.contact_id) {
          onSuccess(res.data.contact_id);
        }
      } else {
        toast.error(res.message || "Failed to send message");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || err?.message || "Failed to send message");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white dark:bg-(--card-color)">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
                  <MessageSquarePlus className="size-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Start New Chat
                  </DialogTitle>
                  <p className="text-emerald-100 text-xs mt-1">
                    Send the first WhatsApp message to initiate a conversation
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="recipient_phone" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-emerald-500" />
                  Recipient Phone Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="recipient_phone"
                  type="text"
                  placeholder="e.g. +8801968402925 or 01968402925"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 focus:ring-emerald-500"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-slate-400">
                  Include country code (e.g. +880 for Bangladesh)
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="first_message" className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-emerald-500" />
                  Message
                </Label>
                <Textarea
                  id="first_message"
                  placeholder="Hello! Welcome to our service. How can we help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="rounded-xl border-slate-200 dark:border-slate-800 focus:ring-emerald-500 resize-none text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !recipientNumber.trim()}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md shadow-emerald-600/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default StartNewChatModal;
