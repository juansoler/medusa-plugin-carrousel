import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { updateBannerStep } from "./steps/update-banner"
import type { UpdateBannerInput } from "./types"

export const updateBannerWorkflow = createWorkflow(
  "update-banner",
  (input: UpdateBannerInput) => {
    const banner = updateBannerStep(input)
    return new WorkflowResponse(banner)
  }
)

export default updateBannerWorkflow