# Gym Admin Panel - SuperAdmin Integration Guide

## Creating Admin Users for Projects

When a SuperAdmin creates an admin panel for a gym, they need to create an admin user with proper role and project access.

### Firestore Structure for Admin Users

```
projects/
  └── {projectId}/
      ├── admins/              # Admin users for this project
      │   └── {userId}/        # Firebase Auth UID
      │       ├── role: "admin"
      │       ├── projectId: "{projectId}"
      │       ├── email: "admin@gym.com"
      │       └── createdAt: timestamp
      ├── inquiries/
      ├── programs/
      └── ...
```

## SuperAdmin Workflow

### Step 1: Create Admin Panel Project

```typescript
// In SuperAdmin panel
const createAdminPanel = async (formData) => {
  // 1. Ask if existing or new project
  const isExisting = formData.isExistingProject;
  const projectId = isExisting 
    ? formData.existingCollectionName 
    : formData.newProjectName;
  
  // 2. Create admin user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth, 
    formData.adminEmail, 
    formData.adminPassword
  );
  
  const userId = userCredential.user.uid;
  
  // 3. Create admin user document in Firestore
  await setDoc(doc(db, 'projects', projectId, 'admins', userId), {
    role: 'admin',
    projectId: projectId,
    email: formData.adminEmail,
    createdAt: serverTimestamp()
  });
  
  // 4. Generate .env file with VITE_PROJECT_ID
  const envContent = `
VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}

# Project Collection Name
VITE_PROJECT_ID=${projectId}
  `;
  
  // 5. Deploy admin panel
  // 6. Return admin panel URL and credentials
  
  return {
    adminPanelUrl: `https://${projectId}-admin.web.app`,
    adminEmail: formData.adminEmail,
    adminPassword: formData.adminPassword
  };
};
```

### Step 2: Admin User Login Flow

1. **Admin visits admin panel URL**
2. **Enters email and password**
3. **System verifies:**
   - ✅ Firebase Auth credentials
   - ✅ User exists in `projects/{projectId}/admins/{userId}`
   - ✅ User has `role: "admin"`
   - ✅ User's `projectId` matches `VITE_PROJECT_ID`
4. **If all checks pass:** Grant access
5. **If any check fails:** Show "Access Denied"

## Security Rules

Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      // Admin users collection
      match /admins/{userId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if false; // Only SuperAdmin can write
      }
      
      // Other collections (inquiries, programs, etc.)
      match /{collection}/{document=**} {
        allow read, write: if request.auth != null && 
          exists(/databases/$(database)/documents/projects/$(projectId)/admins/$(request.auth.uid)) &&
          get(/databases/$(database)/documents/projects/$(projectId)/admins/$(request.auth.uid)).data.role == 'admin';
      }
    }
  }
}
```

## Example: Creating Admin User

```typescript
// SuperAdmin creates admin user for "my-gym-project"
const projectId = "my-gym-project";
const adminEmail = "admin@mygym.com";
const adminPassword = "SecurePassword123!";

// 1. Create in Firebase Auth
const userCredential = await createUserWithEmailAndPassword(
  auth, 
  adminEmail, 
  adminPassword
);

// 2. Create admin document
await setDoc(
  doc(db, 'projects', projectId, 'admins', userCredential.user.uid),
  {
    role: 'admin',
    projectId: projectId,
    email: adminEmail,
    createdAt: serverTimestamp()
  }
);

// 3. Deploy admin panel with VITE_PROJECT_ID=my-gym-project
```

## Admin User Access Verification

When admin logs in, the system:

1. **Authenticates** with Firebase Auth
2. **Fetches** admin document from `projects/{VITE_PROJECT_ID}/admins/{userId}`
3. **Verifies:**
   ```typescript
   - Document exists ✓
   - role === 'admin' ✓
   - projectId === VITE_PROJECT_ID ✓
   ```
4. **Grants/Denies** access accordingly

## Benefits

✅ **Multi-tenant isolation:** Each admin can only access their project
✅ **Role-based access:** Only users with `role: "admin"` can access
✅ **Project verification:** Admin must belong to the specific project
✅ **Secure:** No cross-project data access
✅ **Scalable:** Easy to add more admins per project

## Adding Additional Admins

To add more admins to an existing project:

```typescript
// Create new admin user
const newUserCredential = await createUserWithEmailAndPassword(
  auth, 
  "admin2@mygym.com", 
  "Password123!"
);

// Add to project admins
await setDoc(
  doc(db, 'projects', projectId, 'admins', newUserCredential.user.uid),
  {
    role: 'admin',
    projectId: projectId,
    email: "admin2@mygym.com",
    createdAt: serverTimestamp()
  }
);
```

## Troubleshooting

**Issue:** "Access Denied" after login
- ✓ Check `VITE_PROJECT_ID` matches project in Firestore
- ✓ Verify admin document exists in `projects/{projectId}/admins/{userId}`
- ✓ Confirm `role: "admin"` in admin document
- ✓ Ensure `projectId` in admin document matches `VITE_PROJECT_ID`

**Issue:** Can't login at all
- ✓ Verify Firebase Auth credentials are correct
- ✓ Check Firebase Auth is enabled in Firebase Console
- ✓ Confirm user exists in Firebase Auth
