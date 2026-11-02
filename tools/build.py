"""Build the app.

- app/index.html : the hosted app (loads assets/config.js + assets/cloud.js for login and cloud sync)
- dist/standalone.html : offline single file with no login (for shops without internet or for testing)

The medicine database (data/catalog.b64) is embedded in both.
"""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = (root / "src/app.html").read_text().replace("__CATALOG__", (root / "data/catalog.b64").read_text())
head = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<link rel="icon" href="../assets/icon.svg"></head><body>\n')
cloud = '<script src="../assets/config.js"></script>\n<script src="../assets/cloud.js"></script>'

(root / "app").mkdir(exist_ok=True)
(root / "app/index.html").write_text(head + src.replace("<!--CLOUD-->", cloud) + "\n</body></html>\n")
(root / "dist").mkdir(exist_ok=True)
(root / "dist/standalone.html").write_text(head.replace('<link rel="icon" href="../assets/icon.svg">', '')
                                           + src.replace("<!--CLOUD-->", "") + "\n</body></html>\n")
print("Built app/index.html and dist/standalone.html")
