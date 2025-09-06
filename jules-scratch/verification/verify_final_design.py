from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify Home Page
    page.goto("file:///app/index.html")
    page.wait_for_selector('.exhibit-frame')
    page.screenshot(path="jules-scratch/verification/verification_home.png")

    # Verify Exhibit Page
    page.goto("file:///app/exhibit.html?exhibitId=test") # Use a dummy exhibitId for testing
    page.wait_for_selector('.back-button')
    page.screenshot(path="jules-scratch/verification/verification_exhibit.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
