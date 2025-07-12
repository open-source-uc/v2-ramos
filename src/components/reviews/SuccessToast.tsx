import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SuccessToastProps {
  successMessage?: string;
}

export function SuccessToast({ successMessage }: SuccessToastProps) {
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!successMessage || hasShown) return;

    // Small delay to ensure the toaster is ready
    const timer = setTimeout(() => {
      toast.success(successMessage);
      setHasShown(true);
      
      // Clean up URL parameters after showing toast
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.toString());
    }, 100);

    return () => clearTimeout(timer);
  }, [successMessage, hasShown]);

  return null;
}