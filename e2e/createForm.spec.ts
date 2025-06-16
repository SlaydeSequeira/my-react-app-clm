import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000';

test.describe('CreateForm Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to create form page before each test
    await page.goto(`${BASE_URL}/createForm`);
  });

  test.describe('Page Load and Basic Elements', () => {
    test('should display create form page with all basic elements', async ({ page }) => {
      // Check page loads correctly
      await expect(page).toHaveURL(`${BASE_URL}/createForm`);
      
      // Check main heading
      await expect(page.locator('h2')).toHaveText('Create Form');
      
      // Check basic form inputs
      await expect(page.locator('input[name="title"]')).toBeVisible();
      await expect(page.locator('textarea[name="description"]')).toBeVisible();
      
      // Check sections
      await expect(page.locator('h3').filter({ hasText: 'Fields' })).toBeVisible();
      await expect(page.locator('h3').filter({ hasText: 'Settings' })).toBeVisible();
      
      // Check submit button
      await expect(page.locator('button:has-text("Submit Form")')).toBeVisible();
    });

    test('should have proper form input placeholders', async ({ page }) => {
      await expect(page.locator('input[name="title"]')).toHaveAttribute('placeholder', 'Title');
      await expect(page.locator('textarea[name="description"]')).toHaveAttribute('placeholder', 'Description');
      await expect(page.locator('input[name="settings.confirmationMessage"]')).toHaveAttribute('placeholder', 'Confirmation Message');
    });
  });

  test.describe('Basic Form Input Tests', () => {
    test('should allow entering title and description', async ({ page }) => {
      const testTitle = 'Test Form Title';
      const testDescription = 'Test form description text';
      
      // Enter title
      await page.fill('input[name="title"]', testTitle);
      await expect(page.locator('input[name="title"]')).toHaveValue(testTitle);
      
      // Enter description
      await page.fill('textarea[name="description"]', testDescription);
      await expect(page.locator('textarea[name="description"]')).toHaveValue(testDescription);
    });

    test('should clear form inputs when cleared', async ({ page }) => {
      // Fill inputs
      await page.fill('input[name="title"]', 'Test Title');
      await page.fill('textarea[name="description"]', 'Test Description');
      
      // Clear inputs
      await page.fill('input[name="title"]', '');
      await page.fill('textarea[name="description"]', '');
      
      // Verify cleared
      await expect(page.locator('input[name="title"]')).toHaveValue('');
      await expect(page.locator('textarea[name="description"]')).toHaveValue('');
    });
  });

  test.describe('Dynamic Field Management', () => {
    test('should add new field when Add Field button is clicked', async ({ page }) => {
      // Initially no fields should be present
      await expect(page.locator('select')).toHaveCount(0);
      
      // Add a field
      await page.click('button:has-text("Add Field")');
      
      // Check if field elements appear
      await expect(page.locator('select')).toHaveCount(1);
      await expect(page.locator('input[placeholder="Label"]')).toHaveCount(1);
      await expect(page.locator('input[placeholder="Placeholder"]')).toHaveCount(1);
      await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
      await expect(page.locator('button:has-text("Remove")')).toHaveCount(1);
    });

    test('should add multiple fields', async ({ page }) => {
      // Add multiple fields
      await page.click('button:has-text("Add Field")');
      await page.click('button:has-text("Add Field")');
      await page.click('button:has-text("Add Field")');
      
      // Check that 3 fields are present
      await expect(page.locator('select')).toHaveCount(3);
      await expect(page.locator('input[placeholder="Label"]')).toHaveCount(3);
      await expect(page.locator('input[placeholder="Placeholder"]')).toHaveCount(3);
      await expect(page.locator('button:has-text("Remove")')).toHaveCount(3);
    });

    test('should remove field when Remove button is clicked', async ({ page }) => {
      // Add two fields
      await page.click('button:has-text("Add Field")');
      await page.click('button:has-text("Add Field")');
      
      // Verify 2 fields exist
      await expect(page.locator('select')).toHaveCount(2);
      
      // Remove first field
      await page.locator('button:has-text("Remove")').first().click();
      
      // Verify only 1 field remains
      await expect(page.locator('select')).toHaveCount(1);
    });

  

    test('should handle field type switching', async ({ page }) => {
      // Add a field
      await page.click('button:has-text("Add Field")');
      
      // Switch from text to email
      await page.selectOption('select', 'email');
      await expect(page.locator('select')).toHaveValue('email');
      
      // Switch back to text
      await page.selectOption('select', 'text');
      await expect(page.locator('select')).toHaveValue('text');
    });
  });

  test.describe('Form Settings Tests', () => {
    test('should toggle all setting checkboxes', async ({ page }) => {
      const checkboxes = [
        'input[name="settings.allowMultipleResponses"]',
        'input[name="settings.collectEmail"]',
        'input[name="settings.showProgressBar"]',
        'input[name="settings.requireSignIn"]'
      ];
      
      // Check all checkboxes
      for (const checkbox of checkboxes) {
        await page.check(checkbox);
        await expect(page.locator(checkbox)).toBeChecked();
      }
      
      // Uncheck all checkboxes
      for (const checkbox of checkboxes) {
        await page.uncheck(checkbox);
        await expect(page.locator(checkbox)).not.toBeChecked();
      }
    });

    test('should set confirmation message', async ({ page }) => {
      const message = 'Thank you for your submission!';
      await page.fill('input[name="settings.confirmationMessage"]', message);
      await expect(page.locator('input[name="settings.confirmationMessage"]')).toHaveValue(message);
    });

    test('should have proper labels for settings', async ({ page }) => {
      await expect(page.locator('text=Allow Multiple Responses')).toBeVisible();
      await expect(page.locator('text=Collect Email')).toBeVisible();
      await expect(page.locator('text=Show Progress Bar')).toBeVisible();
      await expect(page.locator('text=Require Sign In')).toBeVisible();
    });
  });

  test.describe('Form Submission Tests', () => {
    test('should show authentication error when not logged in', async ({ page }) => {
      // Mock the Redux store to simulate not being logged in
      await page.evaluate(() => {
        // This might need adjustment based on your actual Redux setup
        window.localStorage.clear();
      });
      
      // Set up dialog handler for alert
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('You must be logged in to create a form.');
        await dialog.accept();
      });
      
      // Fill basic form data
      await page.fill('input[name="title"]', 'Test Form');
      await page.fill('textarea[name="description"]', 'Test Description');
      
      // Try to submit
      await page.click('button:has-text("Submit Form")');
    });


  });

  test.describe('Complex Workflow Tests', () => {
    test('should create a complete form with multiple fields and settings', async ({ page }) => {
      // Fill basic information
      await page.fill('input[name="title"]', 'Customer Feedback Form');
      await page.fill('textarea[name="description"]', 'Please provide your feedback about our service');
      
      // Add multiple fields
      await page.click('button:has-text("Add Field")');
      await page.selectOption('select >> nth=0', 'text');
      await page.fill('input[placeholder="Label"] >> nth=0', 'Full Name');
      await page.fill('input[placeholder="Placeholder"] >> nth=0', 'Enter your full name');
      await page.check('input[type="checkbox"] >> nth=0');
      
      await page.click('button:has-text("Add Field")');
      await page.selectOption('select >> nth=1', 'email');
      await page.fill('input[placeholder="Label"] >> nth=1', 'Email Address');
      await page.fill('input[placeholder="Placeholder"] >> nth=1', 'Enter your email');
      await page.check('input[type="checkbox"] >> nth=1');
      
      await page.click('button:has-text("Add Field")');
      await page.selectOption('select >> nth=2', 'text');
      await page.fill('input[placeholder="Label"] >> nth=2', 'Feedback');
      await page.fill('input[placeholder="Placeholder"] >> nth=2', 'Share your thoughts');
      
      // Configure settings
      await page.check('input[name="settings.allowMultipleResponses"]');
      await page.check('input[name="settings.collectEmail"]');
      await page.check('input[name="settings.showProgressBar"]');
      await page.fill('input[name="settings.confirmationMessage"]', 'Thank you for your valuable feedback!');
      
      // Verify all elements are properly configured
      await expect(page.locator('input[name="title"]')).toHaveValue('Customer Feedback Form');
      await expect(page.locator('select')).toHaveCount(3);
      await expect(page.locator('input[name="settings.allowMultipleResponses"]')).toBeChecked();
      await expect(page.locator('input[name="settings.collectEmail"]')).toBeChecked();
      await expect(page.locator('input[name="settings.showProgressBar"]')).toBeChecked();
    });

    test('should handle rapid field addition and removal', async ({ page }) => {
      // Rapidly add fields
      for (let i = 0; i < 5; i++) {
        await page.click('button:has-text("Add Field")');
      }
      await expect(page.locator('select')).toHaveCount(5);
      
      // Remove some fields
      await page.locator('button:has-text("Remove") >> nth=1').click();
      await page.locator('button:has-text("Remove") >> nth=2').click();
      await expect(page.locator('select')).toHaveCount(3);
      
      // Add more fields
      await page.click('button:has-text("Add Field")');
      await page.click('button:has-text("Add Field")');
      await expect(page.locator('select')).toHaveCount(5);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab'); // Title input
      await expect(page.locator('input[name="title"]')).toBeFocused();
      
      await page.keyboard.press('Tab'); // Description textarea
      await expect(page.locator('textarea[name="description"]')).toBeFocused();
      
      await page.keyboard.press('Tab'); // Add Field button
      await expect(page.locator('button:has-text("Add Field")')).toBeFocused();
    });

    test('should have proper form labels and structure', async ({ page }) => {
      // Add a field to test field labels
      await page.click('button:has-text("Add Field")');
      
      // Check for required labels
      await expect(page.locator('text=Required?')).toBeVisible();
      await expect(page.locator('text=Allow Multiple Responses')).toBeVisible();
      await expect(page.locator('text=Collect Email')).toBeVisible();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle empty form submission gracefully', async ({ page }) => {
      // Mock user being logged in
      await page.evaluate(() => {
        window.localStorage.setItem('userEmail', 'test@example.com');
      });
      
      // Try to submit empty form
      await page.click('button:has-text("Submit Form")');
      
      // The form should still attempt submission (based on your current implementation)
      // You might want to add validation in your actual component
    });

    test('should handle network timeout', async ({ page }) => {
      // Mock slow/timeout API response
      await page.route(`${API_URL}/api/forms`, async route => {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second delay
      });
      
      // This test verifies the component doesn't break on slow responses
      await page.fill('input[name="title"]', 'Test Form');
      await page.click('button:has-text("Submit Form")');
      
      // Wait a reasonable time then check the form is still functional
      await page.waitForTimeout(1000);
      await expect(page.locator('input[name="title"]')).toBeVisible();
    });
  });
});
