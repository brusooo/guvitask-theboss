<?php 
    $redis = require_once("redis.php");
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // ! fetching the username from the req
        $username = $_POST['username'];

        // ! Check if the user key exists in Redis
        $redisKey = 'user:' . $username;
        $exists = $redis->exists($redisKey);

        // ! Respond to the AJAX request from the client
        if ($exists) {
            // * If the user exists, fetch the access token from Redis
            $accessToken = $redis->get($redisKey);

            // ! Send a JSON response with the access token
            echo json_encode(['exists' => true, 'accessToken' => $accessToken]);
        } else {
            // ! If the user doesn't exist send exists false
            echo json_encode(['exists' => false]);
        }
    }
    elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
        // Fetch the username from the session or wherever it's stored
        $username = $_GET['username'];
    
        // Remove the user key from Redis
        $redisKey = 'user:' . $username;
        $redis->del($redisKey);
    
        // Respond with a success message
        echo json_encode(['success' => true, 'message' => 'User successfully logged out']);
    } else {
        // Invalid request method
        echo "❌ Oops! Invalid request";
    }
?>
