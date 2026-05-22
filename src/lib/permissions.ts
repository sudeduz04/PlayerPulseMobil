import type { Role } from "@/src/api/types";

export const TEAM_ACCESS_ROLES: Role[] = ["super_admin", "manager", "coach"];
export const TEAM_WRITE_ROLES: Role[] = ["super_admin"];
export const PLAYER_ACCESS_ROLES: Role[] = ["super_admin", "manager", "coach"];
export const PLAYER_WRITE_ROLES: Role[] = ["super_admin", "coach"];
export const TRAINING_ACCESS_ROLES: Role[] = [
  "super_admin",
  "manager",
  "coach",
];
export const TRAINING_WRITE_ROLES: Role[] = ["super_admin", "coach"];
export const MATCH_ACCESS_ROLES: Role[] = ["super_admin", "manager", "coach"];
export const MATCH_WRITE_ROLES: Role[] = ["super_admin", "coach"];
export const REPORT_WRITE_ROLES: Role[] = ["super_admin", "coach"];
export const LINEUP_ACCESS_ROLES: Role[] = ["super_admin", "coach"];
export const LINEUP_WRITE_ROLES: Role[] = ["super_admin", "coach"];
export const ANALYSIS_ACCESS_ROLES: Role[] = [
  "super_admin",
  "manager",
  "coach",
];
export const ANALYSIS_WRITE_ROLES: Role[] = ["super_admin", "coach"];
export const USER_ADMIN_ROLES: Role[] = ["super_admin"];
export const LEAGUE_ACCESS_ROLES: Role[] = ["super_admin", "manager", "coach"];
export const LEAGUE_WRITE_ROLES: Role[] = ["super_admin"];
export const FIXTURE_IMPORT_ROLES: Role[] = ["super_admin"];
export const HEALTH_ACCESS_ROLES: Role[] = ["super_admin", "manager", "coach"];
export const HEALTH_WRITE_ROLES: Role[] = ["super_admin", "manager", "coach"];
export const NOTE_ACCESS_ROLES: Role[] = ["super_admin", "manager", "coach"];
export const NOTE_WRITE_ROLES: Role[] = ["super_admin", "manager", "coach"];

export function canWriteTeams(role?: Role) {
  return !!role && TEAM_WRITE_ROLES.includes(role);
}

export function canWritePlayers(role?: Role) {
  return !!role && PLAYER_WRITE_ROLES.includes(role);
}

export function canWriteTrainings(role?: Role) {
  return !!role && TRAINING_WRITE_ROLES.includes(role);
}

export function canWriteMatches(role?: Role) {
  return !!role && MATCH_WRITE_ROLES.includes(role);
}

export function canAccessTeams(role?: Role) {
  return !!role && TEAM_ACCESS_ROLES.includes(role);
}

export function canAccessPlayers(role?: Role) {
  return !!role && PLAYER_ACCESS_ROLES.includes(role);
}

export function canAccessTrainings(role?: Role) {
  return !!role && TRAINING_ACCESS_ROLES.includes(role);
}

export function canAccessMatches(role?: Role) {
  return !!role && MATCH_ACCESS_ROLES.includes(role);
}

export function canWriteReports(role?: Role) {
  return !!role && REPORT_WRITE_ROLES.includes(role);
}

export function canAccessLineups(role?: Role) {
  return !!role && LINEUP_ACCESS_ROLES.includes(role);
}

export function canWriteLineups(role?: Role) {
  return !!role && LINEUP_WRITE_ROLES.includes(role);
}

export function canAccessAnalysis(role?: Role) {
  return !!role && ANALYSIS_ACCESS_ROLES.includes(role);
}

export function canWriteAnalysis(role?: Role) {
  return !!role && ANALYSIS_WRITE_ROLES.includes(role);
}

export function canAccessUsers(role?: Role) {
  return !!role && USER_ADMIN_ROLES.includes(role);
}

export function canAccessLeagues(role?: Role) {
  return !!role && LEAGUE_ACCESS_ROLES.includes(role);
}

export function canWriteLeagues(role?: Role) {
  return !!role && LEAGUE_WRITE_ROLES.includes(role);
}

export function canImportFixtures(role?: Role) {
  return !!role && FIXTURE_IMPORT_ROLES.includes(role);
}

export function canAccessInjuries(role?: Role) {
  return !!role && HEALTH_ACCESS_ROLES.includes(role);
}

export function canWriteInjuries(role?: Role) {
  return !!role && HEALTH_WRITE_ROLES.includes(role);
}

export function canAccessMeasurements(role?: Role) {
  return !!role && HEALTH_ACCESS_ROLES.includes(role);
}

export function canWriteMeasurements(role?: Role) {
  return !!role && HEALTH_WRITE_ROLES.includes(role);
}

export function canAccessPlayerNotes(role?: Role) {
  return !!role && NOTE_ACCESS_ROLES.includes(role);
}

export function canWritePlayerNotes(role?: Role) {
  return !!role && NOTE_WRITE_ROLES.includes(role);
}
