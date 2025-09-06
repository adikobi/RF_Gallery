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

    # --- Verify Exhibit Page ---
    page.goto("file:///app/exhibit.html?exhibitId=test") # Use a dummy exhibitId
    # Wait for the back button to be visible
    back_button = page.locator(".back-button")
    expect(back_button).to_be_visible()
    # Take screenshot of the exhibit page with the new back button
    page.screenshot(path="jules-scratch/verification/verification_exhibit_final.png")

    # --- Verify Modal ---
    # Click the "Add New Image" frame to open the modal
    add_image_frame = page.locator(".gallery-item:has-text('הוסף יצירה חדשה')")
    expect(add_image_frame).to_be_visible()
    add_image_frame.click()

    modal = page.locator("#add-image-modal")
    expect(modal).to_be_visible()
    # Take screenshot of the redesigned modal
    page.screenshot(path="jules-scratch/verification/verification_modal_final.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
