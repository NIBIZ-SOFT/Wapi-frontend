"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { Switch } from "@/src/elements/ui/switch";
import { useGetAllModelsQuery } from "@/src/redux/api/settingsApi";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppSelector } from "@/src/redux/hooks";
import { ChatbotFormModalProps } from "@/src/types/replyMaterial";
import { AIModel } from "@/src/types/settings";
import { Bot, Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const ChatbotFormModal = ({ isOpen, onClose, onSubmit, isLoading, editItem, wabaId }: ChatbotFormModalProps) => {
  const [name, setName] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "friendly" | "humorous" | "empathetic" | "direct">("professional");
  const [messageLimit, setMessageLimit] = useState<number>(0);
  const [enableGoogleMeet, setEnableGoogleMeet] = useState<boolean>(false);
  const [enableHumanHandoff, setEnableHumanHandoff] = useState<boolean>(false);
  const [handoffKeywords, setHandoffKeywords] = useState<string[]>([]);
  const [handoffMessage, setHandoffMessage] = useState<string>("I'm connecting you with a human agent now. Someone will be with you shortly.");
  const [keywordInput, setKeywordInput] = useState("");

  // Chatbot Category & Custom API settings
  const [category, setCategory] = useState<"ecommerce" | "customer_support" | "erp_crm" | "custom_api">("customer_support");
  const [customApiBaseUrl, setCustomApiBaseUrl] = useState("");
  const [customLookupEndpoint, setCustomLookupEndpoint] = useState("");
  const [customActionEndpoint, setCustomActionEndpoint] = useState("");
  const [customActionName, setCustomActionName] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  // Dynamic Ecommerce Store settings
  const [enableEcommerce, setEnableEcommerce] = useState<boolean>(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [orderTrackUrl, setOrderTrackUrl] = useState("");
  const [supportHotline, setSupportHotline] = useState("");
  const [productSearchPath, setProductSearchPath] = useState("");
  const [productDetailPath, setProductDetailPath] = useState("");
  const [orderCheckoutPath, setOrderCheckoutPath] = useState("");
  const [currency, setCurrency] = useState("৳");
  const [shippingInside, setShippingInside] = useState<number>(80);
  const [shippingOutside, setShippingOutside] = useState<number>(120);
  const [storeRules, setStoreRules] = useState("");

  const selectedWorkspace = useAppSelector((state: any) => state.workspace?.selectedWorkspace);
  const [workspaceId, setWorkspaceId] = useState<string>("");

  const { data: workspacesData } = useGetWorkspacesQuery(undefined, { skip: !isOpen });
  const workspaces = workspacesData?.data || [];

  const { data: modelsData, isLoading: loadingModels } = useGetAllModelsQuery();
  const models = modelsData?.data?.models || [];

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editItem?.name ?? "");
      const editWsId = (editItem as any)?.workspace_id;
      setWorkspaceId(editWsId && typeof editWsId === "object" ? editWsId._id : editWsId || selectedWorkspace?._id || "");
      const editAiModel = editItem?.ai_model;
      setAiModel(editAiModel && typeof editAiModel === "object" ? editAiModel._id : editAiModel ?? "");
      setApiKey(editItem?.api_key ?? "");
      setBusinessName(editItem?.business_name ?? "");
      setBusinessDescription(editItem?.business_description ?? "");
      setTone(editItem?.tone ?? "professional");
      setMessageLimit(editItem?.message_limit ?? 0);
      setEnableGoogleMeet(editItem?.enable_google_meet ?? false);
      setEnableHumanHandoff(editItem?.enable_human_handoff ?? false);
      setHandoffKeywords(editItem?.handoff_keywords ?? []);
      setHandoffMessage(editItem?.handoff_message ?? "I'm connecting you with a human agent now. Someone will be with you shortly.");
      setKeywordInput("");

      setCategory(editItem?.category ?? (editItem?.ecommerce?.enabled ? "ecommerce" : "customer_support"));
      setCustomApiBaseUrl(editItem?.custom_api?.api_base_url ?? "");
      setCustomLookupEndpoint(editItem?.custom_api?.lookup_endpoint ?? "");
      setCustomActionEndpoint(editItem?.custom_api?.action_endpoint ?? "");
      setCustomActionName(editItem?.custom_api?.action_name ?? "");
      setCustomInstructions(editItem?.custom_api?.instructions ?? "");

      setEnableEcommerce(Boolean(editItem?.ecommerce?.enabled || editItem?.category === "ecommerce"));
      setStoreUrl(editItem?.ecommerce?.store_url ?? "");
      setApiBaseUrl(editItem?.ecommerce?.api_base_url ?? "");
      setImageBaseUrl(editItem?.ecommerce?.image_base_url ?? "");
      setStoreRules(editItem?.ecommerce?.store_rules ?? "");
      setProductSearchPath(editItem?.ecommerce?.product_search_path ?? "");
      setProductDetailPath(editItem?.ecommerce?.product_detail_path ?? "");
      setOrderCheckoutPath(editItem?.ecommerce?.order_checkout_path ?? "");
      setOrderTrackUrl(editItem?.ecommerce?.order_track_url ?? "");
      setSupportHotline(editItem?.ecommerce?.support_hotline ?? "");
      setCurrency(editItem?.ecommerce?.currency ?? "৳");
      setShippingInside(editItem?.ecommerce?.shipping_inside_dhaka ?? 80);
      setShippingOutside(editItem?.ecommerce?.shipping_outside_dhaka ?? 120);
    }
  }, [isOpen, editItem, selectedWorkspace?._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !aiModel || !apiKey) return;

    const payload = {
      waba_id: wabaId,
      workspace_id: workspaceId || selectedWorkspace?._id,
      name: name.trim(),
      ai_model: aiModel,
      api_key: apiKey.trim(),
      business_name: businessName.trim(),
      business_description: businessDescription.trim(),
      tone,
      category,
      message_limit: messageLimit,
      enable_google_meet: enableGoogleMeet,
      enable_human_handoff: enableHumanHandoff,
      handoff_keywords: enableHumanHandoff ? handoffKeywords : [],
      handoff_message: enableHumanHandoff ? handoffMessage.trim() : "",
      custom_api: {
        enabled: category === "custom_api" || category === "erp_crm",
        api_base_url: customApiBaseUrl.trim(),
        lookup_endpoint: customLookupEndpoint.trim(),
        action_endpoint: customActionEndpoint.trim(),
        action_name: customActionName.trim(),
        instructions: customInstructions.trim()
      },
      ecommerce: {
        enabled: category === "ecommerce" || enableEcommerce,
        store_url: storeUrl.trim(),
        api_base_url: apiBaseUrl.trim(),
        image_base_url: imageBaseUrl.trim(),
        store_rules: storeRules.trim(),
        product_search_path: productSearchPath.trim(),
        product_detail_path: productDetailPath.trim(),
        order_checkout_path: orderCheckoutPath.trim(),
        order_track_url: orderTrackUrl.trim(),
        support_hotline: supportHotline.trim(),
        shipping_inside_dhaka: Number(shippingInside) || 0,
        shipping_outside_dhaka: Number(shippingOutside) || 0,
        currency: currency.trim() || "৳",
        payment_methods: ["Cash on Delivery"]
      }
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="sm:max-w-lg p-0! overflow-hidden gap-0 border-none bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="px-4 pt-6 sm:px-6 sm:pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Bot size={20} />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">{editItem ? "Edit Chatbot" : "Create Chatbot"}</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-medium">{editItem ? "Update your chatbot configuration" : "Configure your new AI chatbot assistant"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="sm:p-6 p-4 pt-3 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Chatbot Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sales Assistant" required disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Workspace</Label>
              <Select value={workspaceId} onValueChange={setWorkspaceId} disabled={isLoading}>
                <SelectTrigger className="h-11 py-5 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)">
                  <SelectValue placeholder="Select Workspace" />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-100 dark:border-(--card-border-color)">
                  {workspaces.map((ws: any) => (
                    <SelectItem key={ws._id} value={ws._id} className="rounded-lg">
                      {ws.name} {ws._id === selectedWorkspace?._id ? "(Current)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Chatbot Category & Business Mode</Label>
              <Select value={category} onValueChange={(val: any) => {
                setCategory(val);
                if (val === "ecommerce") {
                  setEnableEcommerce(true);
                }
              }} disabled={isLoading}>
                <SelectTrigger className="h-11 py-5 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-100 dark:border-(--card-border-color)">
                  <SelectItem value="ecommerce" className="rounded-lg">🛍️ E-Commerce Store (Live Products, Search & Automated Order)</SelectItem>
                  <SelectItem value="customer_support" className="rounded-lg">💬 Customer Support & FAQ (Knowledge Assistant)</SelectItem>
                  <SelectItem value="erp_crm" className="rounded-lg">🏢 ERP & CRM System (Live Lookup & Operations)</SelectItem>
                  <SelectItem value="custom_api" className="rounded-lg">⚡ Custom API / External System (Dynamic Endpoints)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">AI Model</Label>
              <Select value={aiModel} onValueChange={setAiModel} disabled={isLoading || loadingModels}>
                <SelectTrigger className="h-11 py-5 rounded-lg border-slate-200 dark:border-(--card-border-color)  dark:border-none bg-slate-50 dark:bg-(--dark-body)">
                  <SelectValue placeholder={loadingModels ? "Loading models..." : "Select Model"} />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-100 dark:border-(--card-border-color)">
                  {models.map((model: AIModel) => (
                    <SelectItem key={model._id} value={model._id} className="rounded-lg">
                      {model.display_name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">API Key</Label>
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Sk-..." type="password" required disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your Business Name" disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Business Description</Label>
              <Textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="Describe what your business does..." disabled={isLoading} className="custom-scrollbar min-h-18 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) resize-none" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">Tone</Label>
              <Select value={tone} onValueChange={(val: any) => setTone(val)} disabled={isLoading}>
                <SelectTrigger className="h-11 py-5 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)">
                  <SelectValue placeholder="Select Tone" />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-100 dark:border-(--card-border-color)">
                  <SelectItem value="professional" className="rounded-lg">Professional</SelectItem>
                  <SelectItem value="casual" className="rounded-lg">Casual</SelectItem>
                  <SelectItem value="friendly" className="rounded-lg">Friendly</SelectItem>
                  <SelectItem value="humorous" className="rounded-lg">Humorous</SelectItem>
                  <SelectItem value="empathetic" className="rounded-lg">Empathetic</SelectItem>
                  <SelectItem value="direct" className="rounded-lg">Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">Message Limit (0 = Unlimited)</Label>
              <Input
                type="number"
                min={0}
                value={messageLimit}
                onChange={(e) => setMessageLimit(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLoading}
                className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
              />
            </div>

            <div className="flex col-span-2 gap-2">
              <div className="flex-1 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-slate-800 dark:text-white">Enable Google Meet</span>
                  <span className="text-xs text-slate-400">Generate and attach Google Meet links in the conversation</span>
                </div>
                <Switch checked={enableGoogleMeet} onCheckedChange={setEnableGoogleMeet} disabled={isLoading} />
              </div>

              <div className="flex-1 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-slate-800 dark:text-white">Enable Human Handoff</span>
                  <span className="text-xs text-slate-400">Transfer chat to human agents based on keywords</span>
                </div>
                <Switch checked={enableHumanHandoff} onCheckedChange={setEnableHumanHandoff} disabled={isLoading} />
              </div>
            </div>

            {enableHumanHandoff && (
              <div className="col-span-2 p-4 bg-slate-50/50 dark:bg-(--dark-body)/30 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-400">Handoff Trigger Keywords</Label>
                  <div className="min-h-11 p-2 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) flex flex-wrap gap-2 items-center">
                    {handoffKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center px-2.5 py-1 rounded bg-primary text-white text-xs font-semibold"
                      >
                        {kw}
                        <Button variant="unstyled"
                          type="button"
                          onClick={() => setHandoffKeywords((prev) => prev.filter((k) => k !== kw))}
                          disabled={isLoading}
                          className="ml-1.5 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </Button>
                      </span>
                    ))}
                    <Input
                      type="text"
                      placeholder={handoffKeywords.length === 0 ? "Type keyword & press Enter..." : "Add keyword..."}
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const val = keywordInput.trim();
                          if (val && !handoffKeywords.includes(val)) {
                            setHandoffKeywords((p) => [...p, val]);
                            setKeywordInput("");
                          }
                        }
                      }}
                      disabled={isLoading}
                      className="flex-1 min-w-[120px] h-7 border-none bg-transparent shadow-none focus-visible:ring-0 px-1 text-sm dark:text-white"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block">Press Enter or comma to add a keyword.</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-400">Handoff Message</Label>
                  <Input
                    value={handoffMessage}
                    onChange={(e) => setHandoffMessage(e.target.value)}
                    placeholder="e.g. Connecting you to a live agent..."
                    disabled={isLoading}
                    className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
                  />
                </div>
              </div>
            )}

            {/* Dynamic eCommerce Integration Section */}
            {(category === "ecommerce" || enableEcommerce) && (
              <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-(--card-border-color)">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">🛍️ eCommerce Store Integration</Label>
                    <p className="text-xs text-slate-400">Live product catalog lookup, real-time stock check and automatic checkout</p>
                  </div>
                  <Switch checked={enableEcommerce} onCheckedChange={setEnableEcommerce} disabled={isLoading} />
                </div>

                {enableEcommerce && (
                  <div className="mt-3 space-y-3 bg-slate-50 dark:bg-(--dark-body) p-3.5 rounded-xl border border-slate-200 dark:border-(--card-border-color)">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Store Website URL</Label>
                        <Input
                          value={storeUrl}
                          onChange={(e) => setStoreUrl(e.target.value)}
                          placeholder="https://example.com"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Store Backend API Base URL</Label>
                        <Input
                          value={apiBaseUrl}
                          onChange={(e) => setApiBaseUrl(e.target.value)}
                          placeholder="https://backend.example.com"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Product Image Base URL (Optional)</Label>
                        <Input
                          value={imageBaseUrl}
                          onChange={(e) => setImageBaseUrl(e.target.value)}
                          placeholder="e.g. https://backend.example.com or CDN"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Product Search Endpoint</Label>
                        <Input
                          value={productSearchPath}
                          onChange={(e) => setProductSearchPath(e.target.value)}
                          placeholder="/api/products"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Product Detail Endpoint</Label>
                        <Input
                          value={productDetailPath}
                          onChange={(e) => setProductDetailPath(e.target.value)}
                          placeholder="/api/v2/products"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Checkout Endpoint</Label>
                        <Input
                          value={orderCheckoutPath}
                          onChange={(e) => setOrderCheckoutPath(e.target.value)}
                          placeholder="/api/v1/order/checkout"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Currency Symbol</Label>
                        <Input
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          placeholder="৳ or $ or ₹"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Inside Delivery Charge</Label>
                        <Input
                          type="number"
                          value={shippingInside}
                          onChange={(e) => setShippingInside(Number(e.target.value))}
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Outside Delivery Charge</Label>
                        <Input
                          type="number"
                          value={shippingOutside}
                          onChange={(e) => setShippingOutside(Number(e.target.value))}
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Order Track URL (optional)</Label>
                        <Input
                          value={orderTrackUrl}
                          onChange={(e) => setOrderTrackUrl(e.target.value)}
                          placeholder="https://example.com/track-order"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-500">Support Hotline (optional)</Label>
                        <Input
                          value={supportHotline}
                          onChange={(e) => setSupportHotline(e.target.value)}
                          placeholder="01410-000000"
                          disabled={isLoading}
                          className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-500">Custom Store Rules & Prompt Instructions (Optional)</Label>
                      <Textarea
                        value={storeRules}
                        onChange={(e) => setStoreRules(e.target.value)}
                        placeholder="e.g. Always address customers respectfully as 'Sir'. Free delivery on orders over ৳2000. Return policy is 7 days. Do not offer extra discounts."
                        disabled={isLoading}
                        rows={3}
                        className="text-xs rounded-md bg-white dark:bg-(--card-color)"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ERP / CRM / Custom API Integration Section */}
            {(category === "erp_crm" || category === "custom_api") && (
              <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-(--card-border-color)">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {category === "erp_crm" ? "🏢 ERP & CRM System Connection" : "⚡ Custom API Integration"}
                    </Label>
                    <p className="text-xs text-slate-400">Configure your system endpoints and API parameters for dynamic bot actions</p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 dark:bg-(--dark-body) p-3.5 rounded-xl border border-slate-200 dark:border-(--card-border-color)">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-500">System API Base URL</Label>
                      <Input
                        value={customApiBaseUrl}
                        onChange={(e) => setCustomApiBaseUrl(e.target.value)}
                        placeholder="https://api.yourcompany.com"
                        disabled={isLoading}
                        className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-500">Action Name (optional)</Label>
                      <Input
                        value={customActionName}
                        onChange={(e) => setCustomActionName(e.target.value)}
                        placeholder="e.g. create_ticket or submit_lead"
                        disabled={isLoading}
                        className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-500">Live Lookup / Search Endpoint</Label>
                      <Input
                        value={customLookupEndpoint}
                        onChange={(e) => setCustomLookupEndpoint(e.target.value)}
                        placeholder="/api/v1/search"
                        disabled={isLoading}
                        className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-slate-500">Action / Submit Endpoint</Label>
                      <Input
                        value={customActionEndpoint}
                        onChange={(e) => setCustomActionEndpoint(e.target.value)}
                        placeholder="/api/v1/submit"
                        disabled={isLoading}
                        className="h-9 text-xs rounded-md bg-white dark:bg-(--card-color)"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500">AI Prompt & Integration Instructions</Label>
                    <Textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="e.g. When customer asks for status, query the endpoint with their phone or tracking number. If customer wants to book a service, collect Name, Email, Model, and Date..."
                      disabled={isLoading}
                      className="text-xs min-h-16 rounded-md bg-white dark:bg-(--card-color) resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Customer Support Information Callout */}
            {category === "customer_support" && (
              <div className="col-span-2 p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  💬 <strong>Customer Support Mode</strong>: The bot uses your Business Name, Description, Tone, and Response Resources to answer customer queries with intelligent conversational assistance.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 h-11 rounded-lg border-slate-200 hover:bg-primary hover:text-white dark:border-(--card-border-color) text-slate-600 dark:text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !aiModel || !apiKey} className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : editItem ? (
                "Save Changes"
              ) : (
                "Create Chatbot"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotFormModal;
