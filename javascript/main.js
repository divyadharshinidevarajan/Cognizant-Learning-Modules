// Task 1: Basic Setup
console.log("Welcome to the Community Portal");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded"); // Task 13: Debugging
  alert("Welcome to the Community Portal");
});

// Task 5: Event Constructor
function Event(name, date, seats, category, id) {
  this.name = name;
  this.date = new Date(date);
  this.seats = seats;
  this.category = category;
  this.id = id;
}
Event.prototype.checkAvailability = function () {
  return this.seats > 0 && this.date > new Date();
};

// Task 2 & 6: Event Data and Array
const events = [
  new Event("Music Festival", "2025-06-15", 50, "Festival", 1),
  new Event("Baking Workshop", "2025-07-10", 20, "Workshop", 2),
  new Event("Art Fair", "2025-05-20", 0, "Festival", 3), // No seats
  new Event("Tech Talk", "2025-04-10", 30, "Workshop", 4), // Past event
];

// Task 5: Log object keys and values
console.log("Event keys and values:", Object.entries(events[0]));

// Task 9 & 12: Mock API for async operations
const mockApi = {
  fetchEvents: () => new Promise((resolve, reject) => {
    console.log("Fetching events from mock API..."); // Task 13
    setTimeout(() => {
      if (events.length) {
        resolve([...events]); // Task 10: Spread operator
      } else {
        reject(new Error("No events available"));
      }
    }, 1000);
  }),
  postRegistration: (userData) => new Promise((resolve, reject) => {
    console.log("Posting registration data:", userData); // Task 13
    setTimeout(() => {
      if (userData.name && userData.email) {
        resolve({ status: "success", message: "Registration submitted" });
      } else {
        reject(new Error("Invalid registration data"));
      }
    }, 1000);
  })
};

// Task 4: Closure to track registrations
const registrationCounter = () => {
  let total = 0;
  return () => {
    total++; // Task 2: ++ operator
    console.log(`Total registrations: ${total}`); // Task 13
    return total;
  };
};
const countRegistration = registrationCounter();

// Task 4 & 10: Reusable Functions with default parameters
function addEvent(name, date, seats = 50, category, id) {
  events.push(new Event(name, date, seats, category, id));
  renderEvents();
}

function registerUser(eventId, userDetails) {
  console.log(`Registering for event ID ${eventId} with details:`, userDetails); // Task 13
  try {
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");
    if (!event.checkAvailability()) throw new Error("Event not available");
    event.seats--; // Task 2: Decrement seats
    const total = countRegistration();
    console.log(`Registered for ${event.name}. Total registrations: ${total}`); // Task 2
    return true;
  } catch (error) {
    console.error("Registration error:", error.message); // Task 3
    return false;
  }
}

function filterEventsByCategory(category, callback) {
  return events
    .filter((event) => event.category.toLowerCase() === category.toLowerCase() && event.checkAvailability())
    .map(callback);
}

// Task 7: DOM Manipulation
function renderEvents() {
  const table = document.querySelector("table");
  table.innerHTML = "<caption>Upcoming Community Events</caption>";

  // Task 3: Filter valid events
  events.forEach((event) => {
    if (event.checkAvailability()) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <img src="https://via.placeholder.com/100" class="event-img" alt="${event.name}">
          ${event.name} - ${event.date.toDateString()} (${event.seats} seats left)
          <button class="register-btn" data-id="${event.id}">Register</button>
        </td>
      `;
      table.appendChild(row);
    }
  });

  // Task 14: jQuery for register button clicks
  $(".register-btn").off("click").click(function () {
    const eventId = parseInt($(this).data("id"));
    registerUser(eventId, {}).then((success) => {
      if (success) {
        $(this).parent().fadeOut(500, () => renderEvents()); // Task 14: Fade out
      }
    });
  });
}

// Task 9: Async event fetching with spinner
function fetchAndRenderEvents() {
  $("#loadingSpinner").fadeIn(300); // Task 14
  mockApi
    .fetchEvents()
    .then((fetchedEvents) => {
      console.log("Fetched events:", fetchedEvents); // Task 13
      events.length = 0;
      events.push(...fetchedEvents); // Task 10: Spread
      renderEvents();
    })
    .catch((error) => {
      console.error("Fetch error:", error.message); // Task 13
      $("#outputMsg").text("Failed to load events.").css("color", "red");
    })
    .finally(() => {
      $("#loadingSpinner").fadeOut(300); // Task 14
    });
}

// Task 11 & 12: Form Handling with async POST
function submitForm(event) {
  event.preventDefault(); // Task 11
  console.log("Form submission started"); // Task 13
  const form = event.target;
  const { name, email, eventType } = form.elements; // Task 10: Destructuring

  // Validation
  if (!name.value || !email.value || !eventType.value) {
    $("#outputMsg").text("Please fill all required fields.").css("color", "red"); // Task 14
    return;
  }

  const selectedEvent = events.find((e) => e.category === eventType.value && e.checkAvailability());
  if (!selectedEvent) {
    $("#outputMsg").text("No available events for selected category.").css("color", "red");
    return;
  }

  $("#loadingSpinner").fadeIn(300); // Task 9 & 14
  mockApi
    .postRegistration({ name: name.value, email: email.value })
    .then((response) => {
      console.log("POST response:", response); // Task 13
      return registerUser(selectedEvent.id, { name: name.value, email: email.value });
    })
    .then((success) => {
      $("#outputMsg").text(
        success
          ? `Successfully registered for ${selectedEvent.name}!`
          : "Registration failed. Try another event."
      ).css("color", success ? "green" : "red");
    })
    .catch((error) => {
      console.error("POST error:", error.message); // Task 13
      $("#outputMsg").text("Registration failed.").css("color", "red");
    })
    .finally(() => {
      $("#loadingSpinner").fadeOut(300); // Task 14
    });
}

// Task 11: Clear Preferences
function clearPreferences() {
  console.log("Clearing preferences"); // Task 13
  const form = document.querySelector("form");
  form.reset();
  $("#charCount").text("Characters: 0"); // Task 14
  $("#outputMsg").text("");
}

// Task 8: Event Handling
document.querySelector("form").addEventListener("submit", submitForm);
document.getElementById("message").addEventListener("input", (e) => {
  $("#charCount").text(`Characters: ${e.target.value.length}`); // Task 14
});

// Task 8: Quick search by name
document.getElementById("name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = events.filter(
      (event) => event.name.toLowerCase().includes(searchTerm) && event.checkAvailability()
    );
    console.log("Quick search results:", filtered); // Task 13
    $("#outputMsg").text(`Found ${filtered.length} matching events.`).css("color", "blue"); // Task 14
  }
});

// Task 10: Filter events by category
document.getElementById("eventType").addEventListener("change", (e) => {
  const category = e.target.value;
  const formatCard = ({ name, date, seats = 0 }) => `${name} on ${date.toDateString()} (Seats: ${seats})`; // Task 10
  const filteredEvents = filterEventsByCategory(category, formatCard);
  console.log("Filtered events:", ...filteredEvents); // Task 10: Spread
});

// Task 14: Framework benefit
console.log("Benefit of React: Component-based architecture simplifies state management and UI updates.");

// Initial fetch and render
fetchAndRenderEvents();