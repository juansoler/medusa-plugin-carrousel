"use client"

import {
  Button,
  Drawer,
  Input,
  Label,
  Switch,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export type Banner = {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link: string | null
  button_text: string | null
  rank: number
  is_active: boolean
}

type BannerPayload = {
  title: string
  subtitle: string | null
  image_url: string
  link: string | null
  button_text: string | null
  rank: number
  is_active: boolean
}

interface BannerFormProps {
  banner: Banner | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("files", file)

  const response = await fetch("/admin/uploads", {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Error al subir la imagen")
  }

  const data = await response.json()
  // La API de uploads devuelve { uploads: [{ url, ... }] }
  return data.uploads?.[0]?.url ?? data.image_url ?? data.url
}

export const BannerForm = ({
  banner,
  open,
  onOpenChange,
  onSaved,
}: BannerFormProps) => {
  const isEdit = !!banner
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  // Sincroniza el estado del formulario al abrir el drawer
  useEffect(() => {
    if (open) {
      setImageUrl(banner?.image_url ?? "")
    }
  }, [open, banner])

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: BannerPayload) => {
      const response = await fetch(
        isEdit ? `/admin/banners/${banner!.id}` : "/admin/banners",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Error al guardar el banner")
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success(isEdit ? "Banner actualizado" : "Banner creado")
      onOpenChange(false)
      onSaved()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al guardar el banner")
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload: BannerPayload = {
      title: formData.get("title") as string,
      subtitle: ((formData.get("subtitle") as string) || null) as string | null,
      image_url: imageUrl || ((formData.get("image_url") as string) || ""),
      link: ((formData.get("link") as string) || null) as string | null,
      button_text: ((formData.get("button_text") as string) || null) as string | null,
      rank: parseInt((formData.get("rank") as string) || "0", 10),
      is_active: formData.get("is_active") === "on",
    }

    mutate(payload)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
      toast.success("Imagen subida correctamente")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <Drawer.Header>
            <Drawer.Title>
              {isEdit ? "Editar Banner" : "Crear Banner"}
            </Drawer.Title>
          </Drawer.Header>

          <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-6 overflow-y-auto">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                defaultValue={banner?.title ?? ""}
                required
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                name="subtitle"
                defaultValue={banner?.subtitle ?? ""}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="image_url">URL de Imagen</Label>
              <Input
                id="image_url"
                name="image_url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
              <div className="flex items-center gap-x-2">
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  onClick={() => document.getElementById("banner-file")?.click()}
                  isLoading={isUploading}
                >
                  Subir imagen
                </Button>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
              </div>
              <input
                id="banner-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="link">URL del Enlace</Label>
              <Input id="link" name="link" defaultValue={banner?.link ?? ""} />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="button_text">Texto del Botón</Label>
              <Input
                id="button_text"
                name="button_text"
                defaultValue={banner?.button_text ?? ""}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="rank">Orden (Rank)</Label>
              <Input
                id="rank"
                name="rank"
                type="number"
                min={0}
                defaultValue={banner?.rank ?? 0}
              />
            </div>

            <div className="flex items-center gap-x-2">
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={banner?.is_active ?? true}
              />
              <Label htmlFor="is_active">Activo</Label>
            </div>

            <Text size="small" className="text-ui-fg-subtle">
              Los banners se ordenan por rank ascendente. Solo los activos se
              muestran en la Store API.
            </Text>
          </Drawer.Body>

          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button variant="secondary">Cancelar</Button>
              </Drawer.Close>
              <Button type="submit" isLoading={isPending}>
                {isEdit ? "Guardar cambios" : "Crear banner"}
              </Button>
            </div>
          </Drawer.Footer>
        </form>
      </Drawer.Content>
    </Drawer>
  )
}

export default BannerForm