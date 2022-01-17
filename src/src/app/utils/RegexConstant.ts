/**
 * At least one lowercase
 * At least one uppercase or one number
 * Minimum 6 characters
 */
export const MEDIUM_PASSWORD_REGEX = /(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})./;
export const ONLY_DIGIT = /^[0-9]+$/;