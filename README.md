# Gym Admin Panel

Admin panel for managing gym website content.

## Environment Variables

This project requires the following environment variables:

### Project-Specific ID
- `VITE_PROJECT_ID` - Unique identifier for the gym project (e.g., "my-gym-project")

### Firebase Configuration
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values
3. Run `npm install`
4. Run `npm run dev`

## Deployment

This project uses GitHub Actions for automatic deployment to Firebase Hosting.

### Required GitHub Secrets

Set the following secrets in your GitHub repository (Settings → Secrets and variables → Actions):

- `VITE_PROJECT_ID` - Project-specific ID
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON (for deployment)

### Automatic Deployment

The project automatically deploys to Firebase Hosting when:
- Code is pushed to the `main` branch
- Manually triggered via GitHub Actions "Run workflow" button

## Data Sync

This admin panel automatically syncs data to `projects/{projectId}/website/gymProData` in Firestore after any save/update/delete operation. This ensures the gym user template (`gym-pro-main`) can fetch the latest data.
