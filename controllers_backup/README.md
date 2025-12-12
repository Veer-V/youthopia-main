# Old Controllers - Backup

This folder contains the old controller files that have been replaced by the centralized API service.

## Status: DEPRECATED ❌

These files are **no longer used** in the application. They have been kept for reference purposes only.

## Replacement

All functionality from these controllers has been migrated to:
- **`services/apiService.ts`** - Centralized API service with all endpoints

## Old Controllers

1. `authController.ts` - Authentication (login, register)
2. `eventController.ts` - Event management
3. `feedbackController.ts` - Feedback handling
4. `leaderboardController.ts` - Leaderboard operations
5. `redemptionController.ts` - Redemption requests
6. `transactionController.ts` - Transaction management
7. `userController.ts` - User data operations
8. `db.ts` - Database utilities

## Migration Date

December 11, 2025

## Documentation

For the new API structure, see:
- `API_DOCUMENTATION.md` - Complete API reference
- `MIGRATION_SUMMARY.md` - Migration details and changes

## Important

**Do not import or use these files in any new code.** Use the new API service instead:

```typescript
// ❌ Old way (deprecated)
import { AuthController } from '../controllers/authController';

// ✅ New way
import API from '../services/apiService';
```
