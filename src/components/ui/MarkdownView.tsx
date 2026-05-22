import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { colors, radius } from "@/src/theme/tokens";

interface MarkdownViewProps {
  children: string;
}

export function MarkdownView({ children }: MarkdownViewProps) {
  return <Markdown style={mdStyles}>{children}</Markdown>;
}

const mdStyles = StyleSheet.create({
  body: {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 22,
  },
  heading1: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  heading2: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  heading3: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 0,
    marginBottom: 8,
  },
  strong: {
    color: colors.text.primary,
    fontWeight: "700",
  },
  em: {
    fontStyle: "italic",
    color: colors.text.primary,
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  list_item: {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 22,
  },
  bullet_list_icon: {
    color: colors.accent.DEFAULT,
  },
  ordered_list_icon: {
    color: colors.accent.DEFAULT,
  },
  code_inline: {
    backgroundColor: colors.surface[700],
    color: colors.accent.DEFAULT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 13,
  },
  code_block: {
    backgroundColor: colors.surface[700],
    color: colors.text.primary,
    padding: 12,
    borderRadius: radius.input,
    fontSize: 13,
    marginVertical: 8,
  },
  fence: {
    backgroundColor: colors.surface[700],
    color: colors.text.primary,
    padding: 12,
    borderRadius: radius.input,
    fontSize: 13,
    marginVertical: 8,
  },
  blockquote: {
    backgroundColor: colors.surface[700],
    borderLeftColor: colors.accent.DEFAULT,
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  link: {
    color: colors.accent.DEFAULT,
  },
  hr: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 12,
  },
  table: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.input,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: colors.surface[700],
  },
  th: {
    color: colors.text.primary,
    padding: 8,
    fontWeight: "700",
  },
  td: {
    color: colors.text.primary,
    padding: 8,
  },
});
