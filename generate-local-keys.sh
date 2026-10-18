#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="${SCRIPT_DIR}/backend/src/main/resources"
PRIVATE_KEY="${DEST_DIR}/private.pem"
PUBLIC_KEY="${DEST_DIR}/public.pem"

if [[ -e "$PRIVATE_KEY" || -e "$PUBLIC_KEY" ]]; then
    if [[ -f "$PRIVATE_KEY" && -f "$PUBLIC_KEY" ]]; then
        chmod 600 "$PRIVATE_KEY"
        chmod 644 "$PUBLIC_KEY"
        echo "Key pair already exists in $DEST_DIR; keeping it unchanged."
        exit 0
    fi
    echo "Only one key file exists in $DEST_DIR; refusing to replace it." >&2
    exit 1
fi

umask 077
mkdir -p -- "$DEST_DIR"
trap 'rm -f -- "$PRIVATE_KEY" "$PUBLIC_KEY"' ERR

openssl genpkey -quiet -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$PRIVATE_KEY"
openssl pkey -in "$PRIVATE_KEY" -pubout -out "$PUBLIC_KEY"
chmod 600 "$PRIVATE_KEY"
chmod 644 "$PUBLIC_KEY"
trap - ERR

echo "Generated private.pem and public.pem in $DEST_DIR."
