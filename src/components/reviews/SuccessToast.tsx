import { useEffect } from "react";
import { toast } from "sonner";

interface SuccessToastProps {
  successMessage?: string;
}

export function SuccessToast({ successMessage }: SuccessToastProps) {
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      
      // Clean up URL parameters after showing toast
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.toString());
    }
  }, [successMessage]);

  return null;
}