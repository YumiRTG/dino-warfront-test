# Firestore rules for gift codes

Two collections. The important idea: **no client ever writes a reward value.**
The reward lives in `giftcodes/{CODE}`, which nothing but the Firebase console
can write. The website and the game only write an empty marker saying "this
account redeemed this code", and the game reads the reward from the code
document itself.

That means a forged request cannot invent a reward, and the worst a stranger can
do with someone's Account ID is give that person a free reward.

## Collections

```
giftcodes/{CODE}                    <- you create these, by hand or by script
  active      : bool                   false switches a code off instantly
  expiresAt   : timestamp              optional
  note        : string                 optional, shown on the website
  rewards     : map                    { food: 50000, wood: 50000, amber: 500 }

players/{uid}/redemptions/{CODE}    <- written by the website or the game
  code        : string
  createdAt   : timestamp
  granted     : bool                   the game flips this to true once paid out
  source      : string                 optional, "web"
```

Reward keys the game understands: `food`, `wood`, `iron`, `oil`, `amber`.
Anything else is ignored with a warning.

## Rules

Add these inside `match /databases/{database}/documents { ... }`, alongside your
existing rules.

```
// Gift codes are readable by anyone signed in, and writable by nobody.
// Create and edit them in the Firebase console.
match /giftcodes/{code} {
  allow read: if request.auth != null;
  allow write: if false;
}

// Redemption markers.
match /players/{uid}/redemptions/{code} {
  allow read: if request.auth != null;

  // Anyone signed in may mark a code as redeemed for an account, because the
  // website has no way to prove who the account holder is. The marker carries
  // no reward, so this can only ever benefit the account owner.
  allow create: if request.auth != null
                && exists(/databases/$(database)/documents/giftcodes/$(code))
                && get(/databases/$(database)/documents/giftcodes/$(code)).data.active == true
                && request.resource.data.granted == false
                && request.resource.data.code == code
                && request.resource.data.keys().hasOnly(['code', 'createdAt', 'granted', 'source']);

  // Only the account holder can mark it paid out, and may change nothing else.
  allow update: if request.auth != null
                && request.auth.uid == uid
                && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['granted'])
                && request.resource.data.granted == true;

  allow delete: if false;
}
```

## Creating a code

Firebase console, Firestore, collection `giftcodes`, document ID in capitals,
for example `DINO2026`:

| Field | Type | Value |
| --- | --- | --- |
| `active` | boolean | `true` |
| `note` | string | `Launch gift` |
| `expiresAt` | timestamp | *(optional)* |
| `rewards` | map | `food` number `50000`, `wood` number `50000`, `amber` number `500` |

The code is live the moment you save it. Set `active` to `false` to kill it.

## Wiring the game side

`Assets/Scripts/Social/GiftCodeService.cs` handles both directions:

- `GiftCodeService.Redeem("DINO2026")` for a code box inside the game.
- `GiftCodeService.ClaimPending()` collects everything redeemed on the website.
  Call it once after Firebase is ready, for example from the same place that
  runs the other post-login sync work:

```csharp
FirebaseManager.OnFirebaseReady += async () => {
    await GiftCodeService.ClaimPending();
};
```

`OnRewardGranted` fires per code with the reward map, which is the hook for a
popup or a mail entry.
