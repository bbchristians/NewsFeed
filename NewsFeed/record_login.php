<?php
$file_name = 'js/users.json';
$username = $_GET["username"];
$last_login = $_GET["lastlogin"];

$file = file_get_contents($file_name);
$file = json_decode($file);

foreach($file->users as $user) {

  if ($user->username == $username) {
      $file->users[array_search($user,$file->users)]->lastlogin = $last_login;
  }
}

$json_data = json_encode($file);

file_put_contents($file_name, $json_data);
echo $_GET["username"].":".$_GET["lastlogin"];
?>
