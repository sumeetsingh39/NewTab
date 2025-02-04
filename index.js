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

  goalsContainer.innerHTML = "";

  goals.forEach((goal, index) => {
    const g = document.createElement("div");
    g.className = "goal";
    g.innerHTML = `
            <p>${goal}</p>
            <button data-pos=${index} class="remove-goal">X</button>
        `;
    goalsContainer.appendChild(g);
  });
}

const addGoal = document.getElementById("add-goal-button");

addGoal.addEventListener("click", () => {
  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  const newGoal = document.getElementById("add-goal-input").value;

  if (newGoal) {
    goals.push(newGoal);
    saveGoals(goals);
  }
  document.getElementById("add-goal-input").value = "";
});
document.addEventListener("click", (e) => {
  if (e.target.matches(".remove-goal")) {
    e.preventDefault();
    const goalPos = e.target.dataset.pos;
    removeGoal(goalPos);
  }
});
loadGoals();

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
  const addButton = document.getElementById("add-site-btn");

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
    // link.innerHTML = `
    //         <img src="${getFavicon(site.url)}" alt="${site.name}">
    //     `;
    const button = document.createElement("button");
    button.setAttribute("data-url", site.url);
    button.classList.add("remove-site");
    button.innerHTML = `x`;

    const img = document.createElement("img");
    img.src = getImageNameFromUrl(site.url);
    img.onerror = function () {
      this.src = "./assets/default.png";
    };

    link.appendChild(button);
    link.appendChild(img);
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
  sites.push({ name, url });
  saveSites(sites);
}

// Modal Management
const modal = document.getElementById("add-site-modal");
const addSiteBtn = document.getElementById("add-site-btn");
const cancelBtn = document.getElementById("cancel-add-site");
const addSiteForm = document.getElementById("add-site-form");

addSiteBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  addSiteForm.reset();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    addSiteForm.reset();
  }
});

addSiteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("site-name").value;
  const url = document.getElementById("site-url").value;
  addSite(name, url);
  modal.style.display = "none";
  addSiteForm.reset();
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".remove-site")) {
    e.preventDefault();
    const url = e.target.dataset.url;
    removeSite(url);
  }
});

// Initialize sites
loadSites();

// Update Clock and Date
function updateTime() {
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

  document.getElementById("clock").textContent = timeString;
  document.getElementById("date").textContent = dateString;
}

setInterval(updateTime, 1000);
updateTime();

// Fetch News
// async function fetchNews() {
//     try {
//         const response = await fetch('https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=2cc3de72906545f39d6f4214b72c3eb5');
//         const data = await response.json();

//         const newsContainer = document.getElementById('news-container');

//         data.articles.slice(0, 6).forEach(article => {
//             const card = document.createElement('div');
//             card.className = 'news-card';

//             card.innerHTML = `
//                 <img src="${article.urlToImage || '/api/placeholder/400/200'}"
//                      alt="${article.title}">
//                 <h3>${article.title}</h3>
//                 <p>${article.description || ''}</p>
//                 <a href="${article.url}" target="_blank">Read more</a>
//             `;

//             newsContainer.appendChild(card);
//         });
//     } catch (error) {
//         console.error('Error fetching news:', error);
//     }
// }

// fetchNews();

// Todoist Integration
class TodoistIntegration {
  constructor() {
    this.apiToken = localStorage.getItem("todoist-token");
    this.baseUrl = "https://api.todoist.com/rest/v2";
  }

