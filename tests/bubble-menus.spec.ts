import { test, expect } from "@playwright/test";

test.describe("Editor Bubble Menus", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".ate-editor")).toBeVisible();

    // Force EN
    const editorBtn = page.getByTestId("mode-editor");
    const text = await editorBtn.innerText();
    if (text.toLowerCase().includes("éditeur")) {
      await page.getByTestId("lang-switch").click();
      await expect(editorBtn).toHaveText(/editor/i);
    }

    await page.getByTestId("clear-button").click();
    await expect(page.locator(".ProseMirror")).toHaveText("");
  });

  test("should show text bubble menu on selection", async ({ page }) => {
    const editor = page.locator(".ProseMirror");
    await editor.focus();
    await page.keyboard.type("SelectMe");

    // Utilisation de selectText() au lieu de dblclick() pour une compatibilité parfaite cross-browser
    await editor.selectText();

    // Le menu Tippy doit apparaître
    const bubbleMenu = page.locator(".tippy-box");
    await expect(bubbleMenu).toBeVisible();
    await expect(bubbleMenu.getByRole("button", { name: /bold/i })).toBeVisible();
  });

  test("should apply bold via bubble menu", async ({ page }) => {
    const editor = page.locator(".ProseMirror");
    await editor.focus();
    await page.keyboard.type("BoldMe");

    await editor.selectText();

    const bubbleMenu = page.locator(".tippy-box");
    const boldBtn = bubbleMenu.getByRole("button", { name: /bold/i });
    await expect(boldBtn).toBeVisible();
    await boldBtn.click();

    // Vérification sur le contenu
    await expect(editor.locator("strong")).toHaveText("BoldMe");
  });

  test("should show link bubble menu", async ({ page }) => {
    const editor = page.locator(".ProseMirror");
    await editor.focus();
    await page.keyboard.type("MyLink");

    await editor.selectText();

    // Ouverture du menu lien
    const linkBtn = page.locator(".tippy-box").getByRole("button", { name: /link/i });
    await expect(linkBtn).toBeVisible();
    await linkBtn.click();

    // Remplissage de l'URL
    const linkInput = page.locator('input[placeholder*="URL"]');
    await expect(linkInput).toBeVisible();
    await linkInput.fill("https://playwright.dev");
    await page.keyboard.press("Enter");

    // Vérification du lien créé
    await expect(editor.locator("a")).toHaveAttribute("href", "https://playwright.dev");
  });
  test("should increase font size via bubble menu", async ({ page }) => {
    const editor = page.locator(".ProseMirror");
    await editor.focus();
    await page.keyboard.type("BubbleSize");
    await editor.selectText();

    const bubbleMenu = page.locator(".tippy-box");
    await expect(bubbleMenu).toBeVisible();

    const sizeDisplay = bubbleMenu.locator(".font-size-display").first();
    await expect(sizeDisplay).toBeVisible();
    const initialSize = Number.parseInt((await sizeDisplay.innerText()).trim(), 10);
    expect(Number.isNaN(initialSize)).toBeFalsy();

    const increaseBtn = bubbleMenu.getByRole("button", { name: /increase font size/i }).first();
    await expect(increaseBtn).toBeEnabled();
    await increaseBtn.click();

    const increasedSize = Number.parseInt((await sizeDisplay.innerText()).trim(), 10);
    expect(increasedSize).toBe(initialSize + 2);

    const styledText = editor.locator('span[style*="font-size"]').filter({ hasText: "BubbleSize" });
    await expect(styledText).toHaveAttribute(
      "style",
      new RegExp(`font-size:\\s*${increasedSize}px`, "i")
    );
  });
});
