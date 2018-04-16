<?php

$servername = "localhost";
$username = "root";
$password = null;
$db = "internship";
$conn = mysqli_connect($servername, $username, $password, $db);

// Check connection

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}


$return_array = array();

$query = "SELECT * 
FROM internship.markers m1
WHERE  m1.`Number` = (SELECT MAX(`Number`)
                      FROM internship.markers m2
                      WHERE m1.DeviceID = m2.DeviceID);";

$result = mysqli_query($conn,$query);

while ($row = $result->fetch_assoc()) {
    array_push($return_array,$row);;
}
$conn->close();
echo json_encode($return_array);
