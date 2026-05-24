import { api } from "@/src/api/client";
import { unwrap, unwrapPaginated } from "@/src/api/unwrap";
import type { Paginated, Role, User } from "@/src/api/types";

export interface ListUsersParams {
  search?: string;
  role?: Role;
  status?: boolean;
  per_page?: number;
  page?: number;
}

export async function listUsers(
  params: ListUsersParams = {},
): Promise<Paginated<User>> {
  const { data } = await api.get("/users", { params });
  return unwrapPaginated<User>(data);
}

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return unwrap<User>(data);
}

export interface UserInput {
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  role: Role;
  status?: boolean;
  password?: string;
  password_confirmation?: string;
}

export async function createUser(input: UserInput): Promise<User> {
  const { data } = await api.post("/users", input);
  return unwrap<User>(data);
}

export async function updateUser(
  id: number,
  input: Partial<UserInput>,
): Promise<User> {
  const { data } = await api.put(`/users/${id}`, input);
  return unwrap<User>(data);
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
