<?php

$id=$_POST["fav_id"];
$operation=$_POST["operation"];
$username=$_POST["username"];

$file_name = 'js/users.json';
$file = file_get_contents($file_name);
$file = json_decode($file);

foreach($file->users as $user) {

    if ($user->username == "test123") {//$username) {
        $user_fav_list = $user->favorites;

        if ($operation == "favorite") {
            // Add to list of favorites
            if (!in_array($id, $user_fav_list)) {
                array_push($user_fav_list, $id);
		echo "Value Added</br>";
		var_dump($user_fav_list);
                $file->users[array_search($user,$file->users)]->favorites = array_values($user_fav_list);
            }
        }else {
            // Remove from list of favorites
            if (($key = array_search($id, $user_fav_list)) !== false) {
                unset($user_fav_list[$key]);
		echo "Value Removed</br>";
		var_dump($user_fav_list);
                $file->users[array_search($user,$file->users)]->favorites = array_values($user_fav_list);
            }
        }
    }
}

$json_data = json_encode($file);

file_put_contents($file_name, $json_data);
?>
