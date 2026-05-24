import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
  type ListUsersParams,
  type UserInput,
} from "@/src/api/endpoints/users";

export const userKeys = {
  all: ["users"] as const,
  list: (params: ListUsersParams) => ["users", "list", params] as const,
  detail: (id: number) => ["users", "detail", id] as const,
};

export function useUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => listUsers(params),
  });
}

export function useUser(id: number | undefined) {
  return useQuery({
    queryKey: id ? userKeys.detail(id) : ["users", "detail", "noop"],
    queryFn: () => getUser(id as number),
    enabled: typeof id === "number",
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UserInput) => createUser(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<UserInput> }) =>
      updateUser(id, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      qc.invalidateQueries({ queryKey: userKeys.detail(vars.id) });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}
