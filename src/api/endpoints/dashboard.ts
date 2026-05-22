import { api } from "@/src/api/client";
import { unwrap } from "@/src/api/unwrap";
import type { DashboardPayload } from "@/src/api/types";

export async function getDashboard(): Promise<DashboardPayload> {
  const { data } = await api.get("/dashboard");
  return unwrap<DashboardPayload>(data);
}
