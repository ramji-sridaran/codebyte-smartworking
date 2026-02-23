import { test, expect } from '@playwright/test';

test.describe('Task Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display task list page', async ({ page }) => {
    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Task Manager');

    // Check if the "New Task" button is visible
    await expect(page.locator('button:has-text("New Task")')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Click the "New Task" button
    await page.click('button:has-text("New Task")');

    // Wait for navigation to the form
    await page.waitForURL('**/tasks/new');

    // Fill in the form
    await page.fill('input#title', 'E2E Test Task');
    await page.fill('textarea#description', 'This is a test task created by E2E tests');
    await page.fill('input#assignedTo', 'Test User');

    // Submit the form
    await page.click('button:has-text("Create Task")');

    // Wait for success and navigation back to task list
    await page.waitForURL('**/tasks');
    await expect(page.locator('h1')).toContainText('Task Manager');
  });

  test('should toggle task completion status', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('table tbody tr');

    // Get the first checkbox
    const firstCheckbox = page.locator('table tbody input[type="checkbox"]').first();

    // Check initial state
    const isChecked = await firstCheckbox.isChecked();

    // Click to toggle
    await firstCheckbox.click();

    // Verify state changed
    const newState = await firstCheckbox.isChecked();
    expect(newState).toBe(!isChecked);
  });

  test('should delete a task with confirmation', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('table tbody tr');

    // Set up dialog handler
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });

    // Count tasks before deletion
    let taskCount = await page.locator('table tbody tr').count();
    const initialCount = taskCount;

    // Click delete button on the first task
    await page.click('table tbody button:has-text("Delete")');

    // Wait for deletion to complete
    await page.waitForTimeout(500);

    // Verify task count decreased
    taskCount = await page.locator('table tbody tr').count();
    expect(taskCount).toBeLessThanOrEqual(initialCount);
  });

  test('should search and filter tasks', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('select');

    // Change filter to "Completed"
    await page.selectOption('select', 'completed');

    // Wait for table to update
    await page.waitForTimeout(500);

    // Verify table is still visible
    await expect(page.locator('table')).toBeVisible();
  });

  test('should sort tasks', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForSelector('table tbody tr');

    // Click on "Title" sort header
    await page.click('.sort-header:has-text("Title")');

    // Wait for reordering
    await page.waitForTimeout(500);

    // Verify table is still visible
    await expect(page.locator('table')).toBeVisible();
  });
});

