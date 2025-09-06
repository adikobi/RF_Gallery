from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page(viewport={"width": 375, "height": 812}) # iPhone X viewport

    # --- Verify Home Page ---
    page.goto("file:///app/index.html")
    # Wait for the content to load
    add_frame = page.locator(".exhibit-frame:has-text('הוסף תערוכה חדשה')")
    expect(add_frame).to_be_visible(timeout=10000)
    # Take screenshot of the home page with delete buttons
    page.screenshot(path="jules-scratch/verification/verification_home_final.png")

    # --- Verify Modal on Home Page ---
    # Click the "Add New Exhibit" frame to open the modal
    add_frame.click()

    modal = page.locator("#add-exhibit-modal")
    expect(modal).to_be_visible()
    # Take screenshot of the redesigned modal
    page.screenshot(path="jules-scratch/verification/verification_modal_final.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
