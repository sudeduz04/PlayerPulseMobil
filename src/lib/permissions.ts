import type { Role } from '@/src/api/types';

export const TEAM_ACCESS_ROLES: Role[] = ['super_admin', 'manager', 'coach'];
export const TEAM_WRITE_ROLES: Role[] = ['super_admin'];
export const PLAYER_ACCESS_ROLES: Role[] = ['super_admin', 'manager', 'coach'];
export const PLAYER_WRITE_ROLES: Role[] = ['super_admin', 'coach'];
export const TRAINING_ACCESS_ROLES: Role[] = ['super_admin', 'manager', 'coach'];
export const TRAINING_WRITE_ROLES: Role[] = ['super_admin', 'coach'];
export const MATCH_ACCESS_ROLES: Role[] = ['super_admin', 'manager', 'coach'];
export const MATCH_WRITE_ROLES: Role[] = ['super_admin', 'coach'];
export const REPORT_WRITE_ROLES: Role[] = ['super_admin', 'coach'];

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
