<?php

// * required credentials
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "theboss";

// * connection string
$conn = new mysqli($servername, $username, $password, $dbname);


// * Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }
return $conn;
?>
