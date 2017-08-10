<?php

    	$Message         = "";		 	
		
		$hubspotutk      = $_COOKIE['hubspotutk']; //grab the cookie from the visitors browser.
		$ip_addr         = $_SERVER['REMOTE_ADDR']; //IP address too.
		$hs_context      = array(
			'hutk' => $hubspotutk,
			'ipAddress' => $ip_addr,
			'pageUrl' => $pageUrl,
			'pageName' => $formName
		);
		
		$hs_context_json = json_encode($hs_context);
		
		$firstname       = (isset($FormData["client_firstname"]) && !empty($FormData["client_firstname"])) ? $FormData["client_firstname"] : "";
		$lastname        = (isset($FormData["client_lastname"]) && !empty($FormData["client_lastname"])) ? $FormData["client_lastname"] : "";
		$clientcompany   = (isset($FormData["company_name"]) && !empty($FormData["company_name"])) ? $FormData["company_name"] : "";
		$clientemail     = (isset($FormData["client_email"]) && !empty($FormData["client_email"])) ? $FormData["client_email"] : "";
		$clientphone     = (isset($FormData["client_phone"]) && !empty($FormData["client_phone"])) ? $FormData["client_phone"] : "";
		$OtherData       = (isset($FormData["fetchvalues"]) && !empty($FormData["fetchvalues"])) ? explode("|", $FormData['fetchvalues']) : array();
		
		if(sizeof($OtherData) > 0){
			foreach($OtherData as $a => $b){
				$OtherDataSub = explode('~', $b);
				$Message .= "&" . strtolower(str_replace(' ', '_', $OtherDataSub[0])) . "=" . urlencode($OtherDataSub[1]);
			}
		}		
		
		//Need to populate these varilables with values from the form.
		$str_post = "firstname=" . urlencode($firstname) 
			. "&lastname=" . urlencode($lastname)
			. "&company=" . urlencode($clientcompany) 
			. "&email=" . urlencode($clientemail) 
			. "&phone=" . urlencode($clientphone) 
			. $Message  
			. "&hs_context=" . urlencode($hs_context_json); //Leave this one be
		
		//replace the values in this URL with your portal ID and your form GUID
		$endpoint = "https://forms.hubspot.com/uploads/form/v2/$portalId/{$formGuid}";
		
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
		
		//return $status_code . " " . $response; 
		if($status_code == "204")   $Return = "EMAIL SENT";
		else   $Return = "FAILED TO SEND EMAIL "; 

		 

?>