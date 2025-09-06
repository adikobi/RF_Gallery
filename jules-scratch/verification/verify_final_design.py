from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page(viewport={"width": 375, "height": 667})

    # Verify Home Page
    page.goto("file:///app/index.html")
    # Wait for the "Add New Exhibit" frame to be visible. This confirms the JS has loaded.
    add_frame = page.locator(".exhibit-frame:has-text('הוסף תערוכה חדשה')")
    expect(add_frame).to_be_visible(timeout=10000)
    page.screenshot(path="jules-scratch/verification/verification_home.png")

    # Click the add frame to open the modal
    add_frame.click()
    modal = page.locator("#add-exhibit-modal")
    expect(modal).to_be_visible()

    # Verify the modal
    page.screenshot(path="jules-scratch/verification/verification_modal.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
