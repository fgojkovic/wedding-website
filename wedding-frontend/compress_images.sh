#!/bin/bash
# Batch compress and convert all JPG/JPEG/PNG images in public/images/fm/ to WebP and optimized JPEG
# Requires: imagemagick, cwebp, jpegoptim

SRC_DIR="$(dirname "$0")/public/images/fm"
WEBP_DIR="$SRC_DIR/webp"
JPEG_QUALITY=80
WEBP_QUALITY=80

mkdir -p "$WEBP_DIR"

for img in "$SRC_DIR"/*.{jpg,jpeg,JPG,JPEG,png,PNG}; do
  [ -e "$img" ] || continue
  fname=$(basename "$img")
  name="${fname%.*}"

  # Convert to WebP
  cwebp -q $WEBP_QUALITY "$img" -o "$WEBP_DIR/$name.webp"

  # Compress JPEG (skip PNG)
  if [[ "$img" == *.jpg || "$img" == *.jpeg || "$img" == *.JPG || "$img" == *.JPEG ]]; then
    jpegoptim --max=$JPEG_QUALITY --strip-all --all-progressive "$img"
  fi

done
