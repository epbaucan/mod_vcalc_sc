<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Calculator</title>

    <!-- Bootstrap -->
    <link href="lib/generic/css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="lib/generic/css/calc-customize.css" rel="stylesheet" id="custom-css-calculator"> 
    <link href="lib/generic/css/calc-others.css" rel="stylesheet" id="custom-css-others">
    <link href="lib/components/modal-effect/css/component.css" rel="stylesheet" id="custom-css-calculator">
     <script src="lib/generic/js/jquery/1.11.2_jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="lib/generic/js/jquery/bootstrap.min.js"></script>
   <!-- <script src="lib/generic/js/jquery/jquery.cookie.js"></script>-->
    <script src="lib/generic/js/jquery.cusModCalculator.js"></script>     


    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
  	
    <div id="hosted-desktop-calc" class="calc1">
         
    </div>
    <p>     

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) |#calc2 -->
    <script>
	    jQuery('#hosted-desktop-calc').cusModCalculator({'model': 'CCC', 'xml' : 'config/package.xml', 'pluginpath' : '/calculator/fromlive/sc/mod_vcalc_sc/lib/'});
		//$('#calc2').cusModCalculator({'model': 'MC', 'xml' : 'config/package.xml', 'pluginpath' : 'calculator/mod_ncalculator_wm/lib/'});
	</script>
    <script src="lib/components/modal-effect/js/classie.js"></script>
	<script src="lib/components/modal-effect/js/modalEffects.js"></script>
  </body>
</html>