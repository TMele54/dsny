<?php
	$fname = $_POST['fname'];
	$email = $_POST['email'];
	$message = $_POST['message'];
	$recipient = "DataScienceNewYork@Gmail.com";
	$mailheader = "Name: $fname \r\n Email: $email \r\n Message: $message \r\n";
	$formcontent=" From: $fname \n";
	mail($recipient, $formcontent, $mailheader) or die("Error!");
	header("location: thank-you.html");
?>