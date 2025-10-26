import { cookies } from 'next/headers';
import { ReactNode } from 'react';

export default async function ServerLanguageProvider({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const language = cookieStore.get('turbo_wheel_language')?.value || 'en';
  
  // Устанавливаем язык в глобальную переменную для i18n
  if (typeof global !== 'undefined') {
    (global as { initialLanguage?: string }).initialLanguage = language;
  }
  
  return <>{children}</>;
}

