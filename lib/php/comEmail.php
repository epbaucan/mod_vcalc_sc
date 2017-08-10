<?php
		
		include('comSettings.php');   //Hubspot settings
				
		session_start();
		$FormData  = (!empty($_POST)) ? $_POST : $_GET; 
		
		if($processtype == 1) include('comPhpmail.php');
		else if($processtype == 3) include('comMautic.php');
		else include('comHubspot.php'); 
		
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($Return);

?>





