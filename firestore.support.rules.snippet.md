# Firestore rules for website support tickets

Add this block so the chat form can save tickets even when email fails.
You can read tickets in Firebase Console → Firestore → `supportTickets`.

```
match /supportTickets/{ticketId} {
  // Website (anonymous auth) may create tickets only
  allow create: if request.auth != null
    && request.resource.data.email is string
    && request.resource.data.message is string
    && request.resource.data.message.size() >= 5
    && request.resource.data.message.size() <= 4000;

  // Read/update only via Firebase Console (admin) / Admin SDK
  allow read, update, delete: if false;
}
```

## Steps

1. Firebase Console → Firestore → Rules  
2. Paste the match block inside your existing `match /databases/{database}/documents { ... }`  
3. Publish  
