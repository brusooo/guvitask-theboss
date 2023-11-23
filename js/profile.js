// Store original values when the page loads
let initialFormValues = {};

// ! Function to display information messages
function displayWarnInfo(message) {
  $(".info_msg")
    .removeClass("success_message")
    .addClass("warning_message")
    .text(message)
    .show();
  setTimeout(() => {
    $(".info_msg")
      .hide()
      .text("")
      .removeClass("success_message")
      .removeClass("warning_message");
  }, 3000);
}

function displaySuccInfo(message) {
  $(".info_msg")
    .removeClass("warning_message")
    .addClass("success_message")
    .text(message)
    .show();

  setTimeout(() => {
    $(".info_msg")
      .hide()
      .text("")
      .removeClass("success_message")
      .removeClass("warning_message");
  }, 3000);
}

// Fetch user details and populate form
function populateForm(accessToken) {
  $.ajax({
    type: "GET",
    url: "http://localhost/theboss/php/profile.php",
    data: { access_token: accessToken },
    success: function (res) {
      const user = JSON.parse(res);

      initialFormValues = { ...user };

      // Populate form fields
      $("#username").val(user.username).prop("disabled", true);
      $("#firstName").val(user.firstName || "");
      $("#lastName").val(user.lastName || "");
      $("#email").val(user.email).prop("disabled", true);
      $("#dob").val(user.dob || "");
      $("#age").val(user.age || "");
      $("#phoneNumber").val(user.phoneNumber || "");

      $(".loader").hide();
      $(".profile_card").css("display", "flex");
    },
    error: function (error) {
      displayWarnInfo("Error fetching user details❗");
    },
  });
}

$(document).ready(function () {
  const accessToken = localStorage.getItem("access_token");
  const tokenExpires = localStorage.getItem("token_expires");

  // * Check if access token is present in localStorage and not expired
  if (
    !(accessToken && tokenExpires && parseInt(tokenExpires) > Date.now() / 1000)
  ) {
    // ! if Access token is expired or not present, redirect to login page
    window.location.href = "login.html";
  } else {
    // !Fetching user details from MongoDB database
    // !using the access token from the local storage
    $(".info_msg").text("");
    populateForm(accessToken);
  }
});

$(".save_credentials").click(function (event) {
  const form = $(".profile_form");

  // Serialize form data
  const formData = form.serialize();

  // Check for changes in form values
  const changedValues = {};
  Object.keys(initialFormValues).forEach((key) => {
    const currentValue = form.find(`[name="${key}"]`).val();
    if (initialFormValues[key] !== currentValue) {
      changedValues[key] = currentValue;
    }
  });

  // Include the access token in the data
  changedValues["access_token"] = localStorage.getItem("access_token");

  // Implement the logic to send a POST request to update MongoDB with the changed values
  $.ajax({
    type: "POST",
    url: "http://localhost/theboss/php/profile.php",
    data: changedValues,
    success: function (response) {
      const res = JSON.parse(response);
      if (res.success) {
        populateForm(localStorage.getItem("access_token"));
        displaySuccInfo(res.message);
      } else {
        displayWarnInfo(res.message);
      }
    },
    error: function (error) {
      displayWarnInfo("Oops❗ Error updating info");
    },
  });
});

// Cancel button click logic
$(".cancel_credentials").click(function () {
  // Restore form fields to original values
  $("#firstName").val(initialFormValues.firstName || "");
  $("#lastName").val(initialFormValues.lastName || "");
  $("#dob").val(initialFormValues.dob || "");
  $("#age").val(initialFormValues.age || "");
  $("#phoneNumber").val(initialFormValues.phoneNumber || "");
});
