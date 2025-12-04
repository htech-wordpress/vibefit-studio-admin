# Gym Admin Panel - Deployment Guide

## SuperAdmin Deployment Process

When deploying this admin panel for a gym, the SuperAdmin needs to configure the project collection.

### Step 1: Determine Project Type

**Question:** Is this admin panel for an existing user site?

#### Option A: New Project (No existing site)
- The admin panel will create a new project collection
- Collection name will be the project name provided during setup
- Example: `my-gym-project`

#### Option B: Existing User Site
- The admin panel will connect to an existing project collection
- SuperAdmin must provide the existing collection name
- Example: `existing-gym-123`

### Step 2: Configure Environment Variables

Create a `.env` file with the following:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Project Collection Name
# For NEW projects: use the new project name
# For EXISTING projects: use the existing collection name
VITE_PROJECT_ID=project-collection-name
```

### Step 3: Firestore Structure

All data will be stored under:
```
projects/
  └── {VITE_PROJECT_ID}/
      ├── inquiries/          # Customer inquiries
      ├── programs/           # Gym programs
      ├── gallery/            # Gallery images
      ├── testimonials/       # Customer testimonials
      └── settings/           # Settings (whatsapp, social)
          ├── whatsapp
          └── social
```

### Step 4: Deploy

1. Set the `VITE_PROJECT_ID` in `.env`
2. Build the project: `npm run build`
3. Deploy to Firebase Hosting or your preferred platform

## For SuperAdmin Panel Integration

When creating an admin site from the SuperAdmin panel:

1. **Ask the user:**
   - "Is this for an existing user site?"
   - If YES: "Enter the existing project collection name"
   - If NO: "Enter a new project name"

2. **Generate `.env` file** with the provided collection name

3. **Deploy** the admin panel with the configured environment

## Example SuperAdmin Flow

```typescript
// In SuperAdmin panel
const createAdminSite = async (formData) => {
  const isExisting = formData.isExistingProject;
  const projectId = isExisting 
    ? formData.existingCollectionName 
    : formData.newProjectName;
  
  // Generate .env with VITE_PROJECT_ID=projectId
  // Deploy admin panel
  // Return admin panel URL
};
```

## Data Access

All data operations automatically use the configured `VITE_PROJECT_ID`:

```typescript
import { customerService } from './services/dataService';

// Automatically reads/writes to:
// projects/{VITE_PROJECT_ID}/inquiries
const customers = await customerService.fetchAll();
```

## Security Rules

Ensure Firestore security rules allow access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
