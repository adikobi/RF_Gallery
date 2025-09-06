from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("file:///app/index.html")

    # Find the "Add New Exhibit" frame and click it
    # We target it by looking for the h3 text inside it
    add_exhibit_frame = page.locator(".exhibit-frame:has-text('Add New Exhibit')")
    add_exhibit_frame.click()

    # Wait for the modal to appear and be visible
    modal = page.locator("#add-exhibit-modal")
    expect(modal).to_be_visible()

    # Take a screenshot of the page with the modal open
    page.screenshot(path="jules-scratch/verification/verification_modal_open.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
