/** Tipos compartidos entre workflows y rutas API */

export interface CreateBannerInput {
  title: string
  subtitle?: string | null
  image_url: string
  link?: string | null
  button_text?: string | null
  rank?: number
  is_active?: boolean
}

export type UpdateBannerInput = Partial<CreateBannerInput> & {
  id: string
}

export interface DeleteBannerInput {
  id: string
}