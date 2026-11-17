// A10 - Set a cookie and display it when the page is reloaded.
// Based on the setCookie / getCookie pattern from w3schools.com/js/js_cookies.asp

// Create (or overwrite) a cookie that expires in `days` days
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// Return the value of a cookie, or "" if it does not exist
function getCookie(name) {
  const prefix = name + "=";
  const parts = document.cookie.split(";");
  for (let i = 0; i < parts.length; i++) {
    let c = parts[i].trim();
    if (c.indexOf(prefix) === 0) {
      return decodeURIComponent(c.substring(prefix.length));
    }
  }
  return "";
}

// Delete a cookie by setting its expiration date in the past
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// Show the cookie values on the page
function displayCookies() {
  const greeting = document.getElementById("greeting");
  const display = document.getElementById("cookieDisplay");

  const username = getCookie("username");
  const visits = getCookie("visits");
  const lastVisit = getCookie("lastVisit");

  if (username !== "") {
    greeting.innerHTML =
      "<h2>Welcome back, " + escapeHTML(username) + "!</h2>" +
      "<p>This value was read from the <strong>username</strong> cookie.</p>" +
      "<p>You have loaded this page <strong>" + visits + "</strong> time(s)." +
      (lastVisit ? " Previous visit: " + escapeHTML(lastVisit) : "") + "</p>";
  } else {
    greeting.innerHTML =
      "<h2>Hello, new visitor!</h2>" +
      "<p>No <strong>username</strong> cookie was found. Enter your name below, then reload the page.</p>" +
      "<p>Page loads counted so far: <strong>" + visits + "</strong></p>";
  }

  display.textContent = document.cookie === "" ? "(no cookies set)" : document.cookie.split("; ").join("\n");
}

// Prevent HTML from a cookie value being rendered as markup
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

// Runs every time the page loads
window.addEventListener("load", function () {
  // Count page loads with a cookie
  let visits = parseInt(getCookie("visits"), 10);
  visits = isNaN(visits) ? 1 : visits + 1;
  setCookie("visits", visits, 30);

  // Display everything (lastVisit still holds the PREVIOUS visit time here)
  displayCookies();

  // Now record this visit's time for next reload
  setCookie("lastVisit", new Date().toLocaleString(), 30);

  // Save the username cookie when the form is submitted
  document.getElementById("cookieForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("username").value.trim();
    if (name !== "") {
      setCookie("username", name, 30);
      alertBox("Cookie saved! Click \"Reload Page\" to see it displayed.");
      displayCookies();
    }
  });

  document.getElementById("reloadBtn").addEventListener("click", function () {
    location.reload();
  });

  document.getElementById("deleteBtn").addEventListener("click", function () {
    deleteCookie("username");
    deleteCookie("visits");
    deleteCookie("lastVisit");
    alertBox("Cookies deleted. Reload to start over.");
    displayCookies();
  });
});

// Simple inline message (avoids blocking alert() popups)
function alertBox(msg) {
  let box = document.getElementById("msg");
  if (!box) {
    box = document.createElement("p");
    box.id = "msg";
    box.style.color = "#2e7d32";
    box.style.fontWeight = "bold";
    document.getElementById("cookieForm").after(box);
  }
  box.textContent = msg;
}
