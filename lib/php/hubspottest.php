<?php


	include('comSettings.php');   //Hubspot settings
	
	$Message   = "";
	$FormData  = (!empty($_POST)) ? $_POST : $_GET; 
	
	$cName     = (isset($FormData["client_name"])) ? $FormData["client_name"] : "Test Test";
	$comName   = (isset($FormData["company_name"])) ? $FormData["company_name"] : "Test Inc.";
	$cEmail    = (isset($FormData["client_email"])) ? $FormData["client_email"] : "paul@pc-ready.net";
	$cPhone    = (isset($FormData["client_phone"])) ? $FormData["client_phone"] : "09995211268";
	$OtherData = (isset($FormData["fetchvalues"])) ? explode("|", $FormData['fetchvalues']) : array();
	
	if(sizeof($OtherData) > 0){
		foreach($OtherData as $a => $b){
			$OtherDataSub = explode('~', $b);
			$Message .= "&" . strtolower(str_replace(' ', '_', $OtherDataSub[0])) . "=" . urlencode($OtherDataSub[1]);
		}
	}		
		
	$hubspotutk      = $_COOKIE['hubspotutk']; //grab the cookie from the visitors browser.
	$ip_addr         = $_SERVER['REMOTE_ADDR']; //IP address too.
	$formGuid        = 'd9ed8af2-2d3b-4712-8166-f8e2f2e6c5e8';
	$formName        = 'Calculator Lead2';
	
	$hs_context      = array(
		'hutk' => $hubspotutk,
		'ipAddress' => $ip_addr,
		'pageUrl' => $pageUrl,
		'pageName' => $formName
	);
	
	$hs_context_json = json_encode($hs_context);
					
	//Need to populate these varilables with values from the form.
	$str_post = "client_name=" . urlencode($cName) 
		. "&company=" . urlencode($comName) 
		. "&email=" . urlencode($cEmail) 
		. "&phone=" . urlencode($cPhone) 
		. $Message 
		. "&hs_context=" . urlencode($hs_context_json); //Leave this one be
	
	//replace the values in this URL with your portal ID and your form GUID
	$endpoint = "https://forms.hubspot.com/uploads/form/v2/$portalId/{$formGuid}";

	echo "<br><br>Cookie hubspotutk :: " . $hubspotutk;
	echo "<br><br>IP Address :: " . $ip_addr;
    echo "<br><br>";
	var_dump($hs_context_json);
	
	echo "<br><br>EndPoint :: " . $endpoint;
	echo "<br><br>String Post :: " . $str_post;
	
	$ch = @curl_init();
	@curl_setopt($ch, CURLOPT_POST, true);
	@curl_setopt($ch, CURLOPT_POSTFIELDS, $str_post);
	@curl_setopt($ch, CURLOPT_URL, $endpoint);
	@curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		'Content-Type: application/x-www-form-urlencoded'
	));
	@curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response    = @curl_exec($ch); //Log the response from HubSpot as needed.
	$status_code = @curl_getinfo($ch, CURLINFO_HTTP_CODE); //Log the response status code
	@curl_close($ch);
	
	echo "<br><br>" . $status_code . " " . $response;
	


?>