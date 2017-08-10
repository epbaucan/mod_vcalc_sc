<?php


defined('_JEXEC') or die;

$xmlfile    = $display['xml'];
$modpath    = JURI::root(true). $display['pluginpath'];
$jspath     = JURI::root(true). $display['js'];
$containers = explode('|', $display['container']);
$models     = explode('|', $display['model']);

$doc = JFactory::getDocument();

if(!empty($display['jquery'])){
	JHtml::_('jquery.framework');
	$jsquery = JURI::root(true). $display['jquery'];
	$doc->addScript($jspath);
}

JHtml::_('bootstrap.framework');
if(sizeof($display['bootstrap']) > 0){	
	$cssboot = JURI::root(true). $display['bootstrap']['css'];
	$doc->addStyleSheet($cssboot);
	
	$jsboot = JURI::root(true). $display['bootstrap']['js'];
	$doc->addScript($jsboot);
}

if(!empty($display['jquery-cookie'])){
	//JHtml::_('jquery.framework');
	$jqcookie = JURI::root(true). $display['jquery-cookie'];
	$doc->addScript($jqcookie);
}

//$doc->addScript($jspath);


	
?>

<script type="text/javascript" src="<?php echo $jspath; ?>"></script>
<script type="text/javascript"> 
  <?php 
  		foreach($containers as $a => $b) { ?>
  			//$('<?php echo trim($b); ?>').cusModCalculator({'model': '<?php echo $models[$a]; ?>', 'xml' : '<?php echo $xmlfile; ?>', 'pluginpath' : '<?php echo $modpath; ?>'}); 
			jQuery('<?php echo trim($b); ?>').cusModCalculator({'model': '<?php echo $models[$a]; ?>', 'xml' : '<?php echo $xmlfile; ?>', 'pluginpath' : '<?php echo $modpath; ?>'}); 
			//Edited by Ces
  <?php } ?>
  
</script>