export interface Skill {
  id: number;
  name: string;
  display_name: string;
  description: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  version: string;
  author: string | null;
  source_url: string | null;
  license: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillListResponse {
  items: Skill[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SkillImportResponse {
  imported: number;
  skipped: number;
  errors: string[];
}

