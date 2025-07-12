import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SuccessToastProps {
  successMessage?: string;
}

export function SuccessToast({ successMessage }: SuccessToastProps) {
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check for both success and error messages in URL parameters
    const url = new URL(window.location.href);
    const urlSuccessMessage = url.searchParams.get('success');
    const urlErrorMessage = url.searchParams.get('error');
    
    const messageToShow = successMessage || urlSuccessMessage;
    const errorToShow = urlErrorMessage;

    if (hasShown || (!messageToShow && !errorToShow)) return;

    // Small delay to ensure the toaster is ready
    const timer = setTimeout(() => {
      if (errorToShow) {
        toast.error(decodeURIComponent(errorToShow));
        setHasShown(true);
        // Clean up error parameter
        url.searchParams.delete('error');
        window.history.replaceState({}, '', url.toString());
      } else if (messageToShow) {
        toast.success(decodeURIComponent(messageToShow));
        setHasShown(true);
        // Clean up success parameter
        url.searchParams.delete('success');
        window.history.replaceState({}, '', url.toString());
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [successMessage, hasShown]);

  return null;
}