import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL!;

test('magic-link sign-in round trip', async ({ page, baseURL }) => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await page.goto('/login');
  await page.getByPlaceholder('you@bank.com.my').fill(TEST_USER_EMAIL);
  await page.getByRole('button', { name: /send magic link/i }).click();
  await expect(page.getByText(`Check ${TEST_USER_EMAIL} for a sign-in link.`)).toBeVisible();

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: TEST_USER_EMAIL,
    options: { redirectTo: `${baseURL}/auth/callback` },
  });
  expect(error).toBeNull();
  if (!data?.properties) throw new Error('generateLink returned no data');

  await page.goto(data.properties.action_link);

  await expect(page).toHaveURL(/\/notices/);
  await expect(page.getByText(/Check .* for a sign-in link\./)).not.toBeVisible();
});
