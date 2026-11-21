import { MedusaService } from "@medusajs/framework/utils"
import Banner from "./models/banner"

class BannerModuleService extends MedusaService({
  Banner,
}) {
  /**
   * Devuelve únicamente los banners activos ordenados por `rank` ascendente.
   * Se usa desde la Store API pública.
   */
  async listActiveBanners() {
    return await this.listBanners(
      { is_active: true },
      { order: { rank: "ASC" } }
    )
  }
}

export default BannerModuleService