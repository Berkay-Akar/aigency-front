export function formatGenerationErrorMessage(
  raw: string | null,
  t: (key: string) => string
): string | null {
  if (!raw) return null;
  if (raw === "PROMPT_TOO_SHORT") return t("promptTooShort");
  if (raw === "NEED_HTTPS_REFERENCES" || raw === "NEED_REFERENCE_IMAGE")
    return t("selectReferenceForI2I");
  if (raw === "REFERENCE_PREPARE_FAILED") return t("referencePrepareFailed");
  if (raw === "INSUFFICIENT_CREDITS") return t("insufficientCreditsBody");
  if (raw === "GENERATE_REQUEST_FAILED") return t("generateFailed");
  return raw;
}
