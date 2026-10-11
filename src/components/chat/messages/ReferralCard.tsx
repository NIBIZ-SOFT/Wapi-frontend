/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReferralData } from "@/src/types/components/chat";
import { ExternalLink, Megaphone, Share2, Image as ImageIcon, Video } from "lucide-react";
import React, { useState } from "react";
import Images from "@/src/shared/Image";

interface ReferralCardProps {
  referral: ReferralData;
}

export const getReferralData = (message: any): ReferralData | null => {
  if (!message) return null;
  const ref = message.referral || message.metadata?.referral || message.metadata?.context?.referral;
  if (ref && (ref.headline || ref.body || ref.source_url || ref.image_url || ref.thumbnail_url || ref.source_id)) {
    return ref;
  }
  return null;
};

const ReferralCard: React.FC<ReferralCardProps> = ({ referral }) => {
  const [imageError, setImageError] = useState(false);
  const isAd = referral.source_type === "ad" || (!referral.source_type && referral.ctwa_clid);
  const mediaUrl = referral.image_url || referral.thumbnail_url;
  const isVideo = referral.media_type === "video" || !!referral.video_url;

  return (
    <div className="mb-2.5 max-w-[340px] rounded-lg overflow-hidden border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/25 dark:border-emerald-500/30 text-left transition-all shadow-xs">
      {/* Header Tag */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/15 border-b border-emerald-500/20 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-1.5">
          {isAd ? (
            <Megaphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold tracking-wide">
            {isAd ? "Click to WhatsApp Ad" : "Post Referral"}
          </span>
        </div>
        {referral.source_id && (
          <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-mono truncate max-w-[110px]" title={`ID: ${referral.source_id}`}>
            ID: {referral.source_id}
          </span>
        )}
      </div>

      {/* Media Preview (Image or Video thumbnail) */}
      {mediaUrl && !imageError && (
        <div className="relative w-full max-h-44 overflow-hidden bg-slate-900/10 dark:bg-black/20">
          <Images
            src={mediaUrl}
            alt={referral.headline || "Ad Media"}
            width={340}
            height={190}
            className="w-full h-auto max-h-44 object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            unoptimized
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                <Video className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="p-2.5 space-y-1">
        {referral.headline && (
          <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
            {referral.headline}
          </h4>
        )}

        {referral.body && (
          <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed break-words line-clamp-3">
            {referral.body}
          </p>
        )}

        {/* Source Link */}
        {referral.source_url && (
          <div className="pt-1.5 flex items-center justify-between">
            <a
              href={referral.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors"
            >
              <span>{isAd ? "View Ad on Meta" : "View Post"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {referral.media_type && !mediaUrl && (
              <span className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> {referral.media_type}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCard;
