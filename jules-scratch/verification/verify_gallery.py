from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    # Use the file:// protocol to open the local HTML file
    page.goto("file:///app/index.html")
    # Wait for the grid to be populated, assuming it will have at least one frame.
    # This is a bit of a guess, but it's better than not waiting at all.
    page.wait_for_selector('.exhibit-frame')
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
