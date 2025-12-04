// -----------------------
// Authorization check
// -----------------------
if (typeof user === "undefined" || user !== "authorized") {
    window.location.href = "https://jimmyqrg.github.io/404-denined";
}

// -----------------------
// Logging helper
// -----------------------
function log(msg) {
  const el = document.getElementById("log");
  el.innerHTML += msg + "<br>";
  el.scrollTop = el.scrollHeight;
}
