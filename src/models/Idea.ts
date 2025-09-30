export interface Idea {
  id: number;
  title: string;
  description: string | null;
  votes: number;
  created_at: Date;
  has_voted?: boolean; // For frontend display
}

export interface Vote {
  id: number;
  idea_id: number;
  ip_address: string;
  created_at: Date;
}
