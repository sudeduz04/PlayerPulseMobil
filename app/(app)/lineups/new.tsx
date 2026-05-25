import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { colors } from "@/src/theme/tokens";

export default function NewLineupScreen() {
  return (
    <Screen scroll>
      <BackButton fallback="/(app)/lineups" />
      <Header eyebrow="YENİ KADRO" title="Kadro Oluştur" />

      <Card style={styles.card}>
        <Text style={styles.title}>AI ile Hızlı Kadro</Text>
        <Text style={styles.body}>
          Maç, formasyon ve tercihlerinizi belirtin; AI sizin için en uygun
          kadroyu önersin. Sonuç birkaç saniyede hazır.
        </Text>
        <View style={styles.actions}>
          <Button
            title="✨ AI Önerisi Al"
            onPress={() => router.push("/(app)/lineups/smart" as never)}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.title}>Maç İçinden Oluştur</Text>
        <Text style={styles.body}>
          Belirli bir maç için kadroyu o maçın detay sayfasından
          oluşturabilirsin (kadro aracı maç başına kişiye özel).
        </Text>
        <View style={styles.actions}>
          <Button
            title="Maçlara Git"
            variant="secondary"
            onPress={() => router.push("/(app)/matches" as never)}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  body: { color: colors.text.secondary, fontSize: 14, lineHeight: 20 },
  actions: { marginTop: 12 },
});
