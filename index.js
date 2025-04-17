// Theme Management

(function initializeTheme() {
  // Check for saved theme preference or prefer-color-scheme
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  // Set select value to match current theme if element exists
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.value = savedTheme || (prefersDark ? "dark" : "light");
  }
})();
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {
    // Toggle between dark and light mode only
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "dark";

    // Only toggle between dark and light, preserving other themes
    if (currentTheme === "dark" || currentTheme === "light") {
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // Update select value if it exists
      const themeSelect = document.getElementById("theme-select");
      if (themeSelect) {
        themeSelect.value = newTheme;
      }
    } else {
      // If current theme is neither dark nor light, set to light if it looks dark, dark otherwise
      const isDarkTheme = ["catppuccin-mocha", "gruvbox-dark"].includes(
        currentTheme
      );
      const newTheme = isDarkTheme ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // Update select value if it exists
      const themeSelect = document.getElementById("theme-select");
      if (themeSelect) {
        themeSelect.value = newTheme;
      }
    }

    console.log("Theme changed via toggle button");
  });

  // Add event listener for the theme selector
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      const selectedTheme = themeSelect.value;
      document.documentElement.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("theme", selectedTheme);
      console.log("Theme changed to:", selectedTheme);
    });
  }
}

// Site Management
const defaultSites = [
  { name: "Google", url: "https://www.google.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "Twitter", url: "https://twitter.com" },
  { name: "Reddit", url: "https://www.reddit.com" },
  { name: "PDM", url: "https://pdm.pega.com" },
  { name: "Claude", url: "https://claude.ai" },
];

function saveGoals(goals) {
  localStorage.setItem("goals", JSON.stringify(goals));
  loadGoals();
}

function removeGoal(pos) {
  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals.splice(pos, 1);
  saveGoals(goals);
}

function loadGoals() {
  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  const goalsContainer = document.getElementById("goals");
  if (!goalsContainer) return;

  goalsContainer.innerHTML = "";

  if (goals.length === 0) {
    goalsContainer.innerHTML = `<div class="empty-state">No goals yet. Add one below!</div>`;
    return;
  }

  goals.forEach((goal, index) => {
    const g = document.createElement("div");
    g.className = "goal";
    g.innerHTML = `
      <p>${goal}</p>
      <button data-pos=${index} class="remove-goal">×</button>
    `;
    goalsContainer.appendChild(g);
  });
}

function initGoals() {
  const addGoalBtn = document.getElementById("add-goal-button");
  if (!addGoalBtn) return;

  addGoalBtn.addEventListener("click", () => {
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const inputField = document.getElementById("add-goal-input");
    if (!inputField) return;

    const newGoal = inputField.value.trim();
    if (newGoal) {
      goals.push(newGoal);
      saveGoals(goals);
      inputField.value = "";
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.matches(".remove-goal")) {
      e.preventDefault();
      const goalPos = e.target.dataset.pos;
      removeGoal(goalPos);
    }
  });

  loadGoals();
}

function getFavicon(url) {
  const domain = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function getImageNameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname.replace("www.", "");
    let siteName = hostname.split(".")[0];
    return `./assets/${siteName.toLowerCase()}.png`;
  } catch (error) {
    console.error("Invalid URL:", error);
    return "./assets/default.png";
  }
}

function loadSites() {
  const sites =
    JSON.parse(localStorage.getItem("favorite-sites")) || defaultSites;
  const quickLinksContainer = document.getElementById("quick-links");
  if (!quickLinksContainer) return;

  const addButton = document.getElementById("add-site-btn");
  if (!addButton) return;

  // Clear existing sites except the add button
  while (quickLinksContainer.firstChild) {
    quickLinksContainer.removeChild(quickLinksContainer.firstChild);
  }

  // Add sites
  sites.forEach((site) => {
    const link = document.createElement("a");
    link.href = site.url;
    link.setAttribute("data-url", site.name);
    link.className = "quick-link";

    const button = document.createElement("button");
    button.setAttribute("data-url", site.url);
    button.classList.add("remove-site");
    button.innerHTML = `×`;

    const img = document.createElement("img");
    img.src = getImageNameFromUrl(site.url);
    img.alt = site.name;
    img.onerror = function () {
      this.src = "./assets/default.png";
    };

    const label = document.createElement("span");
    label.textContent = site.name;

    link.appendChild(button);
    link.appendChild(img);
    link.appendChild(label);
    quickLinksContainer.appendChild(link);
  });

  // Add the "Add Site" button back
  quickLinksContainer.appendChild(addButton);
}

