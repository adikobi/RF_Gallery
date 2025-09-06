from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify Home Page
    page.goto("file:///app/index.html")
    # Wait for the "Add New Exhibit" frame to be visible. This confirms the JS has loaded.
    add_frame = page.locator(".exhibit-frame:has-text('הוסף תערוכה חדשה')")
    expect(add_frame).to_be_visible(timeout=10000)
    page.screenshot(path="jules-scratch/verification/verification_home.png")

    # Verify Exhibit Page
    page.goto("file:///app/exhibit.html?exhibitId=test") # Use a dummy exhibitId for testing
    page.wait_for_selector('.back-button')
    page.screenshot(path="jules-scratch/verification/verification_exhibit.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
