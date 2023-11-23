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
  }, 10000);
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
  }, 10000);
}

function handleAuth(cardClass) {
  const loader = $(".loader");
  const auth_card = $(cardClass);
  const username = localStorage.getItem("username");

  $.ajax({
    type: "POST",
    url: "http://localhost/theboss/php/check_session.php", // Replace with the actual path to your PHP script
    data: {
      username: username,
    },
    success: function (response) {
      const result = JSON.parse(response);

      if (result.exists) {
        // If the server confirms authentication, redirect to profile page
        window.location.href = "profile.html";
      } else {
        // Handle the case where the token is not valid on the server
        // ! if access token is expired or not present, remove localStorage data
        localStorage.removeItem("username");
        auth_card.css("display", "flex").show();
        loader.hide();
      }
    },
    error: function (error) {
      console.log("Error checking token:", error);
    },
  });
}

// function handleAuth(cardClass) {
//   const loader = $(".loader");
//   const auth_card = $(cardClass);
//   const accessToken = localStorage.getItem("access_token");
//   const tokenExpires = localStorage.getItem("token_expires");

//   // ! Check if access token is present in localStorage and not expired
//   if (
//     accessToken &&
//     tokenExpires &&
//     parseInt(tokenExpires) > Date.now() / 1000
//   ) {
//     // ! if user is logged in, redirect to profile page
//     window.location.href = "profile.html";
//   } else {
//     // ! if access token is expired or not present, remove localStorage data
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("token_expires");
//     auth_card.css("display", "flex").show();
//     loader.hide();
//   }
// }

export { handleAuth, displaySuccInfo, displayWarnInfo };
