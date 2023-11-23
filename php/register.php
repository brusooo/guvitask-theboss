<?php
require '.././mongodb/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // * Database connection
    $conn = require_once("db.php");
    
    // * registration data from the client
    $username = $_POST["username"];
    $email = $_POST["email"];
    $password = $_POST["password"];


    // * Check if username or email already exists
    $checkUserStmt = $conn->prepare("SELECT username, email FROM users WHERE username = ? OR email = ?");
    $checkUserStmt->bind_param("ss", $username, $email);
    $checkUserStmt->execute();
    $checkUserStmt->store_result();

    if ($checkUserStmt->num_rows > 0) {
        $checkUserStmt->bind_result($existingUsername, $existingEmail);
        $checkUserStmt->fetch();

        // Check which field is already taken
        if ($existingUsername == $username) {
            echo json_encode(array("status" => "error", "message" => "❌ Username already taken"));
        } else {
            echo json_encode(array("status" => "warning", "message" => "⚠️ Email already registered"));
        }
    } else {

        // //*mongodb connection
        $mongoClient = new MongoDB\Client("mongodb+srv://brusooo:brusooo@cluster0.bcpu8.mongodb.net/?retryWrites=true&w=majority");
        $mongoDB = $mongoClient->theboss;
        $mongoCollection = $mongoDB->userscollection;

        
        
        // * Hash the password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // * MongoDB document
        $document = [
            'username' => $username,
            'email' => $email,
            'password' => $hashedPassword,
        ];
        
        // * storing user details in the database and binding
        $stmt = $conn->prepare("INSERT INTO users(username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $hashedPassword)  ;
        
        // ! Statements execution
        $mysqlResult = $stmt->execute();
        $mongoResult = $mongoCollection->insertOne($document);
        
        // * Check results and respond accordingly

        // if ($mysqlResult) {
        if ($mysqlResult && $mongoResult) {
            // * if the user details is stored successfully
            echo json_encode(array("status" => "success", "message" => "🎉 Registration successful"));
        } else {
            // * if the user details is not stored successfully
            echo json_encode(array("status" => "error", "message" => "❌ Error occurred: " . $stmt->error));
        }

        // * Closing of the statement
        $stmt->close();
    }

    // * Closing of the check statement and connection
    $checkUserStmt->close();
    $conn->close();
} else {
    echo "❌ Oops! Invalid request";
}
?>
