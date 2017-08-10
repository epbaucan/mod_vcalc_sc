<?php

class ModNewCalcEmbeddedHelper{
	
	public static function displayComponent(&$params){
		
		$lists                  = array();		
		$lists['model']         = $params->get('calc_type');
		$lists['container']     = $params->get('con_name');
		//$lists['conwidth']   = $params->get('con_width');		
		$lists['xml']           = 'config/package.xml';
		$lists['js']            = '/modules/mod_vcalc_sc/lib/generic/js/jquery.cusModCalculator.js';  
		$lists['pluginpath']    = '/modules/mod_vcalc_sc/lib/';
		$lists['bootstrap']     = array();
		$lists['jquery']        = '';
		$lists['jquery-cookie'] = '';
		 
				
		if($params->get('load_bootstrap')){
			$lists['bootstrap']['css'] = '/modules/mod_vcalc_sc/lib/generic/css/bootstrap/bootstrap.min.css';
			$lists['bootstrap']['js'] = '/modules/mod_vcalc_sc/lib/generic/js/jquery/bootstrap.min.js';
		}
		
		if($params->get('load_jquery')){
			$lists['jquery'] = '/modules/mod_vcalc_sc/lib/generic/js/jquery/1.11.2_jquery.min.js';
		}
		
		if($params->get('load_jq_cookie')){
			$lists['jquery-cookie'] = '/modules/mod_vcalc_sc/lib/generic/js/jquery/jquery.cookie.js';
		}
		
		return $lists;
	}
	
}


?>