from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    page.goto("file:///app/exhibit.html?exhibitId=test")

    # Inject script to manually open the view image modal with fake data
    # This is a workaround because we can't easily add data to the database
    fake_image_data = {
        "imageUrl": "https://via.placeholder.com/800x600.png?text=Test+Image",
        "description": "This is a test description."
    }
    page.evaluate(f"setupViewImageModal({fake_image_data})")

    # Wait for the modal to appear
    modal = page.locator("#view-image-modal")
    expect(modal).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification_image_modal_final.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
