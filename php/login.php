<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // * Database connection
    $conn = require_once("db.php");
    $redis = require_once("redis.php");
    
    // * Login data from the client
    $usernameEmail = $_POST["usernameEmail"];
    $password = $_POST["password"];

    // * fetching details from database and binding
	$stmt = $conn->prepare("SELECT username, email, password FROM users WHERE (username = ? OR email = ?) LIMIT 1");
	$stmt->bind_param("ss", $usernameEmail, $usernameEmail);
	$stmt->execute();
	$stmt->store_result();
	
    // * Check if a user with the provided username or email exists
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($existingUsername, $existingEmail, $hashedPassword);
        $stmt->fetch();

        // * Verify the password
        if (password_verify($password, $hashedPassword)) {
            // * Password is correct, authentication successful
            
            $accessToken = bin2hex(random_bytes(32));

            // ! Updating the MongoDB document with the access token
            require '.././mongodb/autoload.php';
            $mongoClient = new MongoDB\Client("mongodb+srv://brusooo:brusooo@cluster0.bcpu8.mongodb.net/?retryWrites=true&w=majority");
            $mongoDB = $mongoClient->theboss;
            $mongoCollection = $mongoDB->userscollection;

            //  ! Update the document where the username matches
            $filter = ['username' => $existingUsername];
            $update = ['$set' => ['access_token' => $accessToken]];
            $result = $mongoCollection->updateOne($filter, $update);

            // ! Setting the user key in Redis example user:sample -> jou02t-2ejpjeg2p
            $redisKey = 'user:' . $existingUsername;

            // ! Set the key in Redis with a 2-hour expiration time (7200 seconds)
            $redis->setex($redisKey, 7200, $accessToken);
            
            if ($result->getModifiedCount() > 0) {
                // * Update successful
                echo json_encode(array("authenticated" => true, "username" => $existingUsername));
            } else {
                // * Update failed
                echo json_encode(array("authenticated" => false, "message" => "❌ Error updating access token"));
            }
        

        } else {
            // * Password is incorrect
            echo json_encode(array("authenticated" => false));
        }
    } else {
        // * No user with the provided username or email found
        echo json_encode(array("authenticated" => false));
    }

    // * Closing of the statement and connection
    $stmt->close();
    $conn->close();
} else {
    // * Invalid request method
    echo json_encode(array("authenticated" => false, "message" => "❌ Oops! Invalid request"));
}
?>
