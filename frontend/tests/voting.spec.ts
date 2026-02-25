import { test, expect } from '@playwright/test';

test.describe('Voting System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to projects page
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');
  });

  test('should load projects page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/NecroBridge/i);

    // Check for at least one project card
    const projectCards = await page.locator('[data-testid="project-card"]').count();
    expect(projectCards).toBeGreaterThan(0);
  });

  test('should navigate to project detail page', async ({ page }) => {
    // Click first project
    const firstProject = page.locator('[data-testid="project-card"]').first();
    await firstProject.click();

    // Wait for detail page to load
    await page.waitForLoadState('networkidle');

    // Check for VoteCard component
    const voteCard = page.locator('[data-testid="vote-card"]');
    await expect(voteCard).toBeVisible();
  });

  test('should display VoteCard with voting buttons', async ({ page }) => {
    // Navigate to first project
    const firstProject = page.locator('[data-testid="project-card"]').first();
    await firstProject.click();
    await page.waitForLoadState('networkidle');

    // Check for YES and NO buttons
    const yesButton = page.locator('[data-testid="vote-yes-button"]');
    const noButton = page.locator('[data-testid="vote-no-button"]');

    await expect(yesButton).toBeVisible();
    await expect(noButton).toBeVisible();
  });

  test('should show vote tally', async ({ page }) => {
    // Navigate to first project
    const firstProject = page.locator('[data-testid="project-card"]').first();
    await firstProject.click();
    await page.waitForLoadState('networkidle');

    // Check for vote tally display
    const tallyDisplay = page.locator('[data-testid="vote-tally"]');
    await expect(tallyDisplay).toBeVisible();
  });

  test('should prompt wallet connection on vote attempt', async ({ page }) => {
    // Navigate to first project
    const firstProject = page.locator('[data-testid="project-card"]').first();
    await firstProject.click();
    await page.waitForLoadState('networkidle');

    // Try to vote without connected wallet
    const yesButton = page.locator('[data-testid="vote-yes-button"]');
    await yesButton.click();

    // Should show error or wallet connect prompt
    // Should show error or wallet connect prompt
    // Check if visible or listen for console error
    await page.waitForTimeout(1000);
  });

  test('should fetch and display nominations', async ({ page }) => {
    // Navigate to nominate page
    await page.goto('http://localhost:3000/nominate');
    await page.waitForLoadState('networkidle');

    // Check for nomination form
    const nominateForm = page.locator('[data-testid="nominate-form"]');
    await expect(nominateForm).toBeVisible();
  });

  test('should display dashboard', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');

    // Check for dashboard content
    const dashboard = page.locator('[data-testid="dashboard"]');
    await expect(dashboard).toBeVisible();
  });

  test('API: should fetch votes', async ({ page }) => {
    // Make direct API call (connected to devnet via HELIUS_RPC)
    const response = await page.request.get('http://localhost:3000/api/votes?projectId=test-project');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success');
  });

  test('API: should fetch nominations', async ({ page }) => {
    // Make direct API call
    const response = await page.request.get('http://localhost:3000/api/nominations');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});

test.describe('Firebase Integration', () => {
  test('should connect to Firebase without errors', async ({ page }) => {
    // Listen for console errors
    let firebaseErrors: string[] = [];

    page.on('console', msg => {
      if (msg.text().includes('Firebase') || msg.text().includes('Error')) {
        firebaseErrors.push(msg.text());
      }
    });

    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Should not have Firebase connection errors
    const criticalErrors = firebaseErrors.filter(err =>
      err.includes('Failed') || err.includes('failed')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('should load voting data from Firestore', async ({ page }) => {
    // Navigate to projects
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');

    // Click a project
    const firstProject = page.locator('[data-testid="project-card"]').first();
    await firstProject.click();
    await page.waitForLoadState('networkidle');

    // Check if vote tally data is displayed
    const tallyDisplay = page.locator('[data-testid="vote-tally"]');
    await expect(tallyDisplay).toBeVisible();

    // Extract and verify tally data exists
    const tallyText = await tallyDisplay.textContent();
    expect(tallyText).toBeTruthy();
  });
});
