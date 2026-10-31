"""Build index.html from src/app.html + data/catalog.b64 (the compressed medicine database)."""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
src = (root / "src/app.html").read_text().replace("__CATALOG__", (root / "data/catalog.b64").read_text())
head = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n'
(root / "index.html").write_text(head + src + "\n</body></html>\n")
print("Built index.html")
