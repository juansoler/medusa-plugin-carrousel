"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { Button, Container, Divider, Heading, Text, Spinner } from "@medusajs/ui"
import { useToast } from "@tanstack/react-query"

const BannerSlider = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["store-banners"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/banners`,
        {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || "",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Error al cargar los banners")
      }

      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const toast = useToast()

  const handleError = (error: Error) => {
    toast.error(error.message)
  }

  // Auto-scroll logic
  const sliderRef = useRef<HTMLDivElement>(null)
  const scrollInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) return

    const handleScroll = () => {
      if (sliderRef.current && banners?.length > 1) {
        sliderRef.current.scrollBy(200)
      }
    }

    // Auto-scroll every 5 seconds
    scrollInterval.current = setInterval(() => {
      handleScroll()
    }, 5000)

    // Cleanup
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current)
      }
    }
  }, [isLoading])

  return (
    <Container className="mb-8">
      <Heading className="text-2xl font-bold mb-4">
        Banner Slider
      </Heading>
      <Divider className="my-4" />

      {isLoading ? (
        <Spinner className="w-8 h-8 mx-auto" />
      ) : (
        <div
          ref={sliderRef}
          className="relative h-[600px] sm:h-[800px] w-full sm:w-[600px] sm:h-[600px] overflow-hidden"
        >
          {isLoading ? (
            <Spinner className="absolute inset-0 flex items-center justify-center" />
          ) : (
            <div className="absolute inset-0">
              {banners?.map((banner, index) => (
                <div key={banner.id} className="absolute inset-0">
                  <div className="relative w-full h-full">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white text-2xl font-bold">
                          {banner.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {!isLoading && (
        <div className="flex justify-between items-center px-4">
          <Button
            size="small"
            onClick={() => window.location.href = `/admin/banners`}
            className="text-gray-600 hover:text-gray-800"
          >
            Ver en Admin
          </Button>
          <Button
            size="small"
            variant="outline"
            onClick={() => toast.info("Banners actualizados", { duration: 5000 })}
          >
            Actualizar
          </Button>
        </div>
      )}
    </Container>
  )
}

export default BannerSlider