"use client"

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { 
  Container,
  Heading,
  Text,
  Table,
  Button,
  toast,
} from "@medusajs/ui"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { BannerForm, Banner } from "../../components/banner-form"

export const BannerList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  const { data: banners, isLoading, refetch } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await fetch("/admin/banners", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error al cargar los banners")
      }

      const json = await response.json()
      return json.banners as Banner[]
    },
    staleTime: 5 * 60 * 1000,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Error al eliminar el banner")
      }
    },
    onSuccess: () => {
      toast.success("Banner eliminado")
      refetch()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el banner")
    },
  })

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setDrawerOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <Container>
        <Heading className="text-2xl font-bold mb-4">Banners</Heading>
        <Text>Cargando...</Text>
      </Container>
    )
  }

  return (
    <Container className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Heading className="text-2xl font-bold">Banners</Heading>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setEditingBanner(null)
            setDrawerOpen(true)
          }}
        >
          + Crear Banner
        </Button>
      </div>

      {banners?.length === 0 ? (
        <Text className="text-gray-500">
          No hay banners creados. Crea uno para comenzar.
        </Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Imagen</Table.HeaderCell>
              <Table.HeaderCell>Título</Table.HeaderCell>
              <Table.HeaderCell>Enlace</Table.HeaderCell>
              <Table.HeaderCell>Orden</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {banners?.map((banner: Banner) => (
              <Table.Row key={banner.id}>
                <Table.Cell className="align-middle p-3">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-20 h-20 object-cover rounded"
                    loading="lazy"
                  />
                </Table.Cell>
                <Table.Cell className="align-middle p-3">
                  {banner.title}
                </Table.Cell>
                <Table.Cell className="align-middle p-3">
                  {banner.link || "-"}
                </Table.Cell>
                <Table.Cell className="align-middle p-3">
                  {banner.rank}
                </Table.Cell>
                <Table.Cell className="align-middle p-3">
                  {banner.is_active ? (
                    <span className="text-sm bg-green-100 text-green-800 rounded px-2 py-1">
                      Activo
                    </span>
                  ) : (
                    <span className="text-sm bg-gray-100 text-gray-800 rounded px-2 py-1">
                      Inactivo
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell className="align-middle p-3">
                  <div className="flex gap-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(banner)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(banner.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <BannerForm
        banner={editingBanner}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSaved={refetch}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Banners",
})

export default BannerList
