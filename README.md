# Cove

Cove is an independent Expo prototype for exploring fractional real-estate investing. It uses fictional property listings and a simulated portfolio; it is not affiliated with any real-estate investment provider and does not provide financial services.

## Run the mobile app

```bash
npm install
npx expo start
```

By default, the app runs in demo mode with sample listings. Property details, saved listings, and simulated contributions are available without an API server. Demo contributions and favorites are saved locally on the device.

## Run with the catalog API

Start the backend from the `backend` directory (see [backend setup](../backend/README.md)), then set `EXPO_PUBLIC_API_URL` in a local `.env` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:5001
```

Use an address reachable from the device or emulator when running on hardware. If a configured API is unavailable, the app reports the error rather than silently switching to sample data.

## Included screens and flows

- Property discovery, sample listing details, and a saved-property shortlist
- Demo amount entry, estimate review, and a simulated portfolio entry
- Portfolio summary, local activity history, and local demo-data reset
- Clear disclosures that no funds, orders, ownership, or actual returns are created

## Production work still required

The backend currently exposes only the health check and fictional property catalog. The database schema is a foundation, not a deployed financial service. Before handling real users or money, integrate a trusted identity provider, server-side authorization, KYC/AML and sanctions checks, regulated investment operations and disclosures, payment/custody providers, auditable ledger and reconciliation, monitoring, and jurisdiction-specific legal review. Do not treat the local demo portfolio as a source of truth.
