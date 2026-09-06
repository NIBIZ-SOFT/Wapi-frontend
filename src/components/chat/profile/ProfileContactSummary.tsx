/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { ProfileContactSummaryProps } from "@/src/types/components/chat";
import { getInitials } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { Phone, Trash2 } from "lucide-react";
import Image from "next/image";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import ProfileChatLabel from "./ProfileChatLabel";
import PlanFeature from "@/src/shared/PlanFeature";

const ProfileContactSummary = ({ profileData, onDelete, onOpenTagModal, onRemoveLabel }: ProfileContactSummaryProps) => {
  const { isCustom } = useChatTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { app_name, is_demo_mode, userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const isAgent = user?.role === "agent";
  const contactName = profileData?.contact?.name;
  const rawPhoneNumber = profileData?.contact?.phone_number || profileData?.contact?.actual_phone_number;
  const phoneNumber = rawPhoneNumber && rawPhoneNumber !== contactName ? rawPhoneNumber : (!contactName ? rawPhoneNumber : "");

  const cleanPhone = (rawPhoneNumber || "").replace(/[^0-9+]/g, "");
  const telHref = cleanPhone.startsWith("+")
    ? `tel:${cleanPhone}`
    : cleanPhone.startsWith("0")
    ? `tel:${cleanPhone}`
    : `tel:+${cleanPhone}`;

  const isDistinctName = Boolean(
    contactName &&
    rawPhoneNumber &&
    contactName.trim() !== "" &&
    contactName.replace(/[^0-9]/g, "") !== rawPhoneNumber.replace(/[^0-9]/g, "")
  );

  const showPhoneBadge = cleanPhone && !user?.is_phoneno_hide && (isDistinctName || Boolean(profileData?.contact?.whatsapp_bsuid));

  return (
    <div className="relative border-b dark:bg-(--table-hover)! dark:border-none border-gray-100 dark:border-(--card-border-color) p-5 mb-0 flex items-center justify-center flex-col" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 95%)" } : {}}>
      <div className="h-12 w-12 shrink-0 mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden" style={isCustom ? { backgroundColor: userSettingData?.bg_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : { backgroundColor: userSettingData?.bg_color == "null" ? "var(--primary)" : "var(--primary)" }}>
        {profileData?.contact?.avatar ? <Image src={profileData?.contact?.avatar} alt={profileData?.contact?.name} width={64} height={64} className="object-cover" unoptimized /> : getInitials(app_name || "W")}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white truncate">
        {isAgent && user?.is_phoneno_hide ? "Customer" : (contactName || maskSensitiveData(rawPhoneNumber, "phone", is_demo_mode))}
      </h3>
      {profileData?.contact?.whatsapp_username && (
        <span className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">
          @{profileData.contact.whatsapp_username}
        </span>
      )}
      <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs text-slate-500 dark:text-gray-400 mt-1">
        {profileData?.contact?.whatsapp_bsuid && (
          <span className="bg-slate-100 dark:bg-(--dark-body) px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200 dark:border-(--card-border-color)">
            ID: {profileData.contact.whatsapp_bsuid}
          </span>
        )}
        {showPhoneBadge && (
          <a
            href={telHref}
            className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30 px-2 py-0.5 rounded text-[11px] transition-colors"
            title={`Call ${rawPhoneNumber}`}
          >
            <Phone size={11} className="shrink-0" />
            <span>{maskSensitiveData(rawPhoneNumber, "phone", is_demo_mode)}</span>
          </a>
        )}
      </div>
      <p className="text-sm text-slate-500 dark:text-gray-500 truncate mt-0.5">{profileData?.contact?.status}</p>
      {!isAgent && (
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-50 dark:bg-red-900/20 dark:hover:bg-rose-500/10 rounded-lg" onClick={onDelete}>
          <Trash2 size={20} />
        </Button>
      )}
      <PlanFeature feature="tags">
        <ProfileChatLabel labels={profileData?.tags?.map((t: any) => ({ id: t._id, name: t.label, color: t.color })) || []} onOpenModal={onOpenTagModal} onRemoveLabel={onRemoveLabel} />
      </PlanFeature>
    </div>
  );
};

export default ProfileContactSummary;
