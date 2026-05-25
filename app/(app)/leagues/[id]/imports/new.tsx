import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { useToast } from "@/src/components/ui/Toast";
import {
  useFixtureImport,
  useUploadFixtureFile,
} from "@/src/features/fixtureImports/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export default function NewFixtureImportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leagueId = Number(id);
  const toast = useToast();
  const uploadMutation = useUploadFixtureFile();
  const [picked, setPicked] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [pollId, setPollId] = useState<number | null>(null);
  const importQ = useFixtureImport(pollId ?? undefined, {
    enabled: pollId != null,
  });

  const onPick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ACCEPTED_TYPES,
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled) return;
    setPicked(result.assets[0]);
  };

  const onUpload = async () => {
    if (!picked) return;
    try {
      const result = await uploadMutation.mutateAsync({
        leagueId,
        file: {
          uri: picked.uri,
          name: picked.name,
          mimeType: picked.mimeType,
        },
      });
      toast.show("Yükleme başlatıldı", "info");
      if (result.status === "completed") {
        toast.show(`${result.created_rows ?? 0} fikstür eklendi`, "success");
        router.replace(`/(app)/leagues/${leagueId}` as never);
      } else {
        setPollId(result.id);
      }
    } catch (e) {
      toast.show(extractErrorMessage(e, "Yüklenemedi"), "error");
    }
  };

  const status = importQ.data?.status;
  const statusLabel = importQ.data?.status_label ?? status ?? "";

  if (pollId && status === "completed") {
    toast.show(`${importQ.data?.created_rows ?? 0} fikstür eklendi`, "success");
    router.replace(`/(app)/leagues/${leagueId}` as never);
  }

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/leagues/${leagueId}/imports`} />
      <Header
        eyebrow="FİKSTÜR İÇE AKTAR"
        title="Dosya Yükle"
        subtitle="CSV veya Excel"
      />

      <Card style={styles.card}>
        {picked ? (
          <>
            <Text style={styles.label}>Seçilen dosya</Text>
            <Text style={styles.fileName}>{picked.name}</Text>
            {picked.size ? (
              <Text style={styles.fileSize}>
                {Math.round(picked.size / 1024)} KB
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.muted}>Henüz dosya seçilmedi.</Text>
        )}
        <View style={styles.actions}>
          <Button
            title={picked ? "Farklı dosya seç" : "Dosya Seç"}
            variant="secondary"
            onPress={onPick}
          />
        </View>
      </Card>

      {pollId ? (
        <Card style={styles.card}>
          <View style={styles.statusHeader}>
            <Text style={styles.label}>Durum</Text>
            <Chip
              label={statusLabel || "Bilinmiyor"}
              tone={status === "completed" ? "accent" : "neutral"}
            />
          </View>
          {status !== "completed" && status !== "failed" ? (
            <View style={styles.spinnerRow}>
              <ActivityIndicator color={colors.accent.DEFAULT} />
              <Text style={styles.muted}>İçe aktarım işleniyor...</Text>
            </View>
          ) : null}
          {importQ.data?.error_message ? (
            <Text style={styles.error}>{importQ.data.error_message}</Text>
          ) : null}
        </Card>
      ) : null}

      <Button
        title="Yükle ve İçe Aktar"
        accessibilityLabel="Yükle ve içe aktar"
        onPress={onUpload}
        disabled={!picked || uploadMutation.isPending}
        loading={uploadMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  label: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fileName: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  fileSize: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  muted: { color: colors.text.secondary, fontSize: 13 },
  actions: { marginTop: 12 },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  spinnerRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  error: { color: colors.danger, fontSize: 13, marginTop: 8 },
});
