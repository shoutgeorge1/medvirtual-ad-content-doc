export type ConceptStatus =
  | 'Draft'
  | 'In Progress'
  | 'Ready For Review'
  | 'Approved'
  | 'Exported';

export type ExportSize = '1080x1350' | '1080x1080';

export interface Concept {
  concept_id: string;
  role: string;
  angle: string;
  source_url: string;
  source_page_name: string;
  image_prompt: string;
  image_file: string;
  image_direction: string;
  on_image_hook: string;
  bullet_1: string;
  bullet_2: string;
  bullet_3: string;
  cta: string;
  primary_text: string;
  headline: string;
  description: string;
  file_name: string;
  status: ConceptStatus;
  notes: string;
}
