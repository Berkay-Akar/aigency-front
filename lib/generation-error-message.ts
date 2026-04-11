export function formatGenerationErrorMessage(
  raw: string | null,
  t: (key: string) => string
): string | null {
  if (!raw) return null;
  if (raw === "PROMPT_TOO_SHORT") return t("promptTooShort");
  if (raw === "NEED_HTTPS_REFERENCES") return t("selectReferenceForI2I");
  if (raw === "GENERATE_REQUEST_FAILED") return t("generateFailed");
  return raw;
}