  async initialize() {
    const container = document.getElementById("todoist-container");

    if (!this.apiToken) {
      container.innerHTML = `
                <div class="todoist-setup">
                    <h2>Connect with Todoist</h2>
                    <p style="margin: 1rem 0;">
                        Connect your Todoist account to see and manage your tasks.
                    </p>
                    <button id="setup-todoist" class="setup-button button button-primary">
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
      modal.style.display = "flex";
    });

    cancelBtn?.addEventListener("click", () => {
      modal.style.display = "none";
      form.reset();
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = document.getElementById("api-token").value;
      this.apiToken = token;
      localStorage.setItem("todoist-token", token);
      modal.style.display = "none";
      await this.initialize();
    });
  }

  async fetchTasks() {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    return await response.json();
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
      checkbox.classList.add("completed");
      content.classList.add("completed");
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
      const container = document.getElementById("todoist-container");
      console.log(tasks);

      container.innerHTML = `
                <div class="tasks-header">
                    <h2>
                        <img src=${getImageNameFromUrl("https://todoist.com")}
                             alt="Todoist"
                             style="width: 24px; height: 24px;">
                        Inbox
                    </h2>
                </div>
                <ul class="tasks-list">
                    ${tasks
                      .map(
                        (task) => `
                        <li class="task-item" data-task-id="${task.id}">
                            <div class="task-checkbox ${
                              task.completed ? "completed" : ""
                            }"
                                 onclick="todoist.completeTask('${
                                   task.id
                                 }')"></div>
                            <span class="task-content ${
                              task.completed ? "completed" : ""
                            } priority-p${task.priority}">
                                ${task.content}
                            </span>
                            ${
                              task.due
                                ? `
                                <span class="task-due">
                                    ${this.formatDate(task.due.date)}
                                </span>
                            `
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
                                   placeholder="today, tomorrow, next Monday..."
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
      addTaskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = addTaskForm.querySelector(".add-task-input");
        const dueInput = document.getElementById("task-due");
        const priorityInput = document.getElementById("task-priority");

        const content = input.value;
        const dueDate = dueInput.value;
        const priority = priorityInput.value;

        try {
          await this.addTask(content, dueDate, priority);
          input.value = "";
          dueInput.value = "";
          priorityInput.value = "1";
          await this.loadTasks(); // Reload tasks
        } catch (error) {
          console.error("Failed to add task:", error);
        }
      });
    } catch (error) {
      console.error("Failed to load tasks:", error);
      const container = document.getElementById("todoist-container");
      container.innerHTML = `
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

// Initialize Todoist integration
const todoist = new TodoistIntegration();
todoist.initialize();

// Quote Implementation
async function fetchQuote() {
  const response = await fetch("https://thequoteshub.com/api/");
  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }
  return await response.json();
}

async function loadQuote() {
  try {
    let quote;
    const today = new Date().toLocaleDateString();
    const storedData = localStorage.getItem("dailyQuote");

    if (storedData) {
      const { date, quoteData } = JSON.parse(storedData);

      if (date === today) {
        // Use stored quote if it's from today
        quote = quoteData;
        console.log("Quote loaded from storage");
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
        console.log("New quote fetched and stored");
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
      console.log("First quote fetched and stored");
    }

    const html = `
        <blockquote>&ldquo;${quote.text}&rdquo; <footer>&mdash; <cite>${quote.author}</cite></footer></blockquote>
      `;
    const quotesContainer = document.getElementById("quotes-section");
    quotesContainer.innerHTML = html;
  } catch (error) {
    console.log("Failed to load quote:", error);
  }
}

loadQuote();

// Weather

async function fetchWeather(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,wind_speed_10m,wind_direction_10m&timezone=auto`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Weather");
  }
  return await response.json();
}

async function loadWeather() {
  try {
    let weather;
    const currentTime = new Date().getTime();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const storedData = localStorage.getItem("weather");

    if (storedData) {
      const { timestamp, location, lat, lon, weatherData } =
        JSON.parse(storedData);

      if (currentTime - timestamp < TWO_HOURS) {
        // Use stored quote if it's from today
        weather = weatherData;
        console.log("Weather loaded from storage");
      } else {
        // Fetch new quote if date has changed
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
      }
    } else {
      const html = `
                <button id="add-location" class="button button-primary">Add location</button>
            `;
      const weatherContainer = document.getElementById("weather-container");
      weatherContainer.innerHTML = html;
      return;
    }

    const html = `
        <span id="edit-location" class="edit"><svg fill="#000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 528.899 528.899" xml:space="preserve">
<g>
	<path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z"/>
</g>

</svg></span>
          <div class="location-name">Harnaut</div>

          <div class="temperature">
            <img alt='image' src="${
              weather.current.is_day ? "./assets/day.png" : "./assets/night.png"
            }">
            <span class="temperature-text">${weather.current.temperature_2m}${
      weather.current_units.temperature_2m
    }</span>
          </div>
          <div class="weather-details">
          <span class="weather-details-label">Humidity: </span><span class="weather-details-value">${
            weather.current.relative_humidity_2m
          }${weather.current_units.relative_humidity_2m}</span>
          </div>
          <div class="weather-details">
          <span class="weather-details-label">Feels like: </span><span class="weather-details-value">${
            weather.current.apparent_temperature
          }${weather.current_units.apparent_temperature}</span>
          </div>
        `;
    const weatherContainer = document.getElementById("weather-container");
    weatherContainer.innerHTML = html;
    const editLocation = document.getElementById("edit-location");
    editLocation?.addEventListener("click", () => {
      locationModal.style.display = "flex";
    });
  } catch (error) {
    console.error("Failed to load weather:", error);
  }
}

loadWeather();

const addLocationButton = document.getElementById("add-location");
const editLocation = document.getElementById("edit-location");
const locationModal = document.getElementById("add-weather-location-modal");
const locationForm = document.getElementById("add-location-form");
const locationCancel = document.getElementById("cancel-add-location");
const autoLocButton = document.getElementById("auto-loc-button");

async function addLocation(location, lat, lon) {
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
}

function showPosition(position) {
  const lat = document.getElementById("lat");
  const lon = document.getElementById("lon");
  lat.value = position.coords.latitude.toPrecision(6);
  lon.value = position.coords.longitude.toPrecision(6);
}

autoLocButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported.");
  }
});

editLocation?.addEventListener("click", () => {
  locationModal.style.display = "flex";
});

addLocationButton?.addEventListener("click", () => {
  locationModal.style.display = "flex";
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
  const name = document.getElementById("location-name").value;
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("lon").value;
  addLocation(name, lat, lon);
  locationModal.style.display = "none";
  locationForm.reset();
});

// Search bar

class SearchBar {
  constructor() {
    this.form = document.getElementById("searchForm");
    this.input = document.getElementById("searchInput");
    this.suggestionsContainer = document.getElementById("suggestionsContainer");
    this.selectedIndex = -1;
    this.suggestions = [];

    this.initializeEventListeners();
    this.loadUrlHistory();
    this.input.focus();
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

// Initialize the search bar
new SearchBar();
