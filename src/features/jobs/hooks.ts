import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobStatus } from "@/src/api/endpoints/jobs";
import type { JobStatusPayload } from "@/src/api/types";

export const jobKeys = {
  all: ["jobs"] as const,
  status: (uuid: string) => ["jobs", "status", uuid] as const,
};

const TERMINAL_STATUSES: JobStatusPayload["status"][] = ["completed", "failed"];
const POLL_INTERVAL_MS = 3000;

interface UseJobStatusOptions {
  enabled?: boolean;
  onComplete?: (data: JobStatusPayload) => void;
  onFail?: (data: JobStatusPayload) => void;
}

export function useJobStatus(
  uuid: string | undefined,
  opts: UseJobStatusOptions = {},
) {
  const { enabled = true, onComplete, onFail } = opts;
  const handledRef = useRef(false);

  const query = useQuery({
    queryKey: uuid ? jobKeys.status(uuid) : ["jobs", "status", "noop"],
    queryFn: () => getJobStatus(uuid as string),
    enabled: !!uuid && enabled,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      return status && TERMINAL_STATUSES.includes(status)
        ? false
        : POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!query.data || handledRef.current) return;
    if (query.data.status === "completed") {
      handledRef.current = true;
      onComplete?.(query.data);
    } else if (query.data.status === "failed") {
      handledRef.current = true;
      onFail?.(query.data);
    }
  }, [query.data, onComplete, onFail]);

  useEffect(() => {
    handledRef.current = false;
  }, [uuid]);

  return query;
}
