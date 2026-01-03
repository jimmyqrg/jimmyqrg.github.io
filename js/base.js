(function () {
  const allowedDomain = "az7qm9r2xfk8lwt4hcp.jimmyqrg.com";

  // Current hostname (no protocol, no path)
  const currentDomain = window.location.hostname;

  // Redirect if NOT on the allowed domain
  if (currentDomain !== allowedDomain) {
    window.location.replace("/Index.html"); // capital I
  }
})();
