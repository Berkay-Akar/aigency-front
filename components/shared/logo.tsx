import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex-shrink-0 w-8 h-8">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 glow-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 2L14.196 5.25V11.75L9 15L3.804 11.75V5.25L9 2Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 6L11.598 7.5V10.5L9 12L6.402 10.5V7.5L9 6Z"
              fill="white"
              fillOpacity="0.8"
            />
          </svg>
        </div>
      </div>
      {!collapsed && (
        <span className="font-semibold text-[15px] tracking-tight text-white">
          Aigencys
        </span>
      )}
    </div>
  );
}
