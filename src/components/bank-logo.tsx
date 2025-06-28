import { getBankById } from "@/utils/banks";

interface BankLogoProps {
  bankId?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export function BankLogo({ 
  bankId, 
  size = "md", 
  className = "",
  fallbackIcon 
}: BankLogoProps) {
  const bank = bankId ? getBankById(bankId) : null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  if (!bank) {
    return fallbackIcon ? (
      <div className={`${sizeClasses[size]} ${className}`}>
        {fallbackIcon}
      </div>
    ) : null;
  }

  return (
    <img
      src={bank.logo}
      alt={bank.name}
      loading="lazy"
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        if (fallbackIcon) {
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }
      }}
    />
  );
} 