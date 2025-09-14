export interface User {
  id: string
  email: string
  subscription_tier: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface PDFDocument {
  id: string
  user_id: string
  name: string
  file_path: string
  file_size: number
  created_at: string
  updated_at: string
  thumbnail_url?: string
}

export interface AIEnhancement {
  id: string
  document_id: string
  type: 'resume_enhance' | 'photo_to_pdf' | 'summarize' | 'extract'
  input_data: any
  output_data: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  completed_at?: string
}

export interface Subscription {
  id: string
  user_id: string
  tier: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due'
  current_period_start: string
  current_period_end: string
  stripe_subscription_id?: string
}

export interface PDFEditorState {
  currentDocument: PDFDocument | null
  pages: number
  currentPage: number
  zoom: number
  annotations: Annotation[]
  isEditing: boolean
}

export interface Annotation {
  id: string
  type: 'text' | 'highlight' | 'comment' | 'signature'
  page: number
  x: number
  y: number
  width: number
  height: number
  content: string
  color?: string
  created_at: string
}
