<?php
// Start the session
session_start();
?>
<!DOCTYPE html>
<html>
<body>

<?php

// Read the sessions
if ($_SESSION["username"] != "") {
	if ($_SESSION["cat"]!="") {
    		$cat = $_SESSION["cat"];
    		echo "You entered: ".$cat;
	}
	echo "<h1>Hello ";
    echo $_SESSION["username"];
    echo "</h1> <a href='session3.php'>Take me to the assignment page</a>";
}else{
?>

	You are not a valid user


	<?php
}


?>



</body>
</html>