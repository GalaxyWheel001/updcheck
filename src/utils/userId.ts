const USER_ID_KEY = 'turbo_wheel_user_id';

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getUserId(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }

  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateShortId();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function isNewUser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  // This function is called before getUserId, so we check for the key's existence.
  return !localStorage.getItem(USER_ID_KEY);
}