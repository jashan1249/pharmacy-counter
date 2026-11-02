# Pharmacy Counter: User stories (beta)

What "done" means for the beta. Each story has acceptance criteria that can be checked by hand or by the test suite.
Status: **Done** = built and tested · **Beta** = built in this release · **Next** = planned after beta feedback.

## Personas
| Persona | Who | What they need most |
|---|---|---|
| **Rajesh, owner** (primary) | 48, single shop in Mansa, 60–100 bills a day, Hindi/Punjabi, basic computer use | Start without training, fast bills, no lost udhaar, no expiry losses |
| **Aman, counter staff** | 20, bills during the evening rush | Fast search, few mistakes, cash that matches |
| **Simran, next generation** | 27, B.Pharm, taking over the shop | WhatsApp bills, numbers on what sells |
| **SVM Pharma, small wholesaler** | Supplies clinics on credit | Party ledgers, estimates, reminders |
| **You, the founder** | Runs the beta | See who signed up and who is active |

---

## Epic A. Discover and sign up
**A1. Understand the product in 30 seconds** (Rajesh) · Done
As a chemist who found the website, I want to see what it does and what it costs so I can decide to try it.
- Home page says: free, no AMC, works offline, medicines built in, in the first screen.
- A real screenshot of the billing screen is visible on laptop and phone.
- "Start free" is visible without scrolling on a 1366×768 laptop and a phone.

**A2. Create an account in under 2 minutes** (Rajesh) · Done
- Sign-up asks only shop name, mobile, city, email, password.
- Errors are in plain words (wrong password, email already used, weak password, no internet).
- After sign-up the user lands in shop setup with the shop name already filled.

**A3. Get back in if I forget my password** · Done
- "Forgot password" sends a reset link; the link opens a "Set new password" form, then the app.

## Epic B. First day
**B1. Set up the shop in one screen** (Rajesh) · Done
- Choose Billing only / Billing + stock, GST type and printer by tapping cards.
- Hindi hint under each choice. · Beta
- A "Test print" button prints a sample bill on the chosen paper. · Beta

**B2. Use the app in Hindi** (Rajesh) · Beta
- A language switch (English / हिंदी) in the menu and in setup.
- Menu, home, setup, new bill, totals, common buttons and messages appear in Hindi.
- Medicine names, numbers and bill print stay in English (as on the strip).

**B3. Be guided to my first bill** (Rajesh) · Beta
- The first time the bill screen opens, a 3-step guide shows: search → quantity → save & print.
- The guide can be closed and does not come back.

**B4. Bring my stock from my old software** (Rajesh) · Done
- Import .xlsx or .csv; columns matched automatically; preview before import.
- Or skip stock entirely with Billing only mode.

**B5. Understand unfamiliar words** (Rajesh) · Beta
- Terms like HSN, composition, reorder level, Schedule H1 have a short plain explanation next to them.

## Epic C. Billing at the counter
**C1. Bill a customer in under 30 seconds** (Aman) · Done
- Type 3+ letters (typos allowed) or scan a barcode; Enter adds; F10 saves and prints.
- Oldest-expiry batch is picked; expired batches cannot be sold.
- Rate above MRP is blocked.

**C2. Bill even when stock is not entered or is wrong** (Aman) · Done
- Out-of-stock or database medicines can still be billed, with a visible note.

**C3. Sell loose tablets** · Done
**C4. Cash, UPI or udhaar, with change to return** · Done
**C5. Repeat a regular patient's last bill** · Done
**C6. Fix a mistake: edit, return or cancel a bill** · Done (all changes logged)
**C7. Send the bill on WhatsApp** · Done
**C8. Print on A4, A5 or thermal** · Done

## Epic D. Money and stock
**D1. See who owes me and remind them** (Rajesh) · Done
**D2. Enter a supplier bill without a 13-column table** (Rajesh) · Beta
- Purchase screen has a Simple view (medicine, batch, expiry, qty, MRP, rate) by default; Full view shows all columns.
**D3. Know what expires soon and what to reorder** · Done
**D4. Close the day and match my cash drawer** · Done
**D5. GST summary for my CA** · Done

## Epic E. Trust and data
**E1. Never lose my records** · Done
- Saved on the computer instantly; synced to the cloud; 14 daily cloud copies; manual backup file.
**E2. Keep billing when the internet is down** · Done
**E3. Use the same account on a second computer** · Done (beta caveat: avoid billing on both at the same second)
**E4. My data is private** · Done
- Each shop sees only its own records; the founder sees shop details and counts only.

## Epic F. Ease of use
**F1. Readable on a shop laptop** · Beta
- Default text is 16px; the bill screen fits a 1366×768 screen without sideways scrolling.
**F2. Not overwhelmed by reports** · Beta
- Main report tabs: Sales, Day close, GST, Expiry, Low stock. The rest sit under "More".
**F3. Empty pages tell me what to do** · Beta
- Medicines, Customers and Reports show a short next step when empty.
**F4. Day and night mode** · Done

## Epic G. Founder
**G1. See all shops, activity and usage** · Done
**G2. Switch a shop to Pro** · Done
**G3. Download the shop list** · Done

## Next (after beta feedback)
- Punjabi language
- Phone OTP login
- Drug-interaction alerts, refill reminders, loyalty points
- Distributor order on WhatsApp, prescription photo
- Staff logins and roles, Tally export, payments for Pro
