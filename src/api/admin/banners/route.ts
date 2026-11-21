import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BANNER_MODULE } from "../../../modules/banner"
import BannerModuleService from "../../../modules/banner/service"
import { createBannerWorkflow } from "../../../workflows/banner/create-banner-workflow"
import type { CreateBannerInput } from "../../../workflows/banner/types"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const bannerModuleService: BannerModuleService = req.scope.resolve(BANNER_MODULE)

  const banners = await bannerModuleService.listBanners(
    {},
    { order: { rank: "ASC" } }
  )

  res.json({ banners })
}

export const POST = async (
  req: MedusaRequest<CreateBannerInput>,
  res: MedusaResponse
) => {
  const { result } = await createBannerWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  const bannerModuleService: BannerModuleService = req.scope.resolve(
    BANNER_MODULE
  )

  const banner = await bannerModuleService.retrieveBanner(result.id)

  res.status(201).json({ banner })
}