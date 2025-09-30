export interface Idea {
  id: number;
  title: string;
  description: string | null;
  votes: number;
  created_at: string;
  has_voted: boolean;
}

export interface VoteResponse {
  success: boolean;
  message?: string;
  idea?: Idea;
}

export interface ApiError {
  error: string;
}
