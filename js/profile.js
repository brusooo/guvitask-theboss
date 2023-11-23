import { displaySuccInfo, displayWarnInfo } from "./utils.js";
// Store original values when the page loads
let initialFormValues = {};

function userDataStore(accessToken) {
  $.ajax({
    type: "GET",
    url: "http://localhost/theboss/php/profile.php",
    data: { access_token: accessToken },
    success: function (res) {
      const user = JSON.parse(res);
      initialFormValues = {
        age: "",
        dob: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        ...user,
      };

      // * adding the data from the database to the input value
      $("#username").val(user.username).prop("disabled", true);
      $("#firstName").val(user.firstName || "");
      $("#lastName").val(user.lastName || "");
      $("#email").val(user.email).prop("disabled", true);
      $("#dob").val(user.dob || "");
      $("#age").val(user.age || "");
      $("#phoneNumber").val(user.phoneNumber || "");

      $(".loader").hide();
      $(".profile_card").css("display", "flex");
      $(".navbar").css("display", "flex");
    },
    error: function (_) {
      displayWarnInfo("Error fetching user details❗");
    },
  });
}

function getAccessToken(callback) {
  const username = localStorage.getItem("username");

  // Check if access token is present in session and not expired
  $.ajax({
    type: "POST",
    url: "http://localhost/theboss/php/check_session.php",
    data: {
      username: username,
    },
    success: function (response) {
      const result = JSON.parse(response);

      if (result.exists) {
        // If access token is valid, execute the callback with the result
        callback({ status: result.exists, accessToken: result.accessToken });
      } else {
        // If access token is expired or not present, execute the callback with the result
        callback({ status: result.exists });
      }
    },
    error: function (error) {
      callback({ status: false, error: "error Occurred" });
    },
  });
}

$(document).ready(function () {
  // ! Call getAccessToken with a callback to access the status

  getAccessToken(function (response) {
    // * if authenticated
    if (response.status) {
      userDataStore(response.accessToken);
    } else {
      // * if not authenticated
      window.location.href = "login.html";
    }
  });
});

// * save the changes
$(".save_credentials").click(function (event) {
  const form = $(".profile_form");

  // ! send the data fields that has changed
  const changedValues = {};
  Object.keys(initialFormValues).forEach((key) => {
    const currentValue = form.find(`[name="${key}"]`).val();
    if (initialFormValues[key] !== currentValue) {
      changedValues[key] = currentValue;
    }
  });

  getAccessToken(function (response) {
    // * if authenticated
    if (response.status) {
      changedValues["access_token"] = response.accessToken;

      $.ajax({
        type: "POST",
        url: "http://localhost/theboss/php/profile.php",
        data: changedValues,
        success: function (php_response) {
          const res = JSON.parse(php_response);
          if (res.success) {
            userDataStore(response.accessToken);
            displaySuccInfo(res.message);
          } else {
            displayWarnInfo(res.message);
          }
        },
        error: function (_) {
          displayWarnInfo("Oops❗ Error updating info");
        },
      });
    } else {
      // * if not authenticated
      displayWarnInfo("Oops❗ Auth Failed");
    }
  });
});

// ? cacnel the changes
$(".cancel_credentials").click(function () {
  // * Restore form fields to original values
  $("#firstName").val(initialFormValues.firstName || "");
  $("#lastName").val(initialFormValues.lastName || "");
  $("#dob").val(initialFormValues.dob || "");
  $("#age").val(initialFormValues.age || "");
  $("#phoneNumber").val(initialFormValues.phoneNumber || "");
});

// * Logout section
$(".logout").click(function () {
  $(".loader").show();
  $(".profile_card").css("display", "none");
  $(".navbar").css("display", "none");
  const username = localStorage.getItem("username");

  // ! Send a GET request to logout
  $.ajax({
    type: "GET",
    url: "http://localhost/theboss/php/check_session.php",
    data: {
      username: username,
    },
    success: function (response) {
      const result = JSON.parse(response);
      if (result.success) {
        // ! Successfully logged out, redirecting
        localStorage.removeItem("username");
        window.location.href = "login.html";
      } else {
        $(".loader").show();
        $(".profile_card").css("display", "none");
        $(".navbar").css("display", "none");
        displayWarnInfo("Error logging out:");
      }
    },
    error: function (_) {
      $(".loader").show();
      $(".profile_card").css("display", "none");
      $(".navbar").css("display", "none");

      displayWarnInfo("Error logging out:");
    },
  });
});
