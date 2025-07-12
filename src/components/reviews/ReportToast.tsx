import { useEffect } from "react";
import { toast } from "sonner";

interface ReportToastProps {
  result?: {
    error?: {
      message?: string;
    };
    data?: {
      message?: string;
    };
  };
}

export function ReportToast({ result }: ReportToastProps) {
  useEffect(() => {
    if (!result) return;

    if (result.error?.message) {
      toast.error(result.error.message);
    } else if (result.data?.message) {
      toast.success(result.data.message);
    }
  }, [result]);

  return null;
}