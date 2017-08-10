<?php

	include('comSettings.php');
	
	$mOtherData      = "";
	$mData           = array();
	
	$ip_addr         = $_SERVER['REMOTE_ADDR']; //IP address too.
    $mData['formId'] = $mFormId;
	
    // return has to be part of the form data array
    if (!isset($mData['return'])) {
        $mData['return'] = $mCallBack;  
    }
	 
	$mData['firstname'] = (isset($FormData["client_firstname"]) && !empty($FormData["client_firstname"])) ? $FormData["client_firstname"] : "";
	$mData['lastname'] = (isset($FormData["client_lastname"]) && !empty($FormData["client_lastname"])) ? $FormData["client_lastname"] : "";
	$mData['company']  = (isset($FormData["company_name"]) && !empty($FormData["company_name"])) ? $FormData["company_name"] : "";
	$mData['email']    = (isset($FormData["client_email"]) && !empty($FormData["client_email"])) ? $FormData["client_email"] : "";
	$mData['phone']    = (isset($FormData["client_phone"]) && !empty($FormData["client_phone"])) ? $FormData["client_phone"] : "";
	$OtherData    = (isset($FormData["fetchvalues"]) && !empty($FormData["fetchvalues"])) ? explode("|", $FormData['fetchvalues']) : array();
	
	if(sizeof($OtherData) > 0){
		foreach($OtherData as $a => $b){
			$OtherDataSub = explode('~', $b);
			$FormField    = strtolower(str_replace(' ', '_', $OtherDataSub[0]));
			$mData[$FormField] = urlencode($OtherDataSub[1]);
		}
	}

    $mData = array('mauticform' => $mData);
	
    // Change [path-to-mautic] to URL where your Mautic is
    $mFormUrl =  $mDomainPath.'/form/submit?formId=' . $mFormId;  

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $mFormUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($mData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("HTTP_X_FORWARDED_FOR: $ip_addr"));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $status_code = curl_exec($ch);

    curl_close($ch);         
	
	if($status_code == "204")   $Return = "EMAIL SENT";
	else   $Return = "FAILED TO SEND EMAIL ";
	
	var_dump($status_code);
	var_dump($Return);

	exit();
?>