import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BANNER_MODULE } from "../../../modules/banner"
import BannerModuleService from "../../../modules/banner/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const bannerModuleService: BannerModuleService = req.scope.resolve(BANNER_MODULE)

  const banners = await bannerModuleService.listActiveBanners()

  res.json({ banners })
}