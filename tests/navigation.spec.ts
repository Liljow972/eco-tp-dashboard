import { test, expect } from '@playwright/test'

test('Navigation principale et screenshots', async ({ page }) => {
  // Login
  await page.goto('/login')
  await expect(page).toHaveTitle(/Connexion/i)
  await expect(page.getByRole('heading', { name: /Connexion/i })).toBeVisible()
  await expect(page).toHaveScreenshot('login.png')

  // Connexion via bouton Admin (test)
  await page.getByRole('button', { name: /Admin \(test\)/i }).click()
  await page.waitForURL('**/dashboard')
  await expect(page.getByText(/Eco TP Dashboard/i)).toBeVisible()
  await expect(page).toHaveScreenshot('dashboard.png')

  // Files
  await page.getByRole('link', { name: /Fichiers/i }).click()
  await page.waitForURL('**/files')
  await expect(page.getByRole('heading', { name: /Fichiers/i })).toBeVisible()
  await expect(page).toHaveScreenshot('files.png')

  // Projects
  await page.getByRole('link', { name: /Projets/i }).click()
  await page.waitForURL('**/projects')
  await expect(page.getByRole('heading', { name: /Projets/i })).toBeVisible()
  await expect(page).toHaveScreenshot('projects.png')

  // Settings
  await page.getByRole('link', { name: /Paramètres/i }).click()
  await page.waitForURL('**/settings')
  await expect(page.getByRole('heading', { name: /Profil/i })).toBeVisible()
  await expect(page).toHaveScreenshot('settings.png')
})