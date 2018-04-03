<?php
$file_name = 'js/users.json';
$username = $_POST["username"];
$last_login = $_POST["lastlogin"];

/*
$user_data = array (
  "username" => $username
);
*/

$file = file_get_contents($file_name);
$file = json_decode($file);

foreach($file->users as $user) {
  if ($user->username == $username) {
    $user->lastlogin = $last_login;
  }
}

//array_push($file->users, $user_data);

$json_data = json_encode($file);
var_dump($json_data);
file_put_contents($file_name, $json_data);
?>