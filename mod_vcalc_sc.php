<?php

	// No direct access
	defined('_JEXEC') or die('Restricted Access');
	// Include the syndicate functions only once
	require_once dirname(__FILE__) . '/helper.php';	
	
	
	$display           = ModNewCalcEmbeddedHelper::displayComponent($params);
	require JModuleHelper::getLayoutPath('mod_vcalc_sc');

?>