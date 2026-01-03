// -----------------------
// Authorization check
// -----------------------
let user = localStorage.getItem("user");

if (typeof user === "undefined" || user !== "authorized") {
    window.location.href = "https://az7qm9r2xfk8lwt4hcp.jimmyqrg.com/403";
}

// -----------------------
// Logging helper
// -----------------------
function log(msg) {
  const el = document.getElementById("log");
  el.innerHTML += msg + "<br>";
  el.scrollTop = el.scrollHeight;
}
