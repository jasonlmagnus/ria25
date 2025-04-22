// Script to forcibly fix markdown styling problems
(function () {
  // Function to apply styling fixes
  function fixMarkdownStyling() {
    console.log("Applying markdown styling fixes...");

    // Target message bubbles
    const messageBubbles = document.querySelectorAll(
      ".message-bubble-assistant"
    );

    messageBubbles.forEach((bubble) => {
      // Fix headings
      const headings = bubble.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headings.forEach((heading) => {
        heading.style.color = "#00634f";
        heading.style.fontWeight = "bold";
        heading.style.marginTop = "1em";
        heading.style.marginBottom = "0.5em";

        // Size adjustments based on heading level
        if (heading.tagName === "H1") heading.style.fontSize = "1.5em";
        if (heading.tagName === "H2") heading.style.fontSize = "1.25em";
        if (heading.tagName === "H3") heading.style.fontSize = "1.125em";
      });

      // Fix bold text
      const boldElements = bubble.querySelectorAll("strong, b");
      boldElements.forEach((bold) => {
        bold.style.fontWeight = "700";
      });

      // Target numbers inside bold elements to ensure they appear correctly
      const numbers = bubble.querySelectorAll("strong, b");
      numbers.forEach((number) => {
        if (/\d+%/.test(number.textContent)) {
          number.style.fontWeight = "700";
        }
      });
    });
  }

  // Run immediately
  fixMarkdownStyling();

  // Set up an observer to apply fixes to new content
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        fixMarkdownStyling();
      }
    }
  });

  // Start observing when the DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also run periodically to catch any missed elements
    setInterval(fixMarkdownStyling, 1000);
  });

  // If DOM is already loaded, start observing now
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
