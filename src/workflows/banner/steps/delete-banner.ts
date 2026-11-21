import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BANNER_MODULE } from "../../../modules/banner"
import type BannerModuleService from "../../../modules/banner/service"
import type { DeleteBannerInput } from "../types"

// Snapshot del banner eliminado para poder recrearlo en el rollback
type BannerSnapshot = {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link: string | null
  button_text: string | null
  rank: number
  is_active: boolean
}

export const deleteBannerStep = createStep(
  "delete-banner",
  async (input: DeleteBannerInput, { container }) => {
    const bannerModuleService: BannerModuleService = container.resolve(
      BANNER_MODULE
    )

    const banner = await bannerModuleService.retrieveBanner(input.id)

    await bannerModuleService.deleteBanners(input.id)

    const snapshot: BannerSnapshot = {
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image_url: banner.image_url,
      link: banner.link,
      button_text: banner.button_text,
      rank: banner.rank,
      is_active: banner.is_active,
    }

    return new StepResponse({ deleted: true, id: input.id }, snapshot)
  },
  // Compensación: recrea el banner eliminado con sus datos originales
  async (snapshot: BannerSnapshot | undefined, { container }) => {
    if (!snapshot) return
    const bannerModuleService: BannerModuleService = container.resolve(
      BANNER_MODULE
    )
    const { id, ...data } = snapshot
    await bannerModuleService.createBanners({
      id,
      ...data,
    })
  }
)

export default deleteBannerStep