// Sample data (in production, this would come from your API)
const sampleData = {
  companyName: "TechCorp",
  matchScore: 86,
  accountStatus: "Target"
};

// Force widget visibility to true in storage
chrome.storage.local.set({ widgetVisible: true }, () => {
  console.log("Widget visibility forced to true");
});

function createWidget(data) {
  const widget = document.createElement('div');
  widget.className = 'linkedin-enhancer-widget';
  widget.innerHTML = `
    <div class="widget-header">
      <h3>${data.companyName}</h3>
      <button class="widget-toggle">×</button>
    </div>
    <div class="widget-content">
      <div class="score-section">
        <label>Match Score</label>
        <div class="progress-bar">
          <div class="progress" style="width: ${data.matchScore}%"></div>
        </div>
        <span class="score-value">${data.matchScore}</span>
      </div>
      <div class="status-section">
        <label>Account Status</label>
        <span class="status-tag ${data.accountStatus.toLowerCase()}">${data.accountStatus}</span>
      </div>
    </div>
  `;

  // Add event listener for toggle button
  const toggleBtn = widget.querySelector('.widget-toggle');
  toggleBtn.addEventListener('click', () => {
    chrome.storage.local.set({ widgetVisible: false });
    widget.style.display = 'none';
  });

  return widget;
}

// Function to find a suitable injection point on LinkedIn
function findInjectionPoint() {
  const selectors = [
    "#profile-content > div > div.scaffold-layout.scaffold-layout--breakpoint-lg.scaffold-layout--main-aside.scaffold-layout--reflow.pv-profile.pvs-loader-wrapper__shimmer--animate > div > div > main > section.artdeco-card.mXyfPxnkcDxpGQgOCLwKVWnyhNheVdOgbrtjE > div.ph5",
    "main section.artdeco-card",
    "main section.ph5",
    "main > section",
    "main"
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`Found injection point using selector: ${selector}`);
      return element;
    }
  }

  console.log("No suitable injection point found with any selector");
  return null;
}

// Function to inject the widget into the LinkedIn profile section
function injectWidget() {
  const targetSection = findInjectionPoint();

  if (targetSection) {
    if (!document.querySelector('.linkedin-enhancer-widget')) {
      const widget = createWidget(sampleData);
      targetSection.appendChild(widget);
      console.log("Widget injected successfully");
    } else {
      console.log("Widget already exists, not creating a duplicate");
    }
  } else {
    console.log("No suitable injection point found");
  }
}

// Initial injection attempt
console.log("Content script loaded, attempting initial injection");
injectWidget();

// Set up a MutationObserver to detect when the profile content loads
const observer = new MutationObserver((mutations, obs) => {
  const targetSection = findInjectionPoint();

  if (targetSection) {
    if (!document.querySelector('.linkedin-enhancer-widget')) {
      console.log("Target section found, injecting widget");
      injectWidget();
    }
    obs.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleWidget') {
    const widgets = document.querySelectorAll('.linkedin-enhancer-widget');
    if (widgets.length > 0) {
      const firstWidget = widgets[0];
      const newState = firstWidget.style.display === 'none' ? 'block' : 'none';

      widgets.forEach(widget => {
        widget.style.display = newState;
      });

      // Update storage
      chrome.storage.local.set({ widgetVisible: newState === 'block' });
      console.log(`Widget visibility set to: ${newState === 'block'}`);
    } else {
      // If no widgets found, try to inject one
      console.log("No widgets found, attempting to inject");
      injectWidget();
    }
  }
}); 