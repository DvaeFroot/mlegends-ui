export interface Skin {
  name: string;
  tier: string | null;
  tag: string | null;
  portraitUrl: string | null;
  splashUrl: string | null;
  price: string | null;
}

export interface Ability {
  name: string;
  description: string;
  cooldown: number | null;
  type: string | null;
  iconUrl: string | null;
}

export interface Champion {
  id: string;
  slug: string;
  name: string;
  role: string[];
  specialty: string[];
  lore: string | null;
  release_date: string | null;
  portrait_url: string | null;
  base_stats: Record<string, string | number> | null;
  abilities: Ability[] | null;
  skins: Skin[] | null;
  spotlight_video_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemComponent {
  slug: string;
  name: string;
}

export interface Item {
  id: string;
  slug: string;
  name: string;
  type: string | null;
  tier: number | null;
  cost: number | null;
  description: string | null;
  passive_name: string | null;
  passive_description: string | null;
  stats: Record<string, string | number> | null;
  components: ItemComponent[] | null;
  image_url: string | null;
  removed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScrapeRun {
  id: string;
  resource_type: string;
  source_url: string;
  status: 'running' | 'success' | 'partial' | 'failed';
  records_scraped: number | null;
  records_created: number | null;
  records_updated: number | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface ChangeRecord {
  id: string;
  scrape_run_id: string;
  resource_type: string;
  resource_id: string;
  resource_slug: string;
  change_type: 'created' | 'updated';
  previous_data: unknown;
  new_data: unknown;
  changed_fields: string[] | null;
  created_at: string;
}
