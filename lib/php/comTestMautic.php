<?php
		 
	//Execute longer execution time
	ini_set('max_execution_time', 300);	
	
	//Settings
	include('comSettings.php');  
	include('funcEmail.php');  
	//var_dump('Test:: ' . $mDirectory); 
	include($mDirectory . '/autoloader.php'); 
	
	/*use Mautic\MauticApi;
	use Mautic\Auth\ApiAuth;*/ 
	

	//var_dump('Test2:: ' . $mDirectory); 
	session_start();	
	 
	$publicKey       = ''; 
	$secretKey       = ''; 
	$callback        = ''; 
	
	
	$FormData        = (!empty($_POST)) ? $_POST : $_GET; 
	$mOtherData      = "";
	$mData           = array();
	
	// @todo load this array from database or config file
	$accessTokenData = array(
		'accessToken' => $mAccessToken,
		'accessTokenSecret' => $mTokenSecret,
		'accessTokenExpires' => ''
	);
	
	//var_dump('Test3:: ');  var_dump($accessTokenData);
	// ApiAuth::initiate will accept an array of OAuth settings
	$settings = array(
		'baseUrl'          => $mDomainPath,       // Base URL of the Mautic instance
		'version'          => $mVersion,          // Version of the OAuth can be OAuth2 or OAuth1a. OAuth2 is the default value.
		'clientKey'        => $mClientKey,       // Client/Consumer key from Mautic
		'clientSecret'     => $mClientSecret,       // Client/Consumer secret key from Mautic
		'callback'         => $mCallBack         // Redirect URI/Callback URI for this script
	);
	
	//var_dump('Test4:: ');   var_dump($settings);
	 
	// If you already have the access token, et al, pass them in as well to prevent the need for reauthorization
	if (!empty($accessTokenData['accessToken']) && !empty($accessTokenData['accessTokenSecret'])) {
		$settings['accessToken']        = $accessTokenData['accessToken'] ;
		$settings['accessTokenSecret']  = $accessTokenData['accessTokenSecret'];
		$settings['accessTokenExpires'] = $accessTokenData['accessTokenExpires'];
	}
	 
	// var_dump('Test5:: ');  var_dump($settings);  
	 
	// Initiate the auth object
	$auth = Mautic\Auth\ApiAuth::initiate($settings);  //var_dump($auth);
	   
	// Initiate process for obtaining an access token; this will redirect the user to the $authorizationUrl and/or
	// set the access_tokens when the user is redirected back after granting authorization
	
	// If the access token is expired, and a refresh token is set above, then a new access token will be requested
	//var_dump(' auth verification::');
	//var_dump($auth->validateAccessToken());
	if ($auth->validateAccessToken()) {
	
		// Obtain the access token returned; call accessTokenUpdated() to catch if the token was updated via a 
		// refresh token
	
		// $accessTokenData will have the following keys:
		// For OAuth1.0a: access_token, access_token_secret, expires
		// For OAuth2: access_token, expires, token_type, refresh_token
	    
		//echo "<pre>"; var_dump($auth->accessTokenUpdated()); echo "</pre>"; 
		/*if ($auth->accessTokenUpdated()) {
			//echo "<pre>"; var_dump($auth->getAccessTokenData()); echo "</pre>";
			echo "Access Tokens<br><br>"; 
			$accessTokenData = $auth->getAccessTokenData();	//store access token data however you want
			echo "<pre>"; var_dump($accessTokenData); echo "</pre>"; 
		}*/
		
			
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
		
		$apiUrl             = $mDomainPath . '/api/';
			
		$leadApi            = Mautic\MauticApi::getContext("leads", $auth, $apiUrl);
		$leads              = $leadApi->getList($mSearchFilter, $mStart, $mLimit, $mOrderBy, $mOrderByDir);	
		 
		if(isset($leads["leads"][0]["fields"]["core"])){
			if(isset($_SESSION['fields'])) unset($_SESSION['fields']);		
			$_SESSION['fields'] = $leads["leads"][0]["fields"]["core"];
		} elseif(!isset($leads["leads"][0]["fields"]["core"]) && !isset($_SESSION['fields'])) {
			$_SESSION['fields'] = $mDefaultFields;
		}	
		
		$aFields            = $_SESSION['fields'];
		
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
		
		//echo "<pre>"; var_dump($data); echo "</pre>";
		/*$lId                = $leads["total"] + 1;
		$lInsert            = $leadApi->edit($lId, $data, $createIfNotFound);*/	
		$lInsert            = $leadApi->create($data);		
		//$eRecID			    = 1; 
		$pRecID             = 1;
		
		/*$EmailApi           = MauticApi::getContext("emails", $auth, $apiUrl);
		$sendEmail          = $EmailApi->sendToLead($eRecID, $lRecID);
		
		var_dump($sendEmail);*/
		
		/*$contents  = getMailContents($mEmailContent); 
		$eContents = removeUnwantedString(trim($contents), "<script>", "</script>");
		$eContent  = showRealData($eContents, $data2); 
		$eReciever = array($mData['email'], $mData['firstname']);

	    $eProcess  = _mailProcess($eMailFrom, $eReciever, $eMailSubj, $eContent);
		var_dump($eProcess);*/	 

		
		if(isset($lInsert["lead"]["id"])){			
						 
			if($eMailSwitch == 1){				
				 	
				 $contents  = getMailContents($mEmailContent); 
				 $eContents = removeUnwantedString(trim($contents), "<script>", "</script>");
				 $eContent  = showRealData($eContents, $data2); 
				 $eReciever = array($mData['email'], $mData['firstname']);
	
				 $eProcess  = _mailProcess($eMailFrom, $eReciever, $eMailSubj, $eContent);	 
				
			} else {
				
				$lRecID             = $lInsert["lead"]["id"];
				$EmailApi           = Mautic\MauticApi::getContext("emails", $auth, $apiUrl);
				$response           = $EmailApi->sendToLead($eRecID, $lRecID);			
								
				if (!isset($response['success']) || $response['success'] == 0) {
						// handle error
						
						$Return    = "FAILED TO SEND EMAIL";
						
		 		}  else {
					
						$ListApi      = Mautic\MauticApi::getContext("lists", $auth, $apiUrl);
						$Listresponse = $ListApi->addLead($eRecListID, $lRecID);	
						
						$CamApi       = Mautic\MauticApi::getContext("campaigns", $auth, $apiUrl);
						$Camresponse  = $CamApi->addLead($eRecCamID, $lRecID);
						
						var_dump($lRecID . ' --> ' . $eRecListID);
						var_dump($Listresponse);					
				
					    $Return = "EMAIL SENT";
				
				}
				
			}
			
		} else {
			
			$Return = "FAILED TO SEND EMAIL";
			var_dump('id not created');
			
		} 
		
		var_dump($Return);
		/*$lists = $leadApi->getLeadCampaigns($lRecID); */
		
		
		/*$campaignApi        = Mautic\MauticApi::getContext("campaigns", $auth, $apiUrl);
		/*$campaigns          = $campaignApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir);
		
		//$EmailApi           = Mautic\MauticApi::getContext("email", $auth, $apiUrl);
		$campaign           = $campaignApi->getList($searchFilter, $start, $limit, $orderBy, $orderByDir);*/
		//$response           = $campaignApi->addLead($campaignId, $lRecID);
		//if (!isset($response['success'])) {
			// handle error
		//}*/
		 
		/*$pointApi = MauticApi::getContext("pointTriggers", $auth, $apiUrl);
		$trigger = $pointApi->get($id); */
		
		
		//echo "<pre>"; var_dump($response); echo "</pre>";
		
		/*
		//$owners = $leadApi->getOwners(); echo "<pre>";  var_dump($owners);  echo "</pre>";
		$createIfNotFound = true;
		$lead2 = $leadApi->edit($lId, $data, $createIfNotFound);
		
		echo "<pre>";  var_dump($lead2);  echo "</pre>";*/
		
		/*$lead = $leadApi->create($mData);
		var_dump($lead);*/
		/*$data               = array();
		
		 */
	
}

 