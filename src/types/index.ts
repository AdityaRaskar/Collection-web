export interface Car {
  id: string
  name: string
  brand?: string
  series?: string
  year?: number
  color?: string
  model_number?: string
  manufacturer?: string
  condition?: string
  rarity?: string
  purchase_date?: string | null
  purchase_price?: number | null
  purchase_location?: string | null
  quantity?: number
  description?: string | null
  notes?: string | null
  tags?: string[]
  extra_attributes?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface CarImage {
  id: string
  car_id: string
  image_url: string
  image_path?: string
  display_order: number
  created_at?: string
}
