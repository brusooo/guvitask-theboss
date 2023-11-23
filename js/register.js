$(document).ready(function () {
  const loader = $(".loader");
  const auth_card = $(".authentication_card_register");
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
    auth_card.show();
    loader.hide();
  }
});

$(".submit_credentials_register").click(function (event) {
  event.preventDefault();

  // ! fetching the user details from the respective input elements
  const $username = $("#username");
  const $email = $("#register_email");
  const $password = $("#user_password_register");
  const $confirmPassword = $("#confirm_password_register");
  const $infoMsg = $(".info_msg");

  // ! Clearing previous info messages
  $infoMsg.text("");

  // ! Validating all user inputs
  switch (true) {
    case !$username.val():
      displayInfo("Username is required❗.");
      break;

    case !$email.val():
      displayInfo("Email is required❗.");
      break;

    case !isValidEmail($email.val()):
      displayInfo("Enter a valid email address❗.");
      break;

    case !$password.val():
      displayInfo("Password is required❗.");
      break;

    case $password.val().length < 6 || $password.val().length > 12:
      displayInfo("Password must be 6 to 12 characters in length❗.");
      break;

    case $password.val() !== $confirmPassword.val():
      displayInfo("Passwords didn't match❗.");
      break;

    default:
      // ! If all validations pass, AJAX request will be sent
      sendAjaxRequest();
  }
});

// ! Function to display information messages
function displayInfo(message) {
  const $infoMsg = $(".info_msg");
  $infoMsg.addClass("warning_message").text(message).show();
}

// ! Function to validate email format
function isValidEmail(email) {
  // * Regex for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to send AJAX request
function sendAjaxRequest() {
  const $username = $("#username");
  const $email = $("#register_email");
  const $password = $("#user_password_register");
  const $cnf_pwd = $("#confirm_password_register");

  $.ajax({
    type: "POST",
    url: "http://localhost/theboss/php/register.php",
    data: {
      username: $username.val(),
      email: $email.val(),
      password: $password.val(),
    },
    success: function (res) {
      console.log(res);
      const response = JSON.parse(res);

      const $infoMsg = $(".info_msg");

      if (response.status === "success") {
        // ! Clear input fields after successful registration
        $username.val("");
        $email.val("");
        $password.val("");
        $cnf_pwd.val("");

        // ! display successfull message to the user
        $infoMsg
          .removeClass("warning_message")
          .addClass("success_message")
          .text(response.message)
          .show();

        // ! hiding the success message after 3s
        setTimeout(function () {
          $infoMsg.hide().removeClass("success_message").text("");
        }, 3000);
      } else {
        // * warning message if any error occurs
        $infoMsg.addClass("warning_message").text(response.message);
      }
    },
    error: function (error) {
      // * warning message if any error occurs
      const $infoMsg = $(".info_msg");
      $infoMsg.addClass("warning_message").text("Oops❗Error Occurred.");
    },
  });
}
