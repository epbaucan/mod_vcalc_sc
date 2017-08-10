<?php

	
	//Added function
	//include('funcEmail.php');

	//auto loader
	include($mDirectory . '/autoloader.php');
	
	use Mautic\MauticApi;
	use Mautic\Auth\ApiAuth;
	
	
	$mOtherData      = "";
	$mData           = array();
	
	$accessTokenData = array(
		'accessToken' => $mAccessToken,
		'accessTokenSecret' => $mTokenSecret,
		'accessTokenExpires' => '' 
	);

	// $initAuth->newAuth() will accept an array of OAuth settings
	$settings = array(
		'baseUrl'      => $mDomainPath,
		'version'      => $mVersion,
		'clientKey'    => $mClientKey,
		'clientSecret' => $mClientSecret, 
		'callback'     => $mCallBack
	);
	
	// If you already have the access token, et al, pass them in as well to prevent the need for reauthorization
	if (!empty($accessTokenData['accessToken']) && !empty($accessTokenData['accessTokenSecret'])) {
		
		$settings['accessToken']        = $accessTokenData['accessToken'] ;
		$settings['accessTokenSecret']  = $accessTokenData['accessTokenSecret'];
		$settings['accessTokenExpires'] = $accessTokenData['accessTokenExpires'];

	}		
		
	 
	// Initiate the auth object
	$initAuth = new ApiAuth();
	$auth     = $initAuth->newAuth($settings);  
	
	// Initiate process for obtaining an access token; this will redirect the user to the authorize endpoint and/or set the tokens when the user is redirected back after granting authorization
	 
	if ($auth->validateAccessToken()) {
		
		if ($auth->accessTokenUpdated()) {			 
			
			var_dump('New Access Token::');
			$accessTokenData    = $auth->getAccessTokenData();	//store access token data however you want
			var_dump($accessTokenData);	
			 
		}
		
		
		//Variables
		$ip_addr            = $_SERVER['REMOTE_ADDR']; //IP address too.	 
		//$mData['formId']    = $mFormId;
	
		$mData['firstname']   = (isset($FormData["client_firstname"]) && !empty($FormData["client_firstname"])) ? $FormData["client_firstname"] : "";
		$mData['lastname']    = (isset($FormData["client_lastname"]) && !empty($FormData["client_lastname"])) ? $FormData["client_lastname"] : "";
		$mData['company']     = (isset($FormData["company_name"]) && !empty($FormData["company_name"])) ? $FormData["company_name"] : "";
		$mData['email']       = (isset($FormData["client_email"]) && !empty($FormData["client_email"])) ? $FormData["client_email"] : "";
		$mData['phone']       = (isset($FormData["client_phone"]) && !empty($FormData["client_phone"])) ? $FormData["client_phone"] : "";
		$mData['calc_response'] = 'Yes';
		$mData['calc_already_added'] = 0;
		$OtherData            = (isset($FormData["fetchvalues"]) && !empty($FormData["fetchvalues"])) ? explode("|", $FormData['fetchvalues']) : array();
	
		if(sizeof($OtherData) > 0){
	
			foreach($OtherData as $a => $b){
	
				$OtherDataSub = explode('~', $b);
				$FormField    = strtolower(str_replace(' ', '_', $OtherDataSub[0]));
				$mData[$FormField] = urldecode($OtherDataSub[1]);
	
			}
	
		} 	
		
		$apiUrl            = $mDomainPath ; //. '/api/'
		$api               = new MauticApi();
		
		// Get contact field context:
		$fieldApi = $api->newApi("contactFields", $auth, $apiUrl);	
		$fields   = $fieldApi->getList($mSearchFilter, $mStart, $mLimit, $mOrderBy, $mOrderByDir, NULL, NULL);	
		
		//Mautic Form fields
		if(isset($fields['fields'])){
	
			if(isset($_SESSION['fields'])) unset($_SESSION['fields']);		
			$_SESSION['fields'] = $fields['fields'];
	
		} elseif(!isset($fields['fields']) && !isset($_SESSION['fields'])) {
	
			$_SESSION['fields'] =  $mDefaultFields;
	
		}	  
		
		$aFields            = $_SESSION['fields'];		
		
		//Generating data values for mautic end
		$data               = array();	
		$data2              = array();
	
		foreach ($aFields as $a => $b) {  		 
	
			if(isset($mData[$b['alias']])) {
	
				 $data[$b['alias']]  = $mData[$b['alias']];
				 $data2[$b['label']] = $mData[$b['alias']];
	
			} else {
				
				 $data[$b['alias']]  = '';
				 $data2[$b['label']] = ''; 
			} 
	
		} 
		
		$data['ipAddress']  = $ip_addr;  
		$bExisting          = false;
		 
		
		//Creating contact
		$contactApi         = $api->newApi("contacts", $auth, $apiUrl);
		
		//Set if account is already present in system
		$mStringKey         = $data['email'];	
		$contactList        = $contactApi->getList($mStringKey, $mStart, $mLimit, $mOrderBy, $mOrderByDir, NULL, NULL);  
		if(isset($contactList["contacts"]) && sizeof($contactList["contacts"]) > 0)  $bExisting = true;		
		
		//Account Creation
		$contact            = $contactApi->create($data);
				 
		
		if(isset($contact["contact"]) && isset($contact["contact"]["id"])){						
	
			if(empty($mEmailID) || !is_numeric($mEmailID)){   //Checks if $mEmailID is empty or is not numeric			
	
				$Return = "FAILED TO SEND EMAIL";								
	
			} else {
				
				$iContactId = $contact["contact"]["id"];
				$emailApi   = $api->newApi("emails", $auth, $apiUrl);
				$email      = $emailApi->sendToContact($mEmailID, $iContactId);				
				 
				if (!isset($email['success']) || $email['success'] == 0) {

							// handle error						
							$Return       = "FAILED TO SEND EMAIL";							

				}  else { 
				
				       
					   //Updating Account points
					   if($bExisting){
						        
								$pointDelta = $mIntExistingPts;						   
						   
					   } else {
						   
								$pointDelta = $mIntNewPts;																								
								
					    }
						
						
						$data3      = array(
										 'eventname' => 'Score via api',
										 'actionname' => 'Adding',
									  );								
						$oAddPoints = $contactApi->addPoints($iContactId, $pointDelta, $data3);
						
						//Process Segment Section
						if(!empty($mRecListID) && is_numeric($mRecListID)){		
								
							$segmentApi   = $api->newApi("segments", $auth, $apiUrl);
							$response     = $segmentApi->addContact($mRecListID, $iContactId);  
							if (!isset($response['success'])) {
								
								// handle error
								$Return  = "FAILED TO SEND EMAIL";
								
							}					

						} 
																

						$Return       = "EMAIL SENT";
				

				} 
				
			}
					
		} else {
			
			$Return = "FAILED TO SEND EMAIL";
			
		}

		
		
	} else {		
		
		$Return = "FAILED AS MAUTIC DIDN'T WORK";
		
	}	 



?>