import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createBannerStep } from "./steps/create-banner"
import type { CreateBannerInput } from "./types"

export const createBannerWorkflow = createWorkflow(
  "create-banner",
  (input: CreateBannerInput) => {
    const banner = createBannerStep(input)
    return new WorkflowResponse(banner)
  }
)

export default createBannerWorkflow