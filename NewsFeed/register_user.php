<?php
$file_name = 'js/users.json';
$username = $_POST["username"];
$password = $_POST["password"];

$user_data = array (
  "username" => $username,
  "password" => $password
);

$file = file_get_contents($file_name);
$file = json_decode($file);

array_push($file->users, $user_data);

$json_data = json_encode($file);
var_dump($json_data);
file_put_contents($file_name, $json_data);
?>