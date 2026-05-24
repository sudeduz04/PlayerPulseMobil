import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlayerNote,
  deletePlayerNote,
  listPlayerNotes,
  type PlayerNoteInput,
} from "@/src/api/endpoints/playerNotes";

export const playerNoteKeys = {
  all: ["player-notes"] as const,
  byPlayer: (playerId: number) => ["player-notes", "player", playerId] as const,
};

export function usePlayerNotes(playerId: number | undefined) {
  return useQuery({
    queryKey: playerId
      ? playerNoteKeys.byPlayer(playerId)
      : ["player-notes", "noop"],
    queryFn: () => listPlayerNotes(playerId as number),
    enabled: typeof playerId === "number",
  });
}

export function useCreatePlayerNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      playerId,
      input,
    }: {
      playerId: number;
      input: PlayerNoteInput;
    }) => createPlayerNote(playerId, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: playerNoteKeys.byPlayer(vars.playerId),
      });
    },
  });
}

export function useDeletePlayerNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, playerId }: { id: number; playerId: number }) =>
      deletePlayerNote(id).then(() => playerId),
    onSuccess: (playerId) => {
      qc.invalidateQueries({ queryKey: playerNoteKeys.byPlayer(playerId) });
    },
  });
}
