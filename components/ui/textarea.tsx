import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-base text-foreground shadow-none backdrop-blur-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-indigo-500/40 focus-visible:ring-2 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
