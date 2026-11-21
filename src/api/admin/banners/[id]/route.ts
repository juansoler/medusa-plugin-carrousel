import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BANNER_MODULE } from "../../../../modules/banner"
import BannerModuleService from "../../../../modules/banner/service"
import { updateBannerWorkflow } from "../../../../workflows/banner/update-banner-workflow"
import { deleteBannerWorkflow } from "../../../../workflows/banner/delete-banner-workflow"
import type { UpdateBannerInput } from "../../../../workflows/banner/types"

export const POST = async (
  req: MedusaRequest<UpdateBannerInput>,
  res: MedusaResponse
) => {
  const bannerId = req.params.id

  const { result } = await updateBannerWorkflow(req.scope).run({
    input: { id: bannerId, ...(req.validatedBody as Record<string, unknown>) },
  })

  const bannerModuleService: BannerModuleService = req.scope.resolve(
    BANNER_MODULE
  )

  const banner = await bannerModuleService.retrieveBanner(result.id)

  res.json({ banner })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const bannerId = req.params.id

  const { result } = await deleteBannerWorkflow(req.scope).run({
    input: { id: bannerId },
  })

  res.json(result)
}