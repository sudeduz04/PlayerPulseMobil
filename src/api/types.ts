export type Role = 'super_admin' | 'manager' | 'coach' | 'player';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  status: boolean;
  role: Role;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta?: PaginatedMeta;
  links?: { first?: string; last?: string; prev?: string | null; next?: string | null };
}

export interface AuthPayload {
  user: User;
  token: string;
}

export type AgeCategory = string;

export interface Team {
  id: number;
  name: string;
  age_category: AgeCategory;
  season: string;
  description?: string | null;
  coaches?: User[];
  players_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type DominantFoot = 'left' | 'right' | 'both';
export type PlayerStatus = 'active' | 'inactive' | 'injured';

export interface Position {
  id: number;
  name: string;
  code: string;
  description?: string | null;
}

export interface Player {
  id: number;
  user_id?: number | null;
  team_id: number;
  position_id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  jersey_number: number;
  height?: number | null;
  weight?: number | null;
  dominant_foot: DominantFoot;
  nationality?: string | null;
  status: PlayerStatus;
  photo?: string | null;
  team?: Team;
  position?: Position;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export type TrainingType = 'technical' | 'tactical' | 'physical' | 'mental' | 'match_prep' | 'recovery';

export interface Training {
  id: number;
  team_id: number;
  title: string;
  description?: string | null;
  training_date: string;
  start_time?: string | null;
  end_time?: string | null;
  duration?: number | null;
  location?: string | null;
  type?: TrainingType | string | null;
  team?: Team;
  performances_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface TrainingPerformance {
  id: number;
  training_id: number;
  player_id: number;
  attendance: AttendanceStatus;
  technical_score?: number | null;
  physical_score?: number | null;
  tactical_score?: number | null;
  mental_score?: number | null;
  overall_score?: number | null;
  comment?: string | null;
  player?: Player;
  training?: Training;
}

export type MatchType = 'league' | 'cup' | 'friendly' | 'tournament';
export type MatchStatus = 'scheduled' | 'completed' | 'cancelled' | 'postponed';

export interface Match {
  id: number;
  team_id: number;
  opponent: string;
  match_date: string;
  location?: string | null;
  type?: MatchType | string | null;
  status?: MatchStatus | string | null;
  goals_for?: number | null;
  goals_against?: number | null;
  notes?: string | null;
  team?: Team;
  stats_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MatchStat {
  id: number;
  match_id: number;
  player_id: number;
  starting_eleven?: boolean;
  minutes_played?: number | null;
  goals?: number | null;
  assists?: number | null;
  shots?: number | null;
  shots_on_target?: number | null;
  yellow_cards?: number | null;
  red_cards?: number | null;
  pass_accuracy?: number | null;
  rating?: number | null;
  comment?: string | null;
  player?: Player;
  match?: Match;
}
