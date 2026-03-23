#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
APPLY=0

usage() {
  cat <<'USAGE'
Usage: cleanup-generated-files.sh [--apply] [--root <path>]

Removes common generated artifacts that are not tracked by git.
Default mode is dry-run.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)
      APPLY=1
      shift
      ;;
    --root)
      if [[ $# -lt 2 ]]; then
        echo "Error: --root requires a path." >&2
        exit 1
      fi
      ROOT="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Error: unknown argument '$1'." >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$ROOT" ]]; then
  echo "Error: root path '$ROOT' does not exist." >&2
  exit 1
fi

if ! git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: '$ROOT' is not a git repository." >&2
  exit 1
fi

declare -a targets=()

while IFS= read -r -d '' path; do
  rel="${path#"$ROOT/"}"
  if git -C "$ROOT" ls-files -- "$rel" | grep -q .; then
    continue
  fi
  targets+=("$path")
done < <(find "$ROOT" -name .git -type d -prune -o \( -type d \( -name node_modules -o -name .next -o -name .turbo -o -name coverage -o -name .cache -o -name .pytest_cache -o -name __pycache__ -o -name .mypy_cache -o -name .ruff_cache -o -name .parcel-cache -o -name dist -o -name build -o -name out -o -name tmp -o -name temp \) -print0 -prune \) -o \( -type d -path '*/.vercel/output' -print0 -prune \))

while IFS= read -r -d '' path; do
  rel="${path#"$ROOT/"}"
  if git -C "$ROOT" ls-files --error-unmatch -- "$rel" >/dev/null 2>&1; then
    continue
  fi
  targets+=("$path")
done < <(find "$ROOT" -name .git -type d -prune -o \( -type d \( -name node_modules -o -name .next -o -name .turbo -o -name coverage -o -name .cache -o -name .pytest_cache -o -name __pycache__ -o -name .mypy_cache -o -name .ruff_cache -o -name .parcel-cache -o -name dist -o -name build -o -name out -o -name tmp -o -name temp \) -prune \) -o \( -type d -path '*/.vercel/output' -prune \) -o \( -type f \( -name '.DS_Store' -o -name '*.log' \) -print0 \))

if [[ ${#targets[@]} -eq 0 ]]; then
  echo "No generated cleanup targets found under $ROOT"
  exit 0
fi

printf 'Cleanup targets under %s:\n' "$ROOT"
printf ' - %s\n' "${targets[@]}"

if [[ "$APPLY" -eq 0 ]]; then
  echo "Dry run only. Re-run with --apply to delete these paths."
  exit 0
fi

for target in "${targets[@]}"; do
  rm -rf "$target"
done

echo "Deleted ${#targets[@]} generated target(s)."