function saveSites(sites) {
  localStorage.setItem("favorite-sites", JSON.stringify(sites));
  loadSites();
}

function removeSite(url) {
  const sites =
    JSON.parse(localStorage.getItem("favorite-sites")) || defaultSites;
  const updatedSites = sites.filter((site) => site.url !== url);
  saveSites(updatedSites);
}

function addSite(name, url) {
  const sites =
    JSON.parse(localStorage.getItem("favorite-sites")) || defaultSites;

  // Ensure URL has http or https
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  // Check if site already exists
  const siteExists = sites.some((site) => site.url === url);
  if (siteExists) {
    alert("This site already exists in your quick links.");
    return;
  }

  sites.push({ name, url });
  saveSites(sites);
}

// Modal Management
function initModals() {
  const siteModal = document.getElementById("add-site-modal");
  const addSiteBtn = document.getElementById("add-site-btn");
  const cancelSiteBtn = document.getElementById("cancel-add-site");
  const addSiteForm = document.getElementById("add-site-form");

  if (addSiteBtn && siteModal) {
    addSiteBtn.addEventListener("click", () => {
      siteModal.style.display = "flex";
      siteModal.querySelector("input").focus();
    });
  }

  if (cancelSiteBtn && siteModal && addSiteForm) {
    cancelSiteBtn.addEventListener("click", () => {
      siteModal.style.display = "none";
      addSiteForm.reset();
    });
  }

  // Close modal when clicking overlay
  document.querySelectorAll(".modal-overlay").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        const form = modal.querySelector("form");
        if (form) form.reset();
      }
    });
  });

  if (addSiteForm) {
    addSiteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("site-name").value.trim();
      const url = document.getElementById("site-url").value.trim();

      if (!name || !url) return;

      addSite(name, url);
      siteModal.style.display = "none";
      addSiteForm.reset();
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.matches(".remove-site")) {
      e.preventDefault();
      e.stopPropagation();
      const url = e.target.dataset.url;
      if (confirm("Are you sure you want to remove this site?")) {
        removeSite(url);
      }
    }
  });
}

// Clock and Date
function updateTime() {
  const clockElement = document.getElementById("clock");
  const dateElement = document.getElementById("date");
  if (!clockElement || !dateElement) return;

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  clockElement.textContent = timeString;
  dateElement.textContent = dateString;
}

function initClock() {
  updateTime();
  setInterval(updateTime, 1000);
}

// Todoist Integration
class TodoistIntegration {
  constructor() {
    this.apiToken = localStorage.getItem("todoist-token");
    this.baseUrl = "https://api.todoist.com/rest/v2";
    this.container = document.getElementById("todoist-container");
    if (!this.container) return;
  }

  async initialize() {
    if (!this.container) return;

    if (!this.apiToken) {
      this.container.innerHTML = `
        <div class="todoist-setup">
          <h2>Connect with Todoist</h2>
          <p style="margin: 1rem 0;">
            Connect your Todoist account to see and manage your tasks.
          </p>
          <button id="setup-todoist" class="button button-primary">
            Connect Todoist
          </button>
        </div>
      `;
      this.setupEventListeners();
      return;
    }

    await this.loadTasks();
  }

