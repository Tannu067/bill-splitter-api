# Bill Splitter API

A REST API for splitting expenses in groups — think Splitwise, but built from scratch. I wanted to build something purely backend and logic-heavy that goes beyond typical CRUD, so I chose this.

**Stack:** Node.js · Express · MongoDB · JWT Auth

---

## What it does

- Register and login with JWT-based auth
- Create groups and add members by email
- Add expenses — tracks who paid and who it's split among
- Auto-calculates net balances (not per-expense, the final simplified "X owes Y" view)
- Settle all debts in a group with one call

---

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get token |

### Groups
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/groups | Create a group |
| GET | /api/groups/my | Get all groups you're in |
| PUT | /api/groups/:id/add-member | Add member to group |

### Expenses
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/expenses | Add an expense |
| GET | /api/expenses/group/:groupId | Get all expenses in a group |
| GET | /api/expenses/balances/:groupId | Get simplified who-owes-whom |
| PUT | /api/expenses/settle/:groupId | Mark all expenses as settled |

---

## The interesting part — balance calculation

The balance logic was the hardest part to get right. The naive approach is just listing every debt per expense, but that creates a mess when there are 10 expenses. Instead I built a net balance map — every person starts at 0, gets credited when they pay, and debited their share when they're in a split. At the end you just read off who's positive (owed money) and who's negative (owes money). Way cleaner.

---

## How to run locally

```bash
git clone https://github.com/Tannu067/bill-splitter-api.git
cd bill-splitter-api
npm install
cp .env.example .env
# add your MongoDB URI and JWT secret in .env
npm run dev
```

Server runs at `http://localhost:5000`

---

## What I learned

This was my first purely backend project with no frontend at all. Figuring out the balance calculation algorithm took the most time — I went through two approaches before landing on the net balance map. Also got more comfortable with middleware — the auth middleware pattern here is something I'd use in any future project. Postman was used throughout to test every route.

---

## Test with Postman

1. Register two users
2. Login to get token — add as `Bearer <token>` in Authorization header
3. Create a group with both users
4. Add a few expenses
5. Hit `/api/expenses/balances/:groupId` to see who owes whom

---

*Built by Tannu Kumari | IGDTUW Delhi | 2026 Batch*
