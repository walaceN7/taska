import { cn } from "@/lib/utils";

interface TaskaLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function TaskaLogo({ className, iconOnly = false }: TaskaLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <rect
          x="10"
          y="15"
          width="35"
          height="25"
          rx="8"
          className="fill-primary"
        />

        <path
          d="M 10 45 H 45 V 85 C 45 89.4 41.4 93 37 93 H 18 C 13.6 93 10 89.4 10 85 V 45 Z"
          className="fill-primary"
        />

        <path
          d="M 55 15 H 77 C 84.1 15 90 20.9 90 28 V 30 C 90 41 81 50 70 50 H 55 V 15 Z"
          className="fill-primary"
        />

        <circle cx="75" cy="73" r="15" className="fill-primary" />
      </svg>

      {!iconOnly && (
        <span className="text-3xl font-extrabold tracking-tighter text-foreground">
          Task<span className="text-primary">a</span>
        </span>
      )}
    </div>
  );
}
