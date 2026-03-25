"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStudioStore } from "@/store/studio-store";
import { Step1Config } from "./step1-config";
import { Step2Config } from "./step2-config";
import { Step3Config } from "./step3-config";

const STEP_TITLE: Record<string, string> = {
  professionalize: "Profesyonel görsel",
  campaign: "Kampanya varyantları",
  video: "Video reklam",
};

export function ConfigPanel() {
  const activeStep = useStudioStore((s) => s.activeStep);
  const productName = useStudioStore((s) => s.productName);
  const brandName = useStudioStore((s) => s.brandName);
  const prompt = useStudioStore((s) => s.prompt);
  const setProductName = useStudioStore((s) => s.setProductName);
  const setBrandName = useStudioStore((s) => s.setBrandName);
  const setPrompt = useStudioStore((s) => s.setPrompt);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/[0.08] bg-[#080808]/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md md:p-8"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
            Yapılandırma
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">{STEP_TITLE[activeStep]}</h2>
          <p className="mt-1 text-sm text-white/35">
            Brief alanlarını doldurun; isteğe bağlı prompt ile ince ayar yapın.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Ürün adı
            </label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Örn. Aurora Serum"
              className="h-11 rounded-2xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Marka
            </label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Örn. NOVA Labs"
              className="h-11 rounded-2xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Ek not (isteğe bağlı)
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Örn. sıcak editorial ışık, yumuşak gölge, premium his…"
              className="rounded-2xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          {activeStep === "professionalize" && <Step1Config />}
          {activeStep === "campaign" && <Step2Config />}
          {activeStep === "video" && <Step3Config />}
        </div>
      </div>
    </motion.section>
  );
}
