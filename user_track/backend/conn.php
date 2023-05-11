<?php

// $servername = 'localhost';
// $username = 'root';
// $password = '';
// $dbname = 'analytics_db';

$servername = "localhost";
$dbname = "onceptua_analytics_db"; 

$username = "onceptua_admin";
$password = "Onceptual@123";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) 
{
 die('Connection failed: ' . $conn->connect_error);
} 
//echo 'Connected successfully';

?>