export function applyPhoneMask(value: string | undefined | null): string {
  if (!value) return "";

  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 10) {
    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  } else {
    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  }
}

export function applyCNPJMask(value: string | undefined | null): string {
  if (!value) return "";

  const numbers = value.replace(/\D/g, "");

  return numbers
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
}

export function applyCEPMask(value: string | undefined | null): string {
  if (!value) return "";

  const numbers = value.replace(/\D/g, "");

  return numbers.replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
}

export function removeSpecialCharacters(value: string): string {
  if (!value) return "";
  return value.replace(/[.\-/() ]/g, "");
}

export function formatForBackend(value: string): string {
  return removeSpecialCharacters(value);
}
