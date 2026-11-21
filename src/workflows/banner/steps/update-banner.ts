import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BANNER_MODULE } from "../../../modules/banner"
import type BannerModuleService from "../../../modules/banner/service"
import type { UpdateBannerInput } from "../types"

interface UpdateSnapshot {
  id: string
  previous: {
    title: string
    subtitle: string | null
    image_url: string
    link: string | null
    button_text: string | null
    rank: number
    is_active: boolean
  }
}

export const updateBannerStep = createStep(
  "update-banner",
  async (input: UpdateBannerInput, { container }) => {
    const bannerModuleService: BannerModuleService = container.resolve(
      BANNER_MODULE
    )

    const { id, ...update } = input

    const before = await bannerModuleService.retrieveBanner(id)

    const banner = await bannerModuleService.updateBanners({
      id,
      ...update,
    })

    const snapshot: UpdateSnapshot = {
      id,
      previous: {
        title: before.title,
        subtitle: before.subtitle,
        image_url: before.image_url,
        link: before.link,
        button_text: before.button_text,
        rank: before.rank,
        is_active: before.is_active,
      },
    }

    return new StepResponse(banner, snapshot)
  },
  // Compensación: restaura los valores anteriores del banner
  async (snapshot: UpdateSnapshot | undefined, { container }) => {
    if (!snapshot) return
    const bannerModuleService: BannerModuleService = container.resolve(
      BANNER_MODULE
    )
    await bannerModuleService.updateBanners({
      id: snapshot.id,
      ...snapshot.previous,
    })
  }
)

export default updateBannerStep