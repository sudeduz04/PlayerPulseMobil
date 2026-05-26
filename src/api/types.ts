export type Role = "super_admin" | "manager" | "coach" | "player";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  status: boolean;
  role: Role;
  email_verified_at?: string | null;
  teams?: { id: number; name?: string }[];
  team_ids?: number[];
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
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
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

export type DominantFoot = "left" | "right" | "both";
export type PlayerStatus = "active" | "inactive" | "injured";

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

export type TrainingType =
  | "technical"
  | "tactical"
  | "physical"
  | "mental"
  | "match_prep"
  | "recovery";

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

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

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

export interface TrainingSummary {
  total_trainings: number;
  attended: number;
  absent: number;
  excused: number;
  attendance_rate: number;
  average_score: number | null;
}

export type MatchType = "league" | "cup" | "friendly" | "tournament";
export type MatchStatus =
  | "scheduled"
  | "first_half"
  | "half_time"
  | "second_half"
  | "finished"
  | "completed"
  | "cancelled"
  | "postponed";

export type MatchResult = "home_win" | "away_win" | "draw" | null;

export interface Match {
  id: number;
  team_id?: number | null;
  opponent?: string;
  opponent_team?: string | null;
  match_date: string;
  kickoff_time?: string | null;
  week?: number | null;
  location?: string | null;
  type?: MatchType | string | null;
  status: MatchStatus | string;
  goals_for?: number | null;
  goals_against?: number | null;
  result?: MatchResult | string | null;
  home_team_id?: number | null;
  away_team_id?: number | null;
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  notes?: string | null;
  team?: Team;
  league_id?: number | null;
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

export interface MatchSummary {
  total_matches: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number;
  average_rating: number | null;
  average_pass_accuracy: number | null;
  yellow_cards: number;
  red_cards: number;
}

export interface DevelopmentReport {
  id: number;
  player_id: number;
  coach_id?: number | null;
  report_date?: string | null;
  period?: string | null;
  technical_score?: number | null;
  tactical_score?: number | null;
  physical_score?: number | null;
  mental_score?: number | null;
  overall_score?: number | null;
  strengths?: string | null;
  weaknesses?: string | null;
  recommendations?: string | null;
  notes?: string | null;
  player?: Player;
  coach?: User;
  created_at?: string;
  updated_at?: string;
}

export interface DevelopmentReportSummary {
  total_reports: number;
  average_technical_score?: number | null;
  average_tactical_score?: number | null;
  average_physical_score?: number | null;
  average_mental_score?: number | null;
  average_overall_score?: number | null;
}

export interface PlayerDashboard {
  profile: Player | null;
  team: Team | null;
  training_summary: TrainingSummary;
  recent_training_performances: TrainingPerformance[];
  match_summary: MatchSummary;
  recent_match_stats: MatchStat[];
  development_report_summary?: DevelopmentReportSummary | null;
  latest_reports?: DevelopmentReport[];
}

export interface MyHealth {
  active_injuries?: Injury[];
  injury_history?: Injury[];
  latest_measurement?: PhysicalMeasurement | null;
  measurement_trend?: PhysicalMeasurement[];
  fitness_score?: number | null;
  notes?: string | null;
}

export interface DashboardKpi {
  label: string;
  value: number | string;
  delta?: number | string | null;
  hint?: string | null;
}

export interface DashboardPayload {
  role: Role;
  generated_at?: string;
  kpis?: DashboardKpi[];
  upcoming_matches?: Match[];
  upcoming_trainings?: Training[];
  recent_players?: Player[];
  recent_reports?: DevelopmentReport[];
  pending_jobs?: {
    id: number | string;
    type: string;
    status: JobStatus;
    status_label?: string;
  }[];
  [key: string]: unknown;
}

export interface League {
  id: number;
  name: string;
  season: string;
  description?: string | null;
  teams?: Team[];
  team_ids?: number[];
  teams_count?: number;
  matches_count?: number;
  matches?: Match[];
  fixtureImports?: FixtureImport[];
  fixtures_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type LeagueFixtureStatus =
  | "scheduled"
  | "first_half"
  | "half_time"
  | "second_half"
  | "finished"
  | "postponed";

export interface LeagueFixture {
  id: number;
  league_id: number;
  week?: number | null;
  fixture_date: string;
  home_team_id?: number | null;
  away_team_id?: number | null;
  home_team_name?: string | null;
  away_team_name?: string | null;
  home_team?: Team | null;
  away_team?: Team | null;
  location?: string | null;
  status: LeagueFixtureStatus | string;
  home_score?: number | null;
  away_score?: number | null;
}

export type InjurySeverity = "minor" | "moderate" | "severe" | string;
export type InjuryStatus = "open" | "recovering" | "closed" | string;

export interface Injury {
  id: number;
  player_id: number;
  injury_date: string;
  recovery_date?: string | null;
  body_part?: string | null;
  description?: string | null;
  severity?: InjurySeverity | null;
  status?: InjuryStatus | null;
  notes?: string | null;
  player?: Player;
  created_at?: string;
  updated_at?: string;
}

export interface PhysicalMeasurement {
  id: number;
  player_id: number;
  measurement_date: string;
  height?: number | null;
  weight?: number | null;
  body_fat?: number | null;
  resting_heart_rate?: number | null;
  vo2_max?: number | null;
  notes?: string | null;
  player?: Player;
  created_at?: string;
}

export interface PlayerNote {
  id: number;
  player_id: number;
  author_id?: number | null;
  body: string;
  category?: string | null;
  created_at?: string;
  author?: User;
}

export interface Formation {
  code: string;
  label?: string;
  slots: LineupSlotDefinition[];
}

export interface LineupSlotDefinition {
  slot_key: string;
  field_x: number;
  field_y: number;
  position_id?: number | null;
  position_code?: string | null;
  role?: string | null;
}

export interface LineupAssignment {
  id?: number;
  player_id: number;
  position_id?: number | null;
  slot_key: string;
  field_x: number;
  field_y: number;
  is_starting: boolean;
  player?: Player;
}

export interface Lineup {
  id: number;
  match_id?: number | null;
  team_id?: number | null;
  formation: string;
  note?: string | null;
  status?: JobStatus | string | null;
  status_label?: string | null;
  players?: LineupAssignment[];
  /** Backend bazen `assignments` ya da `lineupPlayers` adıyla döndürebilir. */
  assignments?: LineupAssignment[];
  lineupPlayers?: LineupAssignment[];
  players_count?: number;
  starters_count?: number;
  bench_count?: number;
  match?: Match;
  team?: Team;
  created_at?: string;
  updated_at?: string;
}

export interface LineupOptions {
  formations: Formation[];
  positions?: Position[];
}

export interface SmartLineupOptions {
  formations: Formation[];
  matches?: Match[];
}

export interface SmartLineupResult {
  id: string;
  status: JobStatus | string;
  status_url?: string;
  lineup_id?: number | null;
  status_label?: string;
}

export type AnalysisType =
  | "player_development"
  | "match_performance"
  | "training_progress"
  | "team_overview"
  | string;

export interface Analysis {
  id: number;
  type: AnalysisType;
  title?: string | null;
  prompt?: string | null;
  status: JobStatus | string;
  status_label?: string | null;
  scope?: {
    player_id?: number | null;
    match_id?: number | null;
    team_id?: number | null;
    training_id?: number | null;
    date_from?: string | null;
    date_to?: string | null;
  } | null;
  output_markdown?: string | null;
  error_message?: string | null;
  job_uuid?: string | null;
  player?: Player;
  match?: Match;
  team?: Team;
  created_at?: string;
  updated_at?: string;
}

export interface AnalysisOptions {
  types: { value: AnalysisType; label: string }[];
  players?: Player[];
  matches?: Match[];
  teams?: Team[];
}

export interface FixtureImport {
  id: number;
  league_id?: number;
  status: JobStatus | string;
  status_label?: string;
  created_rows?: number;
  skipped_rows?: number;
  skipped?: { row?: number; reason?: string }[];
  error_message?: string | null;
  status_url?: string;
  created_at?: string;
}

export type JobStatus = "queued" | "running" | "completed" | "failed";

export interface JobStatusPayload {
  status: JobStatus;
  status_label?: string;
  processed?: number;
  total?: number;
  result_id?: number | string | null;
  error_message?: string | null;
}
