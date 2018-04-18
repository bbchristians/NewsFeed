<?php
session_start();

$_SESSION["cat"] = "";
if (isset($_GET["cat"])) {
    $_SESSION["cat"] = $_GET["cat"];
}

if ($_SESSION["cat"]!="") {
    $cat = $_SESSION["cat"];
    echo "You entered: ".$cat;
}

?>

<form method="GET">
    <input name="cat">
    <input type="submit">
</form>

<ul>
    <li><a href="index.php">To Index</a></li>
    <li><a href="session1.php">To Session1</a></li>
    <li><a href="session2.php">To Session2</a></li>
</ul>
