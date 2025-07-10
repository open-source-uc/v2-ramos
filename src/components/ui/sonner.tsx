import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-green-light group-[.toaster]:text-green group-[.toaster]:border-green/20",
          error: "group-[.toaster]:bg-red-light group-[.toaster]:text-red group-[.toaster]:border-red/20",
          info: "group-[.toaster]:bg-blue-light group-[.toaster]:text-blue group-[.toaster]:border-blue/20",
          warning: "group-[.toaster]:bg-orange-light group-[.toaster]:text-orange group-[.toaster]:border-orange/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
