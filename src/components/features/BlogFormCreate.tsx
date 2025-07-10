"use client";
import * as React from "react";
import { useState } from "react";
import EditorMDX from "@/components/EditorMDX";
import Notification from "@/components/ui/Notification";

interface BlogFormData {
  title: string;
  faculty: string;
  readtime: string;
  description: string;
  content: string;
}

interface BlogFormCreateProps {
  onSuccess?: (data: BlogFormData) => void;
  onError?: (error: string) => void;
}

interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}

export default function BlogFormCreate({
  onSuccess,
  onError,
}: BlogFormCreateProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    faculty: "",
    readtime: "",
    description: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<BlogFormData>>({});
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [editorKey, setEditorKey] = useState(0); // Para forzar re-render del editor

  const addNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name as keyof BlogFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));

    // Limpiar error de contenido
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BlogFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!formData.faculty.trim()) {
      newErrors.faculty = "La facultad es obligatoria";
    }

    if (!formData.readtime.trim()) {
      newErrors.readtime = "El tiempo de lectura es obligatorio";
    } else if (
      isNaN(Number(formData.readtime)) ||
      Number(formData.readtime) <= 0
    ) {
      newErrors.readtime = "El tiempo de lectura debe ser un número válido";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (!formData.content.trim()) {
      newErrors.content = "El contenido del blog es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          contentType: "blogs",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el blog");
      }

      const result = await response.json();

      // Limpiar formulario
      setFormData({
        title: "",
        faculty: "",
        readtime: "",
        description: "",
        content: "",
      });

      addNotification("¡Blog publicado exitosamente!", "success");
      onSuccess?.(formData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      addNotification(`Error al publicar el blog: ${errorMessage}`, "error");
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReadTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "") || "";
    setFormData((prev) => ({ ...prev, readtime: value }));

    if (errors.readtime) {
      setErrors((prev) => ({ ...prev, readtime: undefined }));
    }
  };

  return (
    <>
      {/* Notificaciones */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 tablet:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica del blog */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Título del blog <span className="text-red">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ingrese el título del blog"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${
                  errors.title ? "border-red-500" : "border-border"
                }`}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Facultad <span className="text-red">*</span>
              </label>
              <input
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                placeholder="Ej. Ingeniería, Medicina, etc."
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${
                  errors.faculty ? "border-red-500" : "border-border"
                }`}
                required
              />
              {errors.faculty && (
                <p className="text-sm text-red-500">{errors.faculty}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Tiempo de lectura <span className="text-red">*</span>
              </label>
              <div className="relative">
                <input
                  name="readtime"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.readtime}
                  onChange={handleReadTimeInput}
                  placeholder="5"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    errors.readtime ? "border-red-500" : "border-border"
                  }`}
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  min
                </span>
              </div>
              {errors.readtime && (
                <p className="text-sm text-red-500">{errors.readtime}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Resumen del blog <span className="text-red">*</span>
              </label>
              <input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Breve descripción del contenido"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${
                  errors.description ? "border-red-500" : "border-border"
                }`}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-border pt-4 sm:pt-6">
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-foreground block">
                Contenido del blog <span className="text-red">*</span>
              </label>
              <p className="text-sm text-muted-foreground">
                Utiliza el editor para crear contenido enriquecido con formato,
                imágenes y componentes especiales.
              </p>
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Editor MDX */}
          <div className="space-y-4">
            <EditorMDX
              submitText={isSubmitting ? "Publicando..." : "Publicar Blog"}
              onContentChange={handleContentChange}
            />

            {/* Botón de envío personalizado */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                }`}
              >
                {isSubmitting ? "Publicando..." : "Publicar Blog"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
