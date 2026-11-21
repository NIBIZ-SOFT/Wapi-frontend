/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { Label } from "@/src/elements/ui/label";
import { useTestConnectionMutation } from "@/src/redux/api/whatsappApi";
import { Send, Loader2, CheckCircle2, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { WabaPhoneNumber } from "@/src/types/whatsapp";

interface TestConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: WabaPhoneNumber | null;
}

export const TestConnectionModal = ({
  isOpen,
  onClose,
  phone,
}: TestConnectionModalProps) => {
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
        phone_number_id: phone?.phone_number_id,
        recipient_number: cleaned,
        message: message.trim() || undefined,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Test message delivered successfully!");
        setRecipientNumber("");
        setMessage("");
        onClose();
      } else {
        toast.error(res.message || "Failed to send test message");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || err?.message || "Failed to send test message");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white dark:bg-(--card-color)">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
                  <PhoneCall className="size-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Test WhatsApp Connection
                  </DialogTitle>
                  <p className="text-emerald-100 text-xs mt-1">
                    Send a test WhatsApp message to verify live API delivery
                  </p>
                </div>
              </div>

              {phone && (
                <div className="mt-4 p-2.5 bg-black/15 backdrop-blur-sm rounded-xl flex items-center justify-between text-xs">
                  <span className="text-emerald-100 font-medium">Sending From:</span>
                  <span className="font-semibold text-white">
                    {phone.verified_name} ({phone.display_phone_number})
                  </span>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="test_recipient" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Recipient WhatsApp Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="test_recipient"
                  type="text"
                  placeholder="e.g. +8801968402925"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 focus:ring-emerald-500"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="test_message" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Custom Message (Optional)
                </Label>
                <Textarea
                  id="test_message"
                  placeholder="Hello! This is a test message from our WhatsApp Cloud API."
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
                      Testing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      Send Test
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

export default TestConnectionModal;
