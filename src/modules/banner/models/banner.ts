import { model } from "@medusajs/framework/utils"

const Banner = model.define("Banner", {
  id: model.id().primaryKey(),
  title: model.text(),
  subtitle: model.text().nullable(),
  image_url: model.text(),
  link: model.text().nullable(),
  button_text: model.text().nullable(),
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
})

export { Banner as BannerType }

export default Banner