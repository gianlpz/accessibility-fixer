// Background service worker for the Accessibility Fixer extension

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "audit-page",
    title: "Audit this page for accessibility",
    contexts: ["page"],
  });

  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "audit-page" && tab?.id) {
    const tabId = tab.id;
    chrome.storage.session.set({ auditStatus: "running" });
    chrome.sidePanel
      .open({ tabId })
      .then(() => runAudit(tabId))
      .catch((err) => {
        console.error("Failed to open side panel:", err);
        runAudit(tabId);
      });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "RUN_AUDIT") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        await chrome.storage.session.set({ auditStatus: "running" });
        await runAudit(tabs[0].id);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: "No active tab" });
      }
    });
    return true;
  }

  if (message.type === "SEND_TO_APP") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const pageUrl = tabs[0]?.url || "";
      const stored = await chrome.storage.session.get("auditResult");
      if (stored.auditResult) {
        const appUrl = message.appUrl || "http://localhost:3000";
        const dataJson = JSON.stringify({
          violations: stored.auditResult.violations,
          passes: stored.auditResult.passes,
          html: stored.auditResult.html || "",
          screenshot: stored.auditResult.screenshot || "",
          scannedUrl: pageUrl,
        });

        // First open a blank page on the app origin to set sessionStorage
        const newTab = await chrome.tabs.create({
          url: `${appUrl}/audit`,
        });

        // Wait for the page to finish loading
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === newTab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            // Inject sessionStorage and reload so React picks it up
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: (json: string) => {
                sessionStorage.setItem("a11y-import", json);
                location.reload();
              },
              args: [dataJson],
            });
          }
        });
      }
      sendResponse({ success: true });
    });
    return true;
  }
});

// Cache axe-core source code in memory
let axeSource: string | null = null;

async function getAxeSource(): Promise<string> {
  if (axeSource) return axeSource;
  // Fetch from the extension's own bundled file
  const url = chrome.runtime.getURL("axe.min.js");
  const response = await fetch(url);
  axeSource = await response.text();
  return axeSource;
}

async function runAudit(tabId: number) {
  try {
    // Load axe source as a string in the service worker
    const source = await getAxeSource();

    // Inject axe-core source directly as code (no file reference)
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (code: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).axe) {
          const script = document.createElement("script");
          script.textContent = code;
          document.documentElement.appendChild(script);
          script.remove();
        }
      },
      args: [source],
      world: "MAIN",
    });

    // Small delay to ensure axe is initialized
    await new Promise((r) => setTimeout(r, 100));

    // Inline CSS and rewrite image URLs before capturing HTML
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Inline same-origin stylesheets
        Array.from(document.styleSheets).forEach((sheet) => {
          try {
            const cssText = Array.from(sheet.cssRules)
              .map((r) => r.cssText)
              .join("\n");
            const style = document.createElement("style");
            style.setAttribute("data-inlined", "true");
            style.textContent = cssText;
            document.head.appendChild(style);
          } catch {
            // Cross-origin sheets throw SecurityError — skip gracefully
          }
        });
        // Rewrite image src to absolute URLs
        document.querySelectorAll("img[src]").forEach((el) => {
          const img = el as HTMLImageElement;
          img.setAttribute("src", img.src);
        });
      },
      world: "MAIN",
    });

    // Run axe in MAIN world
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axeResults = await (window as any).axe.run(document);
        return {
          violations: axeResults.violations.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (v: any) => ({
              id: v.id,
              impact: v.impact || "minor",
              description: v.description,
              help: v.help,
              helpUrl: v.helpUrl,
              tags: v.tags,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              nodes: v.nodes.map((n: any) => ({
                html: n.html,
                target: n.target,
                failureSummary: n.failureSummary,
              })),
            })
          ),
          passes: axeResults.passes.length,
          html: document.documentElement.outerHTML,
        };
      },
      world: "MAIN",
    });

    const result = results[0]?.result;
    if (result) {
      // Capture a screenshot of the visible tab
      let screenshot: string | undefined;
      try {
        screenshot = await chrome.tabs.captureVisibleTab(undefined, {
          format: "jpeg",
          quality: 60,
        });
      } catch {
        // Screenshot capture can fail on restricted pages — non-critical
      }

      const tab = await chrome.tabs.get(tabId);
      const auditResult = {
        ...result,
        screenshot,
        timestamp: new Date().toISOString(),
        pageUrl: tab.url || "",
        pageTitle: tab.title || "",
      };

      await chrome.storage.session.set({ auditResult, auditStatus: "done" });
    } else {
      await chrome.storage.session.set({ auditStatus: "error" });
    }
  } catch (error) {
    console.error("Audit failed:", error);
    await chrome.storage.session.set({ auditStatus: "error" });
  }
}
