# Firestore rules for website roulette → game inventory

Website writes pending speed ups to:
- `webRewards/{accountId}/items/{rewardId}`
- `webRouletteSpins/{accountId}` (cooldown)

Unity `WebRewardService` claims items when the player is online.

## Rules (merge into existing)

```
match /webRewards/{userId}/items/{itemId} {
  // Website (any signed-in / anonymous) can create pending rewards
  allow create: if request.auth != null
    && request.resource.data.claimed == false
    && request.resource.data.keys().hasAll(['itemType', 'amount', 'claimed', 'source']);

  // Anyone signed in can read (website status / game claim query)
  allow read: if request.auth != null;

  // Only the game owner (same Firebase uid as userId) marks claimed
  allow update: if request.auth != null
    && request.auth.uid == userId
    && request.resource.data.claimed == true;

  allow delete: if false;
}

match /webRouletteSpins/{userId} {
  allow read, write: if request.auth != null;
}

match /webDailyLogin/{userId} {
  allow read, write: if request.auth != null;
}
```

## Unity

`Assets/Scripts/Core/WebRewardService.cs` polls unclaimed rewards every ~20s after Firebase is ready and calls `InventoryManager.AddItem`.

Daily login and roulette both write to `webRewards/{userId}/items`.
