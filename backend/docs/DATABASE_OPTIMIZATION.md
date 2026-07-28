# Database Optimization & Security Guide

## Overview
HomeMart utilizes MongoDB with Mongoose ORM for high-performance data operations, strict schema enforcement, and optimized index strategies.

## Indexes Created & Optimized (Issue #3)

### 1. User Collection (`users`)
- `{ email: 1 }` (Unique Index) for instant login lookups and preventing duplicate accounts.
- `{ familyId: 1 }` for joining family queries.

### 2. Family Collection (`families`)
- `{ inviteCode: 1 }` (Unique Index) for instant permanent invite code lookups.
- `{ ownerId: 1 }` for owner family management queries.

### 3. Shopping List Collection (`shoppinglists`)
- `{ familyId: 1, isArchived: 1 }` (Compound Index) to accelerate active family shopping list retrieval.

### 4. Shopping Item Collection (`shoppingitems`)
- `{ listId: 1, isPurchased: 1 }` (Compound Index) for rapid list rendering ordered by pending vs bought items.
- `{ name: "text" }` (Text Index) for full-text search capability across shopping items.
- `{ clientItemId: 1 }` for offline sync duplicate detection and deduplication.

### 5. Notification Collection (`notifications`)
- `{ userId: 1, isRead: 1 }` (Compound Index) for unread notification count queries.

---

## Schema Validation & Security
1. **Mongoose Schema Types**: Enforced enums for roles (`ADMIN`, `MEMBER`), categories (`Produce`, `Dairy`, `Meat`, etc.), priorities (`LOW`, `MEDIUM`, `HIGH`), and notification types.
2. **Password Filtering**: Password field configured with `select: false` to prevent leaking password hashes in general queries.
3. **Trim & Length Controls**: All string inputs strictly trimmed and length bounded.
