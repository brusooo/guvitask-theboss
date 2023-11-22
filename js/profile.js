$(document).ready(function () {
  const accessToken = localStorage.getItem("access_token");
  const tokenExpires = localStorage.getItem("token_expires");

  // Check if access token is present in localStorage and not expired
  if (
    !(accessToken && tokenExpires && parseInt(tokenExpires) > Date.now() / 1000)
  ) {
    // Access token is expired or not present, redirect to login page
    window.location.href = "login.html";
  }
});
