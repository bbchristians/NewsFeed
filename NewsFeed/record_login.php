<?php
$file_name = 'js/users.json';
$username = $_POST["username"];
$last_login = $_POST["lastlogin"];

$file = file_get_contents($file_name);
$file = json_decode($file);

foreach($file->users as $user) {

  if ($user->username == $username) {
    $user->lastlogin = $last_login;
  }
}

$json_data = json_encode($file);

file_put_contents($file_name, $json_data);
?>