export const queryConfig = {
  retry: 1,
  staleTime: 30_000,
  refetchOnWindowFocus: false,
} as const;

export const apiConfig = {
  timeout: 15_000,
} as const;

export const listConfig = {
  defaultPerPage: 50,
  teamsPerPage: 100,
} as const;
