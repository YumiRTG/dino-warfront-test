# Firestore rules for website login (Account ID only)

Website login:

1. User enters **Account ID** = game Firebase User ID (`players/{userId}`)
2. Website reads `players/{userId}.displayName` (commander name from the game)
3. **No create account** on the website
4. **No password**

## Required rules

Allow authenticated clients (anonymous auth is OK) to **read** player docs:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /players/{userId} {
      // Website login needs to read displayName by Account ID
      allow read: if request.auth != null;

      // Keep your existing write rules for the game client
      // e.g. allow write: if request.auth != null && request.auth.uid == userId;
    }

    // ... your alliances / friends rules ...
  }
}
```

## Firebase Console

1. **Authentication → Sign-in method → Anonymous → Enable** (website uses anonymous auth only to satisfy `request.auth != null`)
2. Publish the `players` read rule above

## Note

Knowing someone’s Account ID lets them open a website session as that commander name (passwordless by design). Do not treat this as strong security for sensitive actions.
