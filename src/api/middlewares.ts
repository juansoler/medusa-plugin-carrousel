import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"

const CreateBannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  image_url: z.string().url(),
  link: z.string().optional().nullable(),
  button_text: z.string().optional().nullable(),
  rank: z.number().int().nonnegative().optional(),
  is_active: z.boolean().optional(),
})

const UpdateBannerSchema = CreateBannerSchema.partial()

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/banners",
      middlewares: [
        validateAndTransformBody(CreateBannerSchema),
      ],
    },
    {
      method: "POST",
      matcher: "/admin/banners/[id]",
      middlewares: [
        validateAndTransformBody(UpdateBannerSchema),
      ],
    },
  ],
})