  setupEventListeners() {
    const setupBtn = document.getElementById("setup-todoist");
    const modal = document.getElementById("setup-token-modal");
    const form = document.getElementById("setup-token-form");
    const cancelBtn = document.getElementById("cancel-setup");

    setupBtn?.addEventListener("click", () => {
      if (modal) {
        modal.style.display = "flex";
        const input = modal.querySelector("input");
        if (input) input.focus();
      }
    });

    cancelBtn?.addEventListener("click", () => {
      if (modal) {
        modal.style.display = "none";
        if (form) form.reset();
      }
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const tokenInput = document.getElementById("api-token");
      if (!tokenInput) return;

      const token = tokenInput.value.trim();
      if (!token) return;

      this.apiToken = token;
      localStorage.setItem("todoist-token", token);

      if (modal) modal.style.display = "none";
      await this.initialize();
    });
  }

  async fetchTasks() {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async addTask(content, dueDate, priority) {
    const taskData = {
      content,
      priority: parseInt(priority),
      due_string: dueDate || null,
    };

    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }

    return await response.json();
  }

  async completeTask(taskId) {
    const response = await fetch(`${this.baseUrl}/tasks/${taskId}/close`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to complete task");
    }

    // Update UI immediately
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskItem) {
      const checkbox = taskItem.querySelector(".task-checkbox");
      const content = taskItem.querySelector(".task-content");
      if (checkbox) checkbox.classList.add("completed");
      if (content) content.classList.add("completed");
    }
  }

  formatDate(date) {
    if (!date) return "";
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return taskDate.toLocaleDateString();
    }
  }

  async loadTasks() {
    try {
      const tasks = await this.fetchTasks();
      if (!this.container) return;

      this.container.innerHTML = `
        <div class="tasks-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6l3-3 3 3M3 6v13c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6M3 6h18M16 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
            </svg>
            Inbox
          </h2>
        </div>
        ${
          tasks.length === 0
            ? '<div class="empty-state">No tasks in your inbox</div>'
            : ""
        }
        <ul class="tasks-list">
          ${tasks
            .map(
              (task) => `
            <li class="task-item" data-task-id="${task.id}">
              <div class="task-checkbox ${task.completed ? "completed" : ""}"
                   onclick="todoist.completeTask('${task.id}')"></div>
              <span class="task-content ${
                task.completed ? "completed" : ""
              } priority-p${task.priority}">
                ${task.content}
              </span>
              ${
                task.due
                  ? `<span class="task-due">${this.formatDate(
                      task.due.date
                    )}</span>`
                  : ""
              }
            </li>
          `
            )
            .join("")}
        </ul>
        <form class="add-task-form" id="add-task-form">
          <div class="add-task-row">
            <input type="text"
                   class="add-task-input"
                   placeholder="Add a task..."
                   required>
            <button type="submit" class="button button-primary">Add</button>
          </div>
          <div class="add-task-options">
            <div class="task-option">
              <label for="task-due">Due:</label>
              <input type="text"
                     id="task-due"
                     placeholder="today, tomorrow..."
                     class="add-task-input">
            </div>
            <div class="task-option">
              <label for="task-priority">Priority:</label>
              <select id="task-priority" class="add-task-input">
                <option value="1">P4 (Natural)</option>
                <option value="2">P3 (Medium)</option>
                <option value="3">P2 (High)</option>
                <option value="4">P1 (Urgent)</option>
              </select>
            </div>
          </div>
        </form>
      `;

      const addTaskForm = document.getElementById("add-task-form");
      addTaskForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = addTaskForm.querySelector(".add-task-input");
        const dueInput = document.getElementById("task-due");
        const priorityInput = document.getElementById("task-priority");
        if (!input || !dueInput || !priorityInput) return;

        const content = input.value.trim();
        const dueDate = dueInput.value.trim();
        const priority = priorityInput.value;

        if (!content) return;

        try {
          await this.addTask(content, dueDate, priority);
          input.value = "";
          dueInput.value = "";
          priorityInput.value = "1";
          await this.loadTasks();
        } catch (error) {
          console.error("Failed to add task:", error);
          alert("Failed to add task. Please try again.");
        }
      });
    } catch (error) {
      console.error("Failed to load tasks:", error);
      if (!this.container) return;

      this.container.innerHTML = `
        <div class="todoist-setup">
          <h2>Error Loading Tasks</h2>
          <p style="margin: 1rem 0;">
            Failed to load your tasks. Please check your API token.
          </p>
          <button id="setup-todoist" class="button button-primary">
            Reconnect Todoist
          </button>
        </div>
      `;
      this.setupEventListeners();
    }
  }
}

