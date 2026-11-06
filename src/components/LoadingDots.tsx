export default function LoadingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden="true">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot-bounce" style={{ animationDelay: "0s" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot-bounce" style={{ animationDelay: "0.15s" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot-bounce" style={{ animationDelay: "0.3s" }} />
    </span>
  );
}
