<?php
	
	require $mDirectory . 'Phpmailer/PHPMailerAutoload.php';
	
	/*
	
	*/		
	function _mail($from = array(), $to = array(), $subject, $contents, $alttext = NULL, $repltyto = NULL, $attachments = NULL){
				 	
		//Create a new PHPMailer instance
		$mail = new PHPMailer();
		//Set who the message is to be sent from
		$mail->setFrom($from[0], $from[1]);
		
		//Set who the message is to be sent to
		$mail->addAddress($to[0], $to[1]);
		//Set the subject line
		$mail->Subject = $subject;
		//Read an HTML message body from an external file, convert referenced images to embedded,
		//convert HTML into a basic plain-text alternative body
		$mail->msgHTML($contents);
		
		if(!empty($repltyto)){
			//Set an alternative reply-to address
			$mail->addReplyTo($repltyto[0], $repltyto[1]);
		}
		
		if(!empty($alttext)){
			//Replace the plain text body with one created manually
			$mail->AltBody = $alttext;
		}
		
		if(!empty($attachments)){
			//Attach an image file
			$mail->addAttachment($attachments);
		}
		
		//send the message, check for errors
		if (!$mail->send()) {
			return "Mailer Error: " . $mail->ErrorInfo;
		} else {
			return "Message sent!";
		}
		
	}
	
	
	/*
	
	*/
	function _smtp($from = array(), $to = array(), $subject, $contents, $alttext = NULL, $repltyto = NULL, $attachments = NULL){	 
		
		global $eMailHost, $eMailPort, $eMailSMTPSecure, $eMailUserName, $eMailPassword, $eMailSMTPDebug;  	 
		
		//Create a new PHPMailer instance
		$mail = new PHPMailer();
		
		//Tell PHPMailer to use SMTP
		$mail->isSMTP();
		
		//Enable SMTP debugging
		// 0 = off (for production use)
		// 1 = client messages
		// 2 = client and server messages
		$mail->SMTPDebug = $eMailSMTPDebug;
		
		//Ask for HTML-friendly debug output
		$mail->Debugoutput = 'html';
		
		//Set the hostname of the mail server
		$mail->Host = $eMailHost;
		
		//Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
		$mail->Port = $eMailPort; //465
		
		//Set the encryption system to use - ssl (deprecated) or tls
		$mail->SMTPSecure = $eMailSMTPSecure;
		
		//Whether to use SMTP authentication
		$mail->SMTPAuth = true;
		
		//Username to use for SMTP authentication - use full email address for gmail
		$mail->Username = $eMailUserName;
		
		//Password to use for SMTP authentication
		$mail->Password = $eMailPassword;
		
		//Set who the message is to be sent from
		$mail->setFrom($from[0], $from[1]);	
		
		//Set who the message is to be sent to
		$mail->addAddress($to[0], $to[1]);
		
		if(!empty($repltyto)){
			//Set an alternative reply-to address
			$mail->addReplyTo($repltyto[0], $repltyto[1]);
		}
		
		//Set the subject line
		$mail->Subject = $subject;
		
		//Read an HTML message body from an external file, convert referenced images to embedded,
		//convert HTML into a basic plain-text alternative body
		$mail->msgHTML($contents);
		
		if(!empty($alttext)){
			//Replace the plain text body with one created manually
			$mail->AltBody = $alttext;
		}
		
		if(!empty($attachments)){
			//Attach an image file
			$mail->addAttachment($attachments);
		}
		
		//send the message, check for errors
		if (!$mail->send()) {
			return "Mailer Error: " . $mail->ErrorInfo;
		} else {
			return "Message sent!";
		}
		
	}
	
	
	 function getMailContents($src){		
		 
		$ret = file_get_contents($src); 
		return (!empty($ret)) ? $ret : "";
	
	} 
	
	function removeUnwantedString($str, $strStart, $strEnd){
		
		$iStartSkip = stripos($str, $strStart); 
		$iEndSkip	= stripos($str, $strEnd);
				
		if(!$iStartSkip) return $str;
		
		$aString    = str_split($str);
		$sReturn    = "";
		 
		for($i = 0; $i < sizeof($aString); $i++){
			if($i >= $iStartSkip && $i <= $iEndSkip){
				$sReturn .= $aString[$i];
			}			
		}		
		 		
		return $sReturn;
		
	}	
	
	function showRealData($string, $array){
		
		$sReturn = $string;
		foreach($array as $a => $b){
			
			$aKeys = "[" . $a . "]";
			if(stripos($sReturn, $aKeys)){
				$sReturn = str_replace( $aKeys, $b, $sReturn);
			}
			
		}
		
		return $sReturn;
		
	}
	
	
	function _mailProcess($from, $to, $subj, $contents, $alttext = NULL, $repltyto = NULL, $attachments = NULL){
		
		global $eMailType; 
		
		if($eMailType == 1)  return _smtp($from, $to, $subj, $contents, $alttext, $repltyto, $attachments);
		else return _mail($from, $to, $subj, $contents, $alttext, $repltyto, $attachments);	
		
	}
	
	


?>