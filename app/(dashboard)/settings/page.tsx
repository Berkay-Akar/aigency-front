"use client";

import { useState } from "react";
import { Bell, Shield, CreditCard, Webhook, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Webhook },
];

const INTEGRATIONS = [
  { id: "instagram", label: "Instagram", desc: "Auto-publish to your feed & stories", connected: true, color: "from-pink-600 to-orange-500" },
  { id: "tiktok", label: "TikTok", desc: "Schedule and publish videos & carousels", connected: true, color: "from-gray-800 to-gray-600" },
  { id: "facebook", label: "Facebook", desc: "Post to pages and groups", connected: false, color: "from-blue-700 to-blue-500" },
  { id: "twitter", label: "X / Twitter", desc: "Post tweets and threads", connected: false, color: "from-gray-900 to-gray-700" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/30">Manage your account and integrations</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <h3 className="text-sm font-semibold text-white">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">First name</label>
                    <Input defaultValue="Berkay" className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">Last name</label>
                    <Input defaultValue="Akar" className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">Email</label>
                  <Input defaultValue="berkay@aigencys.com" className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30" />
                </div>
                <Button
                  onClick={handleSave}
                  className={saved ? "bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl" : "bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"}
                >
                  {saved ? <><Check className="w-4 h-4 mr-2" />Saved!</> : "Save changes"}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-3">
              {INTEGRATIONS.map(({ id, label, desc, connected, color }) => (
                <div key={id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{label[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
                      <p className="text-xs text-white/30">{desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {connected && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                        Connected
                      </span>
                    )}
                    <button className={cn(
                      "px-4 py-2 rounded-xl text-xs font-medium transition-colors",
                      connected
                        ? "bg-white/[0.05] text-white/40 hover:text-white hover:bg-white/[0.08] border border-white/[0.07]"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    )}>
                      {connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "billing" && (
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white mb-4">Current Plan</h3>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                <div>
                  <p className="text-indigo-300 font-semibold text-lg">Growth Plan</p>
                  <p className="text-white/40 text-sm">$79/month · 2,000 credits</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-white/[0.07] border border-white/[0.1] text-white/60 hover:text-white text-sm transition-colors">
                  Upgrade
                </button>
              </div>
              <Separator className="bg-white/[0.06] mb-5" />
              <h3 className="text-sm font-semibold text-white mb-3">Credits</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">2,450 / 2,000 credits</span>
                <span className="text-xs text-indigo-400">+450 bonus</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full w-[122%] bg-indigo-500 rounded-full" style={{ width: "82%" }} />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-5">
              <h3 className="text-sm font-semibold text-white mb-2">Notification Preferences</h3>
              {[
                { label: "Post published successfully", desc: "When a scheduled post goes live" },
                { label: "Generation complete", desc: "When AI finishes generating your content" },
                { label: "Credits running low", desc: "When you have less than 100 credits" },
                { label: "Weekly report", desc: "Performance summary every Monday" },
              ].map(({ label, desc }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70 font-medium">{label}</p>
                    <p className="text-xs text-white/30">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                    <div className="w-9 h-5 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
