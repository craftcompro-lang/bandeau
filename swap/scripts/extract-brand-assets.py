"""
Extrait les assets PROVISOIRES du logo SWAP depuis la charte graphique officielle
(docs/brand/charte-swap.png), sans redessiner le logo : on découpe la zone, puis on
retire le fond par "color-to-alpha" (la couleur de fond devient transparente).

À remplacer dès que possible par les exports officiels (SVG ou PNG haute définition).
Voir assets/brand/README.md.

Usage : python3 -I scripts/extract-brand-assets.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "brand" / "charte-swap.png"
OUT = ROOT / "assets" / "brand"
SCALE = 3  # agrandissement Lanczos pour un rendu plus doux sur écrans @3x


def color_to_alpha(rgb: np.ndarray, bg: np.ndarray) -> np.ndarray:
    """Rend `bg` transparent et dé-mélange les bords anti-aliasés."""
    p = rgb.astype(np.float64)
    b = bg.astype(np.float64)
    # Distance au fond : l'intérieur du logo (loin du fond) garde sa couleur exacte,
    # seuls les bords anti-aliasés deviennent semi-transparents.
    dist = np.max(np.abs(p - b), axis=2)
    lo, hi = 22.0, 110.0
    t = np.clip((dist - lo) / (hi - lo), 0, 1)
    alpha = t * t * (3 - 2 * t)  # smoothstep
    a = alpha[..., None]
    safe = np.where(a == 0, 1, a)
    color = np.clip((p - (1 - a) * b) / safe, 0, 255)
    out = np.dstack([color, alpha * 255]).astype(np.uint8)
    return out


def extract(box, name, bg_sample=None):
    im = Image.open(SRC).convert("RGB").crop(box)
    arr = np.asarray(im)
    if bg_sample is None:
        corners = np.concatenate(
            [arr[:3, :3].reshape(-1, 3), arr[-3:, -3:].reshape(-1, 3),
             arr[:3, -3:].reshape(-1, 3), arr[-3:, :3].reshape(-1, 3)]
        )
        bg = np.median(corners, axis=0)
    else:
        bg = np.array(bg_sample)
    rgba = Image.fromarray(color_to_alpha(arr, bg), "RGBA")
    bbox = rgba.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    rgba = rgba.crop(bbox)
    rgba = rgba.resize((rgba.width * SCALE, rgba.height * SCALE), Image.LANCZOS)
    rgba.save(OUT / name, optimize=True)
    print(f"{name}: {rgba.size}")
    return rgba


def monochrome(src: Image.Image, hex_color: str, name: str):
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (1, 3, 5))
    solid = Image.new("RGBA", src.size, (r, g, b, 255))
    solid.putalpha(src.getchannel("A"))
    solid.save(OUT / name, optimize=True)
    print(f"{name}: {solid.size}")


def app_icon(symbol: Image.Image, size: int, name: str, bg=(255, 255, 255, 255), ratio=0.62):
    canvas = Image.new("RGBA", (size, size), bg)
    target = int(size * ratio)
    s = symbol.copy()
    s.thumbnail((target, target), Image.LANCZOS)
    canvas.alpha_composite(s, ((size - s.width) // 2, (size - s.height) // 2))
    canvas.save(OUT / name, optimize=True)
    print(f"{name}: {canvas.size}")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    # Coordonnées mesurées sur la charte (1448 x 1086 px).
    wordmark = extract((38, 70, 482, 214), "swap-wordmark.png")
    extract((38, 70, 482, 266), "swap-logo-baseline.png")
    symbol = extract((552, 70, 744, 262), "swap-symbol.png")
    # Variante "sur fond sombre" telle qu'elle figure dans la charte (fond bleu nuit retiré).
    extract((818, 192, 1004, 258), "swap-wordmark-on-dark.png")
    monochrome(wordmark, "#0F172A", "swap-wordmark-mono.png")
    monochrome(wordmark, "#FFFFFF", "swap-wordmark-white.png")
    # Icônes provisoires (variante "Icône claire" de la charte).
    app_icon(symbol, 1024, "../icon.png")
    app_icon(symbol, 1024, "../android-icon-foreground.png", bg=(0, 0, 0, 0), ratio=0.5)
    app_icon(symbol, 1024, "../splash-icon.png", bg=(0, 0, 0, 0), ratio=0.9)
    app_icon(symbol, 48, "../favicon.png", ratio=0.8)
    mono_symbol = Image.new("RGBA", symbol.size, (255, 255, 255, 255))
    mono_symbol.putalpha(symbol.getchannel("A"))
    app_icon(mono_symbol, 1024, "../android-icon-monochrome.png", bg=(0, 0, 0, 0), ratio=0.5)
