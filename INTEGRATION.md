# Bulldogs Exchange client integration

Set the API base URL before starting the app. Copy `.env.example` to `.env` and update the URL for your server:

```env
VITE_API_URL=http://localhost:5000/api
```

For local backend development, copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. The backend URI should use the `bulldogs_exchange` database. Never put database credentials in a `VITE_` variable because Vite exposes those values to the browser.

For Vercel, set `MONGODB_URI` and the other backend secrets in the project's encrypted environment settings, and set `VITE_API_URL=/api` for the client build. Do not commit `.env` files or replace the placeholders in tracked examples with real credentials.

Product uploads are stored in Atlas GridFS rather than the backend's temporary filesystem. Images must be 4 MB or smaller.

The client sends JSON and includes `Authorization: Bearer <JWT>` after sign-in. It expects these conventional REST endpoints:

| Feature | Endpoint |
| --- | --- |
| Authentication | `POST /auth/login`, `POST /auth/register`, `GET/PATCH /auth/me`, `PATCH /auth/change-password` |
| Products | `GET/POST /products`, `GET/PATCH /products/:id` |
| Orders | `GET/POST /orders`, `PATCH /orders/:id` |
| Reviews | `GET /products/:id/reviews`, `POST /products/:id/reviews`, `GET/PATCH /reviews/:id` |
| Users | `GET /users`, `PATCH /users/:id` |

Successful login/register responses must contain a `token` (or `accessToken`) and a `user` (or `account`) object. User data needs a `role` of `admin` or `customer`; admin routes are blocked on the client for every other role. API errors should return a JSON `message` so the UI can show a useful error.

## Before submission

1. Start MongoDB and the backend, create customer and admin accounts, then set the correct `VITE_API_URL`.
2. Test both roles: customer registration/login, product search/category filter, review, cart/order, profile and logout; then admin product CRUD, order status changes, review edit, and user active/inactive controls.
3. If your backend uses different route names or field names, update only `src/services/api.js` and the documented response-field adapters in the page components.
4. Capture screenshots/output for each requirement, paste the relevant source-file names and screenshots into the provided Word template, complete your name/section, and export it as `Surname_LongExam1_CTADWEBL.pdf`.
