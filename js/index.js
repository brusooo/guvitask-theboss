$(document).ready(function () {
    const accessToken = localStorage.getItem("access_token");
    const tokenExpires = localStorage.getItem("token_expires");
  
    // Check if access token is present in localStorage and not expired
    if (accessToken && tokenExpires && parseInt(tokenExpires) > Date.now() / 1000) {
      // User is logged in, redirect to profile page
      window.location.href = "profile.html";
    } else {
      // Access token is expired or not present, remove localStorage data
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expires");
    }
  });
  