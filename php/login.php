<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // * Database connection
    $conn = require_once("db.php");
    
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

            // Store access token and expiration time in the database
            $expirationTime = time() + (60 * 60); // Expire in 1 hour
        
            echo json_encode(array("authenticated" => true, "access_token" => $accessToken, "expires_in" => $expirationTime));
        

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
