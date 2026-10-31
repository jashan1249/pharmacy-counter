# Pharmacy Counter (Beta)

Free billing and stock software for neighbourhood medical shops in India. It runs entirely in the browser: no server, no login, works offline once opened.

**Live beta:** https://jashan1249.github.io/pharmacy-counter/

## Features
- Fast billing: search by name, salt or barcode; loose tablet sale; cash, UPI and credit (udhaar)
- Billing-only mode (no stock needed) or full stock with batch and expiry
- Import stock from Excel (.xlsx) or CSV, with automatic column matching
- Built-in database of 2.4 lakh Indian medicines
- GST tax invoice, composition (bill of supply) or unregistered; A4, A5 and thermal printing
- Returns and credit notes, bill edit, Schedule H1 register, day close, GST report
- WhatsApp bills and payment reminders
- Auto backup to a folder, daily copies in the browser, day/night theme

## Data and privacy
All shop data stays in the browser on the device (IndexedDB). Nothing is sent to any server. Testers should set up the auto-backup folder in Settings.

## Development
- `src/app.html` is the app source.
- `data/catalog.b64` is the compressed medicine database.
- Run `python3 tools/build.py` to produce `index.html`, the file GitHub Pages serves.

## Credits
Medicine data: [Indian Medicine Dataset](https://github.com/junioralive/Indian-Medicine-Dataset) by JuniorAlive, MIT License (see `data/MEDICINE-DATASET-LICENSE.txt`). Prices in the dataset are for reference only; always check the MRP on the pack.
