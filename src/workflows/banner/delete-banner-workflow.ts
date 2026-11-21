import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { deleteBannerStep } from "./steps/delete-banner"
import type { DeleteBannerInput } from "./types"

export const deleteBannerWorkflow = createWorkflow(
  "delete-banner",
  (input: DeleteBannerInput) => {
    const result = deleteBannerStep(input)
    return new WorkflowResponse(result)
  }
)

export default deleteBannerWorkflow