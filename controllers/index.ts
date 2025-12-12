/**
 * DEPRECATED: Controllers have been moved to services/apiService.ts
 * 
 * This directory is kept for backward compatibility.
 * Please update your imports to use the new API service:
 * 
 * @example
 * // Old way (deprecated):
 * import { AuthController } from '../controllers/authController';
 * 
 * // New way:
 * import API from '../services/apiService';
 * 
 * @see ../services/apiService.ts for the new centralized API service
 * @see ../API_DOCUMENTATION.md for complete API reference
 * @see ../MIGRATION_SUMMARY.md for migration guide
 */

// Re-export the API service for backward compatibility
export { default as API } from '../services/apiService';
export * from '../services/apiService';
