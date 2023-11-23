<?php

require '.././mongodb/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Database connection
    $mongoClient = new MongoDB\Client("mongodb+srv://brusooo:brusooo@cluster0.bcpu8.mongodb.net/?retryWrites=true&w=majority");
    $mongoDB = $mongoClient->theboss;
    $mongoCollection = $mongoDB->userscollection;

    // Access token from the client
    $accessToken = $_GET["access_token"];

    // Fetching user details from MongoDB
    $user = fetchUserDetails($mongoCollection, $accessToken);

    // Sending user details as JSON response
    echo json_encode($user);
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Access token from the client
    $accessToken = $_POST["access_token"];

    // Fetching MongoDB details
    $mongoClient = new MongoDB\Client("mongodb+srv://brusooo:brusooo@cluster0.bcpu8.mongodb.net/?retryWrites=true&w=majority");
    $mongoDB = $mongoClient->theboss;
    $mongoCollection = $mongoDB->userscollection;

    // Get all available user details from MongoDB
    $user = $mongoCollection->findOne(["access_token" => $accessToken]);

    // Convert BSONDocument to array
    $userArray = iterator_to_array($user);

    // Extract changed values from the POST data
    $changedValues = array_intersect_key($_POST, $userArray);

    // Update user details based on access token with only the changed values
    $updateResult = $mongoCollection->updateOne(
        ["access_token" => $accessToken],
        ['$set' => $changedValues]
    );

    // Respond with success or error message
    if ($updateResult->getModifiedCount() > 0) {
        echo json_encode(array("success" => true, "message" => "🎉Profile updated successfully"));
    } else {
        echo json_encode(array("success" => false, "message" => "None of the files updated"));
    }
} else {
    // Invalid request method
    echo json_encode(array("success" => false, "message" => "❌ Oops! Invalid request"));
}

// Function to fetch user details from MongoDB using the access token
function fetchUserDetails($mongoCollection, $accessToken) {
    // Fetching user details based on access token
    $user = $mongoCollection->findOne(
        ["access_token" => $accessToken],
        ["projection" => ["password" => 0, "_id" => 0]] // Excluding the "password" field
    );

    return $user;
}
?>
