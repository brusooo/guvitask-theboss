import { handleAuth, displaySuccInfo, displayWarnInfo } from "./utils.js";
$(document).ready(function () {
  handleAuth(".authentication_card_login");
});

$(".submit_credentials_login").click(function (event) {
  event.preventDefault();

  // ! fetching the user details from the respective input elements
  const usernameEmail = $("#username_email_login").val();
  const password = $("#user_password_login").val();

  // ! Clear previous user information messages
  $(".info_msg").text("");

  // ! Validating inputs
  if (!usernameEmail || !password) {
    displayWarnInfo("Both fields are required❗");
  } else {
    // ! If all validations pass, send the AJAX request to server
    sendLoginRequest(usernameEmail, password);
  }
});


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
      const response = JSON.parse(res);

      // * if user gets authenticated, they will navigated to
      // * profile page
      if (response.authenticated) {
        localStorage.setItem("username", response.username);
        window.location.href = "profile.html";
      } else {
        displayWarnInfo("Invalid credentials❗");
      }
    },
    error: function (error) {
      displayWarnInfo("Oops❗ Error occurred");
    },
  });
}
