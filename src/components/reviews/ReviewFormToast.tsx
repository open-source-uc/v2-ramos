import { useEffect } from "react";
import { toast } from "sonner";

interface ReviewFormToastProps {
  result?: {
    error?: {
      message?: string;
      fields?: Record<string, string>;
    };
    data?: {
      message?: string;
    };
  };
}

export function ReviewFormToast({ result }: ReviewFormToastProps) {
  useEffect(() => {
    if (!result) return;

    if (result.error) {
      if (result.error.fields) {
        const fieldErrors = Object.values(result.error.fields).filter(Boolean);
        if (fieldErrors.length > 0) {
          toast.error(`Error en el formulario: ${fieldErrors[0]}`);
        }
      } else if (result.error.message) {
        toast.error(result.error.message);
      }
    } else if (result.data?.message) {
      toast.success(result.data.message);
    }
  }, [result]);

  return null;
}