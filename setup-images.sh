#!/bin/bash
# ============================================================
# Can Beteigeuze — Image setup script
# Run this once from the 'website' folder to copy and rename
# the source photos to website/img/
# Usage: bash setup-images.sh
# ============================================================

SRC="../foto's jpg"
DST="./img"

echo "Copying photos from '$SRC' to '$DST'..."

# --- Hero & key shots ---
cp "$SRC/hero.jpg"                                    "$DST/hero.jpg"
cp "$SRC/view 1.jpg"                                  "$DST/view-1.jpg"
cp "$SRC/view b.jpg"                                  "$DST/view-b.jpg"
cp "$SRC/sunset.jpg"                                  "$DST/sunset.jpg"
cp "$SRC/cala vadella.jpg"                            "$DST/cala-vadella.jpg"

# --- Exterior ---
cp "$SRC/DJI_20250422215726_0372_D-Edit.jpg"          "$DST/house-aerial.jpg"
cp "$SRC/house h.jpg"                                 "$DST/house-front.jpg"
cp "$SRC/DJI_0066-Edit.jpg"                           "$DST/es-vedra.jpg"  2>/dev/null || echo "es-vedra: file too large, resize manually"

# --- Terrace ---
cp "$SRC/terrace e.jpg"                               "$DST/terrace-evening.jpg"
cp "$SRC/terrace d.jpg"                               "$DST/terrace-lounge.jpg"
cp "$SRC/terrace e-2.jpg"                             "$DST/terrace-dining.jpg"

# --- Living spaces ---
cp "$SRC/living 2.jpg"                                "$DST/living.jpg"
cp "$SRC/living 1.jpg"                                "$DST/living-2.jpg"
cp "$SRC/kitchen 1.jpg"                               "$DST/kitchen.jpg"

# --- Bedrooms ---
cp "$SRC/bedroom 1.jpg"                               "$DST/bedroom-1.jpg"
cp "$SRC/bedroom 2.jpg"                               "$DST/bedroom-2.jpg"
cp "$SRC/bedroom 3.jpg"                               "$DST/bedroom-3.jpg"

# --- Bathrooms ---
cp "$SRC/bathroom 1.jpg"                              "$DST/bathroom-1.jpg"
cp "$SRC/bathroom 2.jpg"                              "$DST/bathroom-2.jpg"

# --- Surroundings ---
cp "$SRC/HDR_0001-21-Edit.jpg"                        "$DST/coastline.jpg"
cp "$SRC/pano cala dhort.jpg"                         "$DST/cala-dhort.jpg"

echo ""
echo "Done! Files copied to $DST/"
echo ""
echo "NEXT STEP: Optimise images for web (max 200 KB, WebP format)."
echo "Recommended tool: https://squoosh.app or:"
echo "  for f in img/*.jpg; do cwebp -q 82 \"\$f\" -o \"\${f%.jpg}.webp\"; done"
echo ""
echo "Then update all <img src=> references in HTML from .jpg to .webp"
