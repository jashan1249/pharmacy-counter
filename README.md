# Pharmacy Counter (Beta)

Free billing and stock software for neighbourhood medical stores in India.

**Website:** https://jashan1249.github.io/pharmacy-counter/
**App:** https://jashan1249.github.io/pharmacy-counter/app/

## What's here
| Path | What it is |
|---|---|
| `index.html`, `pricing.html`, `help.html` | Public website |
| `login.html` | Log in, create account, reset password |
| `admin.html` | Owner panel: every shop, usage, plan (admins only) |
| `app/index.html` | The billing app (built file, do not edit by hand) |
| `src/app.html` | App source |
| `assets/config.js` | Supabase keys and WhatsApp number |
| `assets/cloud.js` | Login and cloud sync client (Supabase REST, no library) |
| `supabase/schema.sql` | Database tables and security rules |
| `dist/standalone.html` | Offline single-file version with no login |
| `data/catalog.b64` | Compressed database of 2.4 lakh Indian medicines |

## How data works
- The app is offline-first: records are saved in the browser (IndexedDB) and billing never waits for the internet.
- With accounts switched on, each shop's records sync to Supabase after changes, and a daily copy is kept for 14 days.
- Database rules let each login read and write only its own shop. Admins see shop details and usage counts, never bills or patients.
- Two computers on one account merge their records by ID; the newer copy wins when the same record changed on both.

## Switching on accounts
Follow [SETUP.md](SETUP.md). Until then the site runs in local mode with no login.

## Development
```
python3 tools/build.py   # builds app/index.html and dist/standalone.html from src/app.html
```

## Credits
Medicine data: [Indian Medicine Dataset](https://github.com/junioralive/Indian-Medicine-Dataset) by JuniorAlive, MIT License (`data/MEDICINE-DATASET-LICENSE.txt`). Prices are for reference only; always check the MRP on the pack.
