import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BANNER_MODULE } from "../../../modules/banner"
import type BannerModuleService from "../../../modules/banner/service"
import type { CreateBannerInput } from "../types"

export const createBannerStep = createStep(
  "create-banner",
  async (input: CreateBannerInput, { container }) => {
    const bannerModuleService: BannerModuleService = container.resolve(
      BANNER_MODULE
    )

    const banner = await bannerModuleService.createBanners({
      ...input,
      // Defaults explícitos (el modelo ya los define, pero evitamos undefined)
      rank: input.rank ?? 0,
      is_active: input.is_active ?? true,
    })

    return new StepResponse(banner, banner.id)
  },
  // Función de compensación: elimina el banner recién creado
  async (bannerId: string, { container }) => {
    const bannerModuleService: BannerModuleService = container.resolve(
      BANNER_MODULE
    )
    await bannerModuleService.deleteBanners(bannerId)
  }
)

export default createBannerStep