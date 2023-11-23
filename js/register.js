import { handleAuth, displaySuccInfo, displayWarnInfo } from "./utils.js";

$(document).ready(function () {
  handleAuth(".authentication_card_register");
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
      displayWarnInfo("Username is required❗.");
      break;

    case !$email.val():
      displayWarnInfo("Email is required❗.");
      break;

    case !isValidEmail($email.val()):
      displayWarnInfo("Enter a valid email address❗.");
      break;

    case !$password.val():
      displayWarnInfo("Password is required❗.");
      break;

    case $password.val().length < 6 || $password.val().length > 12:
      displayWarnInfo("Password must be 6 to 12 characters in length❗.");
      break;

    case $password.val() !== $confirmPassword.val():
      displayWarnInfo("Passwords didn't match❗.");
      break;

    default:
      // ! If all validations pass, AJAX request will be sent
      sendAjaxRequest();
  }
});

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
        displaySuccInfo(response.message);
      } else {
        // * warning message if any error occurs
        displayWarnInfo(response.message);
      }
    },
    error: function (error) {
      // * warning message if any error occurs
      displayWarnInfo("Oops❗Error Occurred.");
    },
  });
}