// Weather Integration
async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,wind_speed_10m,wind_direction_10m&timezone=auto`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Weather");
    }

    return await response.json();
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}

async function addLocation(location, lat, lon) {
  try {
    const currentTime = new Date().getTime();
    const weather = await fetchWeather(lat, lon);

    localStorage.setItem(
      "weather",
      JSON.stringify({
        timestamp: currentTime,
        location: location,
        lat: lat,
        lon: lon,
        weatherData: weather,
      })
    );

    loadWeather();
  } catch (error) {
    console.error("Failed to add location:", error);
    alert("Failed to get weather for this location. Please try again.");
  }
}

// Update the loadWeather function
async function loadWeather() {
  const navWeatherContainer = document.getElementById("nav-weather");
  if (!navWeatherContainer) return;

  try {
    let weather;
    const currentTime = new Date().getTime();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const storedData = localStorage.getItem("weather");

    if (storedData) {
      const { timestamp, location, lat, lon, weatherData } =
        JSON.parse(storedData);

      if (currentTime - timestamp < TWO_HOURS) {
        // Use stored weather if it's recent
        weather = weatherData;
        console.log("Weather loaded from storage");
      } else {
        // Fetch new weather if data is stale
        try {
          weather = await fetchWeather(lat, lon);
          localStorage.setItem(
            "weather",
            JSON.stringify({
              timestamp: currentTime,
              location: location,
              lat: lat,
              lon: lon,
              weatherData: weather,
            })
          );
          console.log("New weather fetched and stored");
        } catch (error) {
          console.error("Error updating weather:", error);
          weather = weatherData; // Fallback to stale data
        }
      }

      let iconType = weather.current.is_day ? "day" : "night";
      if (weather.current.precipitation > 0) {
        iconType = "rain";
      }

      const html = `
        <span id="edit-location" class="edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </span>
        <div class="location-name">${location}</div>
        <div class="temperature">
          <img alt='weather icon' src="./assets/${iconType}.png">
          <span class="temperature-text">${weather.current.temperature_2m}${weather.current_units.temperature_2m}</span>
        </div>
        <div class="weather-details">
          <span class="weather-details-value">${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m} humidity</span>
        </div>
      `;

      navWeatherContainer.innerHTML = html;

      // Add edit location functionality
      const editLocation = document.getElementById("edit-location");
      const locationModal = document.getElementById(
        "add-weather-location-modal"
      );
      editLocation?.addEventListener("click", () => {
        if (locationModal) locationModal.style.display = "flex";
      });
    } else {
      // No weather data stored yet
      const html = `
        <button id="add-location" class="button button-primary">Add location</button>
      `;
      navWeatherContainer.innerHTML = html;

      // Add button click handler
      const addLocationButton = document.getElementById("add-location");
      const locationModal = document.getElementById(
        "add-weather-location-modal"
      );
      addLocationButton?.addEventListener("click", () => {
        if (locationModal) locationModal.style.display = "flex";
      });
    }
  } catch (error) {
    console.error("Failed to load weather:", error);
    navWeatherContainer.innerHTML = `
      <div class="error-state">
        <button id="add-location" class="button button-primary">Set location</button>
      </div>
    `;
  }
}

function initWeather() {
  loadWeather();

  // Set up location modal events
  const locationModal = document.getElementById("add-weather-location-modal");
  const locationForm = document.getElementById("add-location-form");
  const locationCancel = document.getElementById("cancel-add-location");
  const autoLocButton = document.getElementById("auto-loc-button");

  if (!locationModal || !locationForm || !locationCancel || !autoLocButton)
    return;

  function showPosition(position) {
    const latInput = document.getElementById("lat");
    const lonInput = document.getElementById("lon");
    if (!latInput || !lonInput) return;

    latInput.value = position.coords.latitude.toPrecision(6);
    lonInput.value = position.coords.longitude.toPrecision(6);
  }

  autoLocButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your location. Please enter coordinates manually."
          );
        },
        { timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  locationCancel.addEventListener("click", () => {
    locationModal.style.display = "none";
    locationForm.reset();
  });

  locationModal.addEventListener("click", (e) => {
    if (e.target === locationModal) {
      locationModal.style.display = "none";
      locationForm.reset();
    }
  });

  locationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("location-name");
    const latInput = document.getElementById("lat");
    const lonInput = document.getElementById("lon");

    if (!nameInput || !latInput || !lonInput) return;

    const name = nameInput.value.trim();
    const lat = latInput.value.trim();
    const lon = lonInput.value.trim();

    if (!name || !lat || !lon) {
      alert("Please fill all fields");
      return;
    }

    addLocation(name, lat, lon);
    locationModal.style.display = "none";
    locationForm.reset();
  });
}

// Quote Implementation
async function fetchQuote() {
  try {
    const response = await fetch("https://thequoteshub.com/api/");
    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching quote:", error);
    // Return a fallback quote
    return {
      text: "The best way to predict the future is to invent it.",
      author: "Alan Kay",
    };
  }
}

async function loadQuote() {
  const quotesContainer = document.getElementById("quotes-section");
  if (!quotesContainer) return;

  try {
    let quote;
    const today = new Date().toLocaleDateString();
    const storedData = localStorage.getItem("dailyQuote");

    if (storedData) {
      const { date, quoteData } = JSON.parse(storedData);

      if (date === today) {
        // Use stored quote if it's from today
        quote = quoteData;
      } else {
        // Fetch new quote if date has changed
        quote = await fetchQuote();
        localStorage.setItem(
          "dailyQuote",
          JSON.stringify({
            date: today,
            quoteData: quote,
          })
        );
      }
    } else {
      // First time fetching quote
      quote = await fetchQuote();
      localStorage.setItem(
        "dailyQuote",
        JSON.stringify({
          date: today,
          quoteData: quote,
        })
      );
    }

    const html = `
      <blockquote>&ldquo;${quote.text}&rdquo; <footer>&mdash; <cite>${quote.author}</cite></footer></blockquote>
    `;
    quotesContainer.innerHTML = html;
  } catch (error) {
    console.error("Failed to load quote:", error);
    quotesContainer.innerHTML = `
      <blockquote>&ldquo;Simplicity is the ultimate sophistication.&rdquo; <footer>&mdash; <cite>Leonardo da Vinci</cite></footer></blockquote>
    `;
  }
}

// Search functionality
class SearchBar {
  constructor() {
    this.form = document.getElementById("searchForm");
    this.input = document.getElementById("searchInput");
    this.suggestionsContainer = document.getElementById("suggestionsContainer");

    if (!this.form || !this.input || !this.suggestionsContainer) return;

    this.selectedIndex = -1;
    this.suggestions = [];

    this.initializeEventListeners();
    this.loadUrlHistory();

    // Focus search on page load
    setTimeout(() => this.input.focus(), 500);
  }

  initializeEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.input.addEventListener("input", () => this.handleInput());
    this.input.addEventListener("focus", () => this.showSuggestions());
    this.input.addEventListener("keydown", (e) => this.handleKeydown(e));

    document.addEventListener("click", (e) => {
      if (!this.form.contains(e.target)) {
        this.hideSuggestions();
      }
    });
  }

  loadUrlHistory() {
    try {
      this.urlHistory = JSON.parse(localStorage.getItem("urlHistory")) || [];
    } catch {
      this.urlHistory = [];
    }
  }

  saveUrlHistory() {
    localStorage.setItem("urlHistory", JSON.stringify(this.urlHistory));
  }

  addToHistory(url) {
    // Remove the URL if it already exists
    this.urlHistory = this.urlHistory.filter((item) => item !== url);
    // Add to the beginning of the array
    this.urlHistory.unshift(url);
    // Keep only the last 10 URLs
    this.urlHistory = this.urlHistory.slice(0, 10);
    this.saveUrlHistory();
  }

  isValidUrl(string) {
    // First, check if it's a complete URL
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      // If not a complete URL, check if it matches a domain pattern
      const domainPattern =
        /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

      // Split on first slash to separate domain and path
      const potentialDomain = string.split("/")[0];

      // Must have at least one dot and match domain pattern
      return (
        potentialDomain.includes(".") && domainPattern.test(potentialDomain)
      );
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = this.input.value.trim();
    if (!query) return;
    this.navigateToInput(query);
  }

  navigateToInput(query) {
    if (this.isValidUrl(query)) {
      const url = query.startsWith("http") ? query : `https://${query}`;
      this.addToHistory(url);
      window.location.href = url;
    } else {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  }

  handleInput() {
    const query = this.input.value.trim().toLowerCase();

    if (query) {
      // Filter URL history for matching items
      this.suggestions = this.urlHistory.filter((url) =>
        url.toLowerCase().includes(query)
      );
      this.renderSuggestions();
    } else {
      this.suggestions = [];
      this.hideSuggestions();
    }

    this.selectedIndex = -1;
  }

  handleKeydown(e) {
    if (!this.suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.suggestions.length - 1
        );
        this.updateSelection();
        break;

      case "ArrowUp":
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection();
        break;

      case "Enter":
        if (this.selectedIndex >= 0) {
          e.preventDefault();
          const selectedUrl = this.suggestions[this.selectedIndex];
          this.navigateToInput(selectedUrl);
        }
        break;

      case "Escape":
        this.hideSuggestions();
        break;
    }
  }

  updateSelection() {
    const items =
      this.suggestionsContainer.querySelectorAll(".suggestion-item");
    items.forEach((item, index) => {
      item.classList.toggle("selected", index === this.selectedIndex);
    });

    if (this.selectedIndex >= 0) {
      this.input.value = this.suggestions[this.selectedIndex];
    }
  }

  renderSuggestions() {
    this.suggestionsContainer.innerHTML = "";

    this.suggestions.forEach((suggestion, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "suggestion-item";
      if (index === this.selectedIndex) {
        itemEl.classList.add("selected");
      }

      const icon = document.createElement("span");
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>`;
      itemEl.appendChild(icon);

      const text = document.createElement("span");
      text.textContent = suggestion;
      itemEl.appendChild(text);

      itemEl.addEventListener("click", () => {
        this.navigateToInput(suggestion);
      });

      itemEl.addEventListener("mouseenter", () => {
        this.selectedIndex = index;
        this.updateSelection();
      });

      this.suggestionsContainer.appendChild(itemEl);
    });

    this.showSuggestions();
  }

  showSuggestions() {
    if (this.suggestions.length > 0) {
      this.suggestionsContainer.classList.add("active");
    }
  }

  hideSuggestions() {
    this.suggestionsContainer.classList.remove("active");
    this.selectedIndex = -1;
  }
}

// Initialize Application
function initApp() {
  // Initialize theme toggle
  initThemeToggle();

  // Initialize quick links
  loadSites();
  initModals();

  // Initialize clock
  initClock();

  // Initialize weather
  initWeather();

  // Initialize quotes
  loadQuote();

  // Initialize Todoist
  const todoist = new TodoistIntegration();
  window.todoist = todoist; // Make it globally accessible for click handlers
  todoist.initialize();

  // Initialize goals
  initGoals();

  // Initialize search
  new SearchBar();
}

// Run initialization when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initApp);

// Mark as loaded when everything is ready
function markAsLoaded() {
  document.body.classList.add("loaded");
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen && loadingScreen.parentNode) {
      loadingScreen.parentNode.removeChild(loadingScreen);
    }
  }, 300);
}

if (document.readyState === "complete") {
  markAsLoaded();
} else {
  window.addEventListener("load", markAsLoaded);
  setTimeout(markAsLoaded, 2000); // Fallback
}
