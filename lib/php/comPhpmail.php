<?php

	$OtherData = explode("|", $FormData['fetchvalues']);
	$Subject = "Customer Quotation";

	$Headers = "MIME-Version: 1.0".PHP_EOL;
	$Headers .= "Content-type:text/html;charset=UTF-8".PHP_EOL;
	$Headers .= "From: webmaster@servicedcloud.com".PHP_EOL;	

	$Message = "<html>
		<head>
			<style>
				th {width:200px; background-color:cyan; text-align:left;}
			</style>
		</head>
		<body>
		<table>
			<tr> <td><th>Customer Name</th></td>	<td>".$FormData["client_name"]."</td> </tr>
			<tr> <td><th>Company Name</th></td>		<td>".$FormData["company_name"]."</td> </tr>
			<tr> <td><th>Email</th></td>			<td>".$FormData["client_email"]."</td> </tr>
			<tr> <td><th>Phone No</th></td>			<td>".$FormData["client_phone"]."</td> </tr>
		".PHP_EOL;
		
	foreach($OtherData as $a => $b){
		$OtherDataSub = explode('~', $b);
		$Message .= "<tr> <td><th>". $OtherDataSub[0] ."</th></td>	<td>". $OtherDataSub[1] ."</td> </tr>".PHP_EOL;
	}
		
	$Message .= "</table></body></html>".PHP_EOL;
	//die($Message);
	 
	if(mail($To,$Subject,$Message,$Headers))
		$Return = "EMAIL SENT";
	else
		$Return = "FAILED TO SEND EMAIL";



?>