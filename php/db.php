<?php

// * required credentials
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "theboss";

// * connection string
$conn = new mysqli($servername, $username, $password, $dbname);


// * Check connection
if (mysqli_connect_error()) {
    die("Connection failed: " . mysqli_connect_error());
}
return $conn;
?>
