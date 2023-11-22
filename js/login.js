$(document).ready(function () {
  const accessToken = localStorage.getItem("access_token");
  const tokenExpires = localStorage.getItem("token_expires");

  // Check if access token is present in localStorage and not expired
  if (
    accessToken &&
    tokenExpires &&
    parseInt(tokenExpires) > Date.now() / 1000
  ) {
    // User is logged in, redirect to profile page
    window.location.href = "profile.html";
  } else {
    // Access token is expired or not present, remove localStorage data
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expires");
  }
});

$(".submit_credentials_login").click(function (event) {
  event.preventDefault();

  // ! fetching the user details from the respective input elements
  const usernameEmail = $("#username_email_login").val();
  const password = $("#user_password_login").val();

  // ! Clear previous user information messages
  $(".info_msg_login").text("");

  // ! Validating inputs
  if (!usernameEmail || !password) {
    displayInfo("Both fields are required❗");
  } else {
    // ! If all validations pass, send the AJAX request to server
    sendLoginRequest(usernameEmail, password);
  }
});

// ! Function to display information messages
function displayInfo(message) {
  $(".info_msg_login").addClass("warning_message").text(message).show();
}

// ! AJAX request to server(login)
function sendLoginRequest(usernameEmail, password) {
  $.ajax({
    type: "POST",
    url: "http://localhost/theboss/php/login.php",
    data: {
      usernameEmail: usernameEmail,
      password: password,
    },
    success: function (res) {
      console.log(res);
      const response = JSON.parse(res);

      // * if user gets authenticated, they will navigated to
      // * profile page
      if (response.authenticated) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("token_expires", response.expires_in);
        $(".info_msg_login").removeClass("warning_message").hide();
        window.location.href = "profile.html";
      } else {
        displayInfo("Invalid credentials❗");
      }
    },
    error: function (error) {
      displayInfo("Oops❗ Error occurred");
    },
  });
}
