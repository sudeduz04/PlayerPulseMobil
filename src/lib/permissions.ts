import type { Role } from '@/src/api/types';

export const TEAM_WRITE_ROLES: Role[] = ['super_admin', 'manager'];
export const PLAYER_WRITE_ROLES: Role[] = ['super_admin', 'manager', 'coach'];
export const TRAINING_WRITE_ROLES: Role[] = ['super_admin', 'manager', 'coach'];
export const MATCH_WRITE_ROLES: Role[] = ['super_admin', 'manager', 'coach'];

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
  // Player rolü takım listesini görmez (sadece kendi takımı)
  return !!role && role !== 'player';
}
