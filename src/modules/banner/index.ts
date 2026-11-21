import { Module } from "@medusajs/framework/utils"
import BannerModuleService from "./service"
import Banner from "./models/banner"

/**
 * Nombre con el que se registra el servicio del módulo en el contenedor
 * (req.scope.resolve(...) / container.resolve(...)).
 */
export const BANNER_MODULE = "bannerModuleService"

export { BannerModuleService }
export { Banner }

export default Module(BANNER_MODULE, {
  service: BannerModuleService,
})