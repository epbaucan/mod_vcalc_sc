jQuery.noConflict();

;(function ($, document) {  	
	$.fn.cusModCalculator = function( settings ) {

		 var config = {
            'model'    : "CCC",
            'xml'      : "config/package.xml",	
			'pluginpath' :	"",	            			
         };		

        if ( settings ){ $.extend( config, settings ); }		 

		var base	     = this;
 		var obj          = null;
 		var objModel     = null;	
 		var aSetupInfo   = [];	
 		var aSliderInfo  = [];	
 		var genvars      = [];
 		var genonload    = [];
 		var contants     = {};
 		var actions      = [];	
 		var resultBox    = [];	
 		var aPopTooltxt  = [];
 		var aEmailHolder = [];
 		var aValueRange  = [];
 		var sWithLimits  = 'button-submit, button-collapse';	
 		var sSkipWords   = '$family, $constructor, each, clone, clean, invoke, associate, link, contains, append, getLast, getRandom, include, combine, erase ,empty, flatten, pick, hexToRgb, rgbToHex, sticktop'; 	
 		var iWithCounter = 1;
 		var sDomainName  = window.location.hostname;

 
		//Initialized function
 		base.init = function(){	

 			v_bPass  = false;
 			aModels  = config.model.split('|');
 			aDivs    = this;

 
			if(aModels.length != aDivs.length){

 				alert('Calculator type and its containers didn\'t matched its respective lengths. Please check the configuration of this plugin.');
 				return;	
 			
			}

 			//Load Initial External Files

 			if(aModels.length >= 1){	 				 
				
 				base.setCSS();					
 				base.setJS('components/nouislider/js/nouislider.min.js', 'nouislider-js-min');				 

 			}			
			
 			for(var i = 0; i < aModels.length; i++){		
 
				v_sModel     = aModels[i];
 				objModel     = v_sModel;	
 				aPopTooltxt  = [];			

 
				if(typeof aDivs !== "object" || typeof aModels[i] !== "string") {
 					
					alert('Contents row didn\'t matched. Please check the assigned element in accessing this plugin in your script.');
  					return;	
 
				} else if(!base.isObjectPresent(aDivs)){
 		
					alert('Object container named '+ aDivs.attr('id') +' is not present. Please check the page code if this object is declared.');
  					return;	

 				}
 
 				obj = aDivs; //$(aDivs[i]);				
 				aSetupInfo = base.getSetUpBaseOnModel(v_sModel); 

 
				if(typeof aSetupInfo['obj-containers'] !== 'undefined'){ 

 
					base.fillContainer(aSetupInfo);  					
 					base.getOnloadProcess(genonload[v_sModel]);	
 					v_strpop = base.setDivPopHolder();

 					if(v_strpop != '') obj.parent().append(v_strpop);					
 					v_bPass  = true;						

 				} else {

 					alert('Config model named ' + v_sModel + ' value wasn\'t found on the plugins XML configuration file. Please check it!');

 
				} 
			}		
 			//Set events
 			if(v_bPass){
				
 				base.setEvents();
			} 
			
			
		}	

 		
		//
 
		base.isObjectPresent = function(value){
 			
			return ($("body").find(value).length == 0) ? false : true;

 		}

 
 		//
 		base.getSetUpBaseOnModel = function(model){
 			var aGroups = base.getDetailSetUp(); 

 			for(var i = 0; i < aGroups.length; i++){   

 				if(aGroups[i]['name'] == model){  
 					return aGroups[i];
 				}
 
 			}

 			return [];

 		}

 
 		//Getting configuration information
 		base.getDetailSetUp = function(){

			var aConfig      = []; 
 			var aLimits      = []; 

			$.ajax({
 				type: "GET",
				url: base.pluginPath(config.xml),
 				dataType: "xml",
	 			async: false,
	            success: function(xml) {
				ctr = 0;

				$(xml).find('calculator').each(function(){

					groups = $(this).find('calc_group');				
                    groups.each(function(){

						var group                      = $(this);	
 						aConfig[ctr]                   = [];	

						aConfig[ctr]['obj-results']    = [];

						aConfig[ctr]['obj-containers'] = [];						 						

						aConfig[ctr]['onload-actions'] = [];

						aConfig[ctr]['obj-'] = [];

						aConfig[ctr]['obj-required']   = "";

							 

						aConfig[ctr]['name']   = group.attr('name');

						aConfig[ctr]['title']  = group.find('title').text();

						

						if(group.find('number_column').text() == 1 || group.find('number_column').text() == 2){

							aConfig[ctr]['column'] = group.find('number_column').text();

						} else {

							alert('Invalid number column value for ' + group.attr('name'));

							return;

						}

						if(group.find('panel_type').text() == 'Yes' || group.find('panel_type').text() == 'No'){

							aConfig[ctr]['panel']  = group.find('panel_type').text();

						} else {

							alert('Invalid panel type value for ' + group.attr('name'));

							return;

						}

						aConfig[ctr]['denomination']  = group.find('denomination').text();

						aConfig[ctr]['headertype']    = group.find('header_type').text();

						//Action array

						v_objectgroup =   group.attr('name');

						actions[v_objectgroup]   = [];

						genonload[v_objectgroup] = [];

						resultBox[v_objectgroup] = [];

						genvars[v_objectgroup]   = [];  

						contants[v_objectgroup]  = []; 

						aValueRange[v_objectgroup] = [];        						

						rBoxGroupCtr = 0;

						if(group.find('boxgroup').length > 0){

							 

							 aConfig[ctr]['obj-results-position']   = group.find('position').text();

							 rBoxGroup = group.find('boxgroup');			 

							

							 rBoxGroup.each(function(){

								 v_rboxid 												   = $(this).find('id').text();

								 

								 aConfig[ctr]['obj-results'][rBoxGroupCtr]                 = [];

								 aConfig[ctr]['obj-results'][rBoxGroupCtr]['id']           = v_rboxid;

								 aConfig[ctr]['obj-results'][rBoxGroupCtr]['label']        = $(this).find('label').text();

								 aConfig[ctr]['obj-results'][rBoxGroupCtr]['prefix']       = '';	

								 aConfig[ctr]['obj-results'][rBoxGroupCtr]['border']       = $(this).find('withborder').text();								 

								 aConfig[ctr]['obj-results'][rBoxGroupCtr]['default']      = $(this).find('default').text();

								 aConfig[ctr]['obj-results'][rBoxGroupCtr]['emaillabel']   = $(this).find('email_label').text();

								 								 

								 resultBox[v_objectgroup][v_rboxid]                        = [];

								 resultBox[v_objectgroup][v_rboxid]['roundnumber']    	   = $(this).find('roundnumber').text();

								 resultBox[v_objectgroup][v_rboxid]['formula']  		   = $(this).find('formula').text();							 

								 					 

								 rBoxGroupCtr++;	

								 						 

							 });

							 

						}	

						rEmailGroupCtr = 0;

						if(group.find('email_form').length > 0){							 

							

							if(typeof aEmailHolder[v_objectgroup] === 'undefined') aEmailHolder[v_objectgroup]                 = [];

							if(group.find('item_node').length > 0){

								 

								 if(typeof aEmailHolder[v_objectgroup]['body'] === 'undefined') aEmailHolder[v_objectgroup]['body'] = [];

								 rEmailGroup = group.find('item_node');			 

								

								 rEmailGroup.each(function(){

										

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]              = [];

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['name']      = $(this).attr('name');

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['label']     = $(this).attr('label');

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['type']      = $(this).attr('type');

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['func']      = $(this).attr('function');

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['maxlen']    = $(this).attr('maxlength');

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['minlen']    = $(this).attr('minlength');	

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['required']  = $(this).attr('required');	

									 aEmailHolder[v_objectgroup]['body'][rEmailGroupCtr]['default']   = $(this).attr('default');	

									  	 

									 rEmailGroupCtr++;	

															 

								 });

							}

							

							rEmailGroupButtonCtr = 0;

							if(group.find('button_node').length > 0){

								 

								 if(typeof aEmailHolder[v_objectgroup]['buttons'] === 'undefined') aEmailHolder[v_objectgroup]['buttons'] = [];

								 rEmailGroupButtons = group.find('button_node');			 

								

								 rEmailGroupButtons.each(function(){

										

									 aEmailHolder[v_objectgroup]['buttons'][rEmailGroupButtonCtr]              = [];

									 aEmailHolder[v_objectgroup]['buttons'][rEmailGroupButtonCtr]['label']     = $(this).attr('label');

									 aEmailHolder[v_objectgroup]['buttons'][rEmailGroupButtonCtr]['trigger']   = $(this).attr('trigger');

									 rEmailGroupButtonCtr++;

																					 

								 });

							}	

							

						}

						 

						//Create constant variable 

						if(group.find('variable').length > 0){

							 

							 rConstantVar = group.find('variable');							

							 rConstantVar.each(function(){								 

								 v_key   = $(this).text();

								 v_value = $(this).attr('init');

								 contants[v_objectgroup][v_key]	= [];

								 contants[v_objectgroup][v_key]['value'] = v_value;						 

							 });

							 

						}	

						//Create constant variable 

						if(group.find('valuerange').length > 0){

							 

							 rValueRange = group.find('valuerange'); 							

							 rValueRange.each(function(){								 

								 v_txt   = $(this).text();

								 v_init  = $(this).attr('init');

								 v_max   = $(this).attr('max');

								 v_value = $(this).attr('value');

								 v_obj   = $(this).attr('object');

								 if(typeof aValueRange[v_objectgroup][v_obj] === 'undefined') aValueRange[v_objectgroup][v_obj] = [];

								 aValueRange[v_objectgroup][v_obj][v_txt]	      = [];

								 aValueRange[v_objectgroup][v_obj][v_txt]['init'] = v_init;

								 aValueRange[v_objectgroup][v_obj][v_txt]['max']  = v_max;

								 aValueRange[v_objectgroup][v_obj][v_txt]['val']  = v_value;						 

							 });

							 

						}

						//Create general variables 

						if(group.find('changevariable').length > 0){						  

													 

							 loopGeneral = 0;			 

							 rConstantVar = group.find('changevariable');							

							 rConstantVar.each(function(){	

							 	  genid                    				    = $(this).text();							 

								  genvars[v_objectgroup][genid]             = [];								  

								  genvars[v_objectgroup][genid]['value']    = $(this).attr('init');

								  genvars[v_objectgroup][genid]['target']   = $(this).attr('target');

								  genvars[v_objectgroup][genid]['default']  = $(this).attr('defaultconstant');

								  genvars[v_objectgroup][genid]['changeby'] = $(this).attr('changeby');

								  loopGeneral++;						 

							 });

							 

						} 	

						if(group.find('onload_generalgroup').length > 0){																

							 

							ctrGenAction = (genonload[v_objectgroup].length > 0) ? (genonload[v_objectgroup].length + 1) - 1 : 0;	

							genonload[v_objectgroup][ctrGenAction]	            = [];

							genonload[v_objectgroup][ctrGenAction]['objectid'] = 'general';

							genonload[v_objectgroup][ctrGenAction]['values']   = [];									

							

							loopActionCtr = 0;															

							rDataObjectAddedOnloadValues = $(this).find('onload_generalgroup');

							rDataObjectAddedOnloadValues.each(function(){

								

								v_exe_func = $(this).text();								

								if(v_exe_func.indexOf('model') > -1) v_exe_func = v_exe_func.replace('model', "\'" + v_objectgroup + "\'"); 

								

								genonload[v_objectgroup][ctrGenAction]['values'][loopActionCtr] = [];

								genonload[v_objectgroup][ctrGenAction]['values'][loopActionCtr]['resultholder'] = $(this).attr('resultholder');												

								genonload[v_objectgroup][ctrGenAction]['values'][loopActionCtr]['roundnumber']  = $(this).attr('roundnumber');

								genonload[v_objectgroup][ctrGenAction]['values'][loopActionCtr]['process']      = v_exe_func;

								genonload[v_objectgroup][ctrGenAction]['values'][loopActionCtr]['type']  = $(this).attr('type');

								loopActionCtr++;

								

							});

							 

						}

						

						rDataObjectGroupCtr = 0;

						if(group.find('object_values').length > 0){

							  

							 rDataObjectGroup = group.find('object_values');

													 

							 rDataObjectGroup.each(function(){					

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]             = [];		 

								 

								 //Button Limits

								 if(sWithLimits.indexOf($(this).find('type').text()) > -1){

									 aLimits[ctr]                                                = [];

									

									 if(typeof aLimits[ctr][$(this).find('type').text()] !== 'undefined'){

										 aLimits[ctr][$(this).find('type').text()]++;

									 } else {

										 aLimits[ctr][$(this).find('type').text()] = 0;

									 }

									 

									 if(aLimits[ctr][$(this).find('type').text()] > iWithCounter){

										 msg = 'You are only allowed ' + iWithCounter + ' time(s) in declaring ' + $(this).find('type').text();

										 alert(msg);

										 return;

									 }

									  	

								 }

								 

								 

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['type']     = $(this).find('type').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['header']   = $(this).find('header').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['id']       = $(this).find('id').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['label']    = $(this).find('label').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['label2']   = $(this).find('label2').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['rounds']   = $(this).find('rounds').text();


								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['default']  = $(this).find('default').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['tooltip']  = $(this).find('tooltip').text();	

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['readonly'] = $(this).find('readonly').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['emaillabel'] = $(this).find('email_label').text();

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['includedinmoreoption'] = $(this).find('included_in_more_option').text();

								 

								 if(rDataObjectGroup.find('required').text() == 1){

									 if(aConfig[ctr]['obj-required'] != '') aConfig[ctr]['obj-required'] += ',';

									 aConfig[ctr]['obj-required'] += aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['id'];

								 }

								 

								 //Actions involved in the object

								 rActionGroupCtr = 0;

								 if($(this).find('event').length > 0){									 									 

									 

									 v_objid = $(this).find('id').text();

									 actions[v_objectgroup][v_objid] = [];

																	 

									 rEvent     = $(this).find('event');

									 rEvent.each(function(){	

									 		 

											 v_action                         = $(this).attr('action');

											 v_function                       = $(this).attr('function');

											 v_extndfunc                      = $(this).attr('extendedfunction');

											 

											 if(v_function.indexOf('model') > -1) v_function = v_function.replace('model', "\'" + v_objectgroup + "\'");

											 if(v_extndfunc.indexOf('model') > -1) v_extndfunc = v_extndfunc.replace('model', "\'" + v_objectgroup + "\'");										

											 

											 actions[v_objectgroup][v_objid][v_action]          = [];		

											 actions[v_objectgroup][v_objid][v_action]['func']  = v_function; 

											 actions[v_objectgroup][v_objid][v_action]['efunc'] = v_extndfunc;                  

											  

											 if($(this).find('actiongroups').length > 0){

												actionLoopCtr                   = 0;

												actions[v_objectgroup][v_objid][v_action]['options'] = []; 

												actionLoop = $(this).find('actiongroups');

												

												actionLoop.each(function(){ 

												     	actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr] = []; 

														actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr]['resultholder'] = $(this).attr('resultholder');

														actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr]['roundnumber']  = $(this).attr('roundnumber');	

														actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr]['type']         = $(this).attr('type');

														actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr]['target']         = $(this).attr('target');

														actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr]['selectvalue']         = $(this).attr('selectvalue');

														actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr]['process']      = $(this).text();		

														actions[v_objectgroup][v_objid][v_action]['options'][actionLoopCtr]['other_value']      = $(this).attr('other-value');											

														

														actionLoopCtr++;

												});

												 

											 }									 

											 

											  

									         

									});		 

									 

									 

									 

										

								 } 

								 

								 //Added containers per object

								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['addedcontainer'] = [];

								 if($(this).find('addedcontainer').find('label').length > 0){

																						

									rDataObjectAddedContainerCtr = 0;

									rDataObjectAddedContainer = $(this).find('addedcontainer');

									rDataObjectAddedContainer.each(function(){

										

										aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['addedcontainer'][rDataObjectAddedContainerCtr] = [];

										

										aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['addedcontainer'][rDataObjectAddedContainerCtr]['label'] = $(this).find('label').text();

										aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['addedcontainer'][rDataObjectAddedContainerCtr]['idnames'] = $(this).find('idnames').text();

																									

										if($(this).find('onloadgroup').length > 0){																

											 

											ctrAction = (genonload[v_objectgroup].length > 0) ? (genonload[v_objectgroup].length + 1) - 1 : 0;  

											genonload[v_objectgroup][ctrAction]	            = [];

											genonload[v_objectgroup][ctrAction]['objectid']    = aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['id'];

											genonload[v_objectgroup][ctrAction]['values']      = [];									

											

											loopActionCtr = 0;															

											rDataObjectAddedOnloadValues = $(this).find('onloadgroup');

											rDataObjectAddedOnloadValues.each(function(){

												genonload[v_objectgroup][ctrAction]['values'][loopActionCtr] = [];

												genonload[v_objectgroup][ctrAction]['values'][loopActionCtr]['resultholder'] = $(this).attr('resultholder');												

												genonload[v_objectgroup][ctrAction]['values'][loopActionCtr]['roundnumber']  = $(this).attr('roundnumber');

												genonload[v_objectgroup][ctrAction]['values'][loopActionCtr]['process']      = $(this).text();

												genonload[v_objectgroup][ctrAction]['values'][loopActionCtr]['type']         = $(this).attr('type');

												loopActionCtr++;

											});

											

										}

										

										rDataObjectAddedContainerCtr++;

										

									});

									

									

							    }

								 

								 

								 if($(this).find('contents').length > 0){

									 

									 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents']  = [];

									 

									 rDataObjectGroupCtr_1 = 0;

									 rDataObjectContents = $(this).find('contents');								 

									 rDataObjectContents.each(function(){		 

										  

										  aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]  = [];

										  switch(aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['type']){

											  case 'range':

													

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['min']   = $(this).find('min').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['max']   = $(this).find('max').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['step']  = $(this).find('step').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['value'] = $(this).find('value').text();				

													

													break;

													

											  case 'dropdown':

													

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['text']     = $(this).find('text').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['selected'] =  $(this).find('selected').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['tooltip']  =  $(this).find('tooltip').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['value']    =  $(this).find('value').text();												

													break;

													

											  case 'checkbox':

											  case 'radio':

													

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['text']    =  $(this).find('text').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['checked'] =  $(this).find('checked').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['tooltip'] =  $(this).find('tooltip').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['tooltip_behavior'] =  $(this).find('tooltip_behavior').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['value']   =  $(this).find('value').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['readonly']   =  $(this).find('readonly').text();

													aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['disabled']   =  $(this).find('disabled').text();												

													break;										  	

											  

										  }

										  

										   rDataObjectGroupCtr_1++;

									

									 });

									 

								 }							 

										 

								 rDataObjectGroupCtr++;

							 });

							 

						}

						 

						 ctr++;

					});

				});

			},

			error: function() {

				alert("The XML File could not be processed correctly.");

			}		 

			});

		 

			return aConfig;

		} 

		

		//Adding additional css file on the header

		base.setCSS = function(str, id){

			if(typeof str === 'undefined') v_str = 'generic/css/calc-customize.css'; 

			else v_str = str;

			if(typeof id === 'undefined') v_id = 'custom-css-calculator'; 

			else v_id = id;

			if(document.getElementById(v_id) == null) $('head').append( $('<link rel="stylesheet" type="text/css" media="all" href="" id="'+ v_id +'"/>').attr('href', base.pluginPath(v_str) ) );	

		

		}

		

		//Adding additional js file on the header

		base.setJS = function(str, id){

			if(typeof str === 'undefined') v_str = 'generic/js/'; 

			else v_str = str;

			if(typeof id === 'undefined') v_id = 'custom-js'; 

			else v_id = id;	

			if(document.getElementById(v_id) == null) $('head').append( $('<script type="text/javascript" id="'+ v_id +'" src="" defer />').attr('src', base.pluginPath(v_str) ) );	

		

		}

		

		//Properly setting up the plugin path

		base.pluginPath = function(strpath){

	

			var page = window.location.protocol + "//" + window.location.host;   

			page    += (window.location.host.indexOf('localhost') > -1) ? config.pluginpath + strpath : config.pluginpath + strpath;				 		

			return page;

		}

		

		//Fill parent container

		base.fillContainer = function(details){

			if(details.length < 0) alert('Please check your configuration file');			

			if(details['panel'] == 'Yes')  base.panelContainer(details);

			else  base.regularContainer(details);

		}

		

		//

		base.panelContainer   = function(details){

			v_str  = '';

			oValue = new Array();

			if(details['headertype'] == 'primary_header'){ //panel-default

				v_str = '<div class="panel panel-primary panel-primary-escape">';				

			} else {

				

				v_str += '<div class="calc-border panel-primary-escape">';

				v_str += ( details['title'] != '' ) ? '<h2 class="title-holder">' + details['title']  + '</h2>' : '';								 	 

			}
 
			if(details['obj-results-position'] == 'head'){

				v_str += '<div class="panel-heading panel-header-escape">';

				v_str += '<div class="row"><div class="col-md-12 header-container">' + details['title']  + '</div></div>';

				if(details['obj-results'].length > 0){

					v_str += '	<div class="row">'; 

					$.each( details['obj-results'], function( a, v ){			  

						borderWidth = (v['border'] == 'yes') ? '' : '-none'; 

						prefixVal   = (v['prefix'] != '') ? v['prefix'] : '';

						prefixVal   += (prefixVal != '') ? '&nbsp;' + v['default'] : v['default'];

						switch(details['obj-results'].length){

							case 1: colnumber = 'col-md-12'; break;

							case 2: colnumber = 'col-md-6'; break;

							case 3: colnumber = 'col-md-4'; break;

							default: colnumber = 'col-md-2'; break;	

						}

						v_str += '	    <div class="'+ colnumber +' "><div class="label-float-header">'+ v['label'] +'</div><div class="div-white-border' + borderWidth + '"><span class="money-format"><p>'+ details['denomination'] +'</p></span><span id="'+ v['id'] +'" class="obj-clear money-value-text" data-emaillabel="'+ v['emaillabel'] +'">'+ prefixVal +'</span></div><div class="obj-clear"></div></div>'; //<div class="obj-clear"></div>

					});

					v_str += '	</div>';

				}

				v_str += '</div>'; 

			}			

			oValue['position']     = details['obj-results-position'];

			oValue['resultbox']    = details['obj-results'];

			oValue['denomination'] = details['denomination'];

			v_str += '<div class="panel-body">' + base.setContainer(details['column'], details['obj-containers'], details['name'], oValue) + '</div>';

			v_str += '</div>';				 

			obj.html(v_str);						

		}	

		

		//

		base.getOnloadProcess = function (details){

			$.each( details, function( i, v ){		

				 

				if(v['values'].length > 0){

					$.each( v['values'], function( a, b ){						  

						if(b['type'] == 'html'){

							

							e = eval(b['process']);

							e = (b['roundnumber'] == 'no') ? e : e.toFixed(0);

							

							if($('#' + b['resultholder']).prop("tagName") != 'INPUT'){

								$('#' + b['resultholder']).html(e);

							} else {

								$('#' + b['resultholder']).value(e);

							}	

							

						} else {

							  

							eval(b['process']);

							

						}

											

					});

				} 

			});

		}

		

		//

		base.regularContainer = function(details){

			v_str = '';

			v_str = '<div class="row"><div class="col-md-12 header-container">' + details['title']  + '</div></div>';

			if(details['obj-results'].length > 0){

				v_str += '	<div class="row">'; 

				$.each( details['obj-results'], function( a, v ){			  

				    borderWidth = (v['border'] == 'yes') ? '' : '-none'; 

					prefixVal   = (v['prefix'] != '') ? v['prefix'] : '&nbsp;';

					switch(details['obj-results'].length){

						case 1: colnumber = 'col-md-12'; break;

						case 2: colnumber = 'col-md-6'; break;

						case 3: colnumber = 'col-md-4'; break;

						default: colnumber = 'col-md-2'; break;	

					}

					

					v_str += '	    <div class="'+ colnumber +'"><label class="label-float-header">'+ v['label'] +'</label><div class="div-gray-border' + borderWidth + '"><span class="money-format">'+ details['denomination'] +'</span><span id="'+ v['id'] +'" class="money-value-text" data-emaillabel="'+ v['emaillabel'] +'">'+ prefixVal +'</span><div class="obj-clear"></div></div><div class="obj-clear"></div></div>';

				});

				v_str += '	</div>';

			}

            v_str += base.setContainer(details['column'], details['obj-containers'], details['name']);			

			obj.html(v_str);

		}

		

		

		//

		base.setContainer     = function(numbercolumn, container, name, oHolder){

			v_str2    = '';

			v_accord  = '';

			objLength = numbercolumn;  

			iButton   = 0;

			iMoreOpt  = 0;

			if(typeof oHolder === 'undefined') oHolder = null;

			 

			if(objLength == 2) v_diver = 'col-md-6';

			else v_diver = 'col-md-12';			

			$.each( container, function( i, v ){	//details['contents']

				if(v_diver == 'col-md-12'){

					v_str2 += '<div class="row">';					 

					v_str2 += base.selectionObject( v_diver,  v );					 

					v_str2 += '</div>';

				} else {

					 

					if(v['includedinmoreoption'] != ''){

						if(v['includedinmoreoption'] == 'No' || v['includedinmoreoption'] == 'no'){

							

							if(i == 0) v_str2 += '<div class="row">';

							//else v_str2 += ((i % 2) == 0) ? '</div><div class="row">' : '';	

												 

							v_str2 += base.selectionObject( v_diver, v );	

							 

						} else {

							

							if(iMoreOpt == 0) v_accord += '<div id="collapseOne-'+name+'" class="col-md-12 collapse"><div class="accordion-inner">';

							v_accord += base.selectionObject( v_diver, v );

							iMoreOpt++;

						}

					} else if(v['type'].indexOf('button-') > -1) {

						if(v_accord != ''){

							

							if(iButton == 0){  

								

								v_str2 += '</div><div class="row">';

								v_str2 += '<div class="accordion-group"><div class="row"><div class="row">';

								//v_str2 += '<div class="'+ v_diver +'">&nbsp;</div><div class="'+ v_diver +'">';

								//v_str2 += '<div class="row"><div class="'+ v_diver +'">';	

								//v_str2 += base.selectionObject( v_diver, v ); 	

								v_str2 += v_accord + '</div></div></div><div class="row"><div class="'+ v_diver +'">';

								v_str2 += '&nbsp;</div><div class="'+ v_diver +'"><div class="row"><div class="'+ v_diver +'">';							

								v_str2 += base.selectionObject( v_diver, v, 'data-toggle="collapse" data-target="^name"', container);

								

							} else if((iButton % 2) == 1) {	

							

								v_str2 += '</div><div class="'+ v_diver +'">';	

								v_str2 += base.selectionObject( v_diver, v );

								v_str2 += '</div></div></div></div></div></div>';		 

												

							} 						

								

						} else {

							

							if(iButton == 0){ 

									

									if(v_accord != '') v_accord += '</div>';									

									if(oHolder['position'] != 'foot'){								

										v_str2 += '</div><div class="row"><div class="'+ v_diver +'">&nbsp;</div><div class="'+ v_diver +'">'; 

									} else {

										

										sResultbox = '';										

										if(typeof oHolder['resultbox'] !== 'undefined' && oHolder['resultbox'].length > 0){

																					

											$.each( oHolder['resultbox'], function( a, v ){			  

												

												borderWidth = (v['border'] == 'yes') ? '' : '-none'; 

												prefixVal   = (v['prefix'] != '') ? v['prefix'] : '';

												prefixVal   += (prefixVal != '') ? '&nbsp;' + v['default'] : v['default'];											

												sResultbox += '<div class="col-md-7"><div class="money-value-label">'+ v['label'] +'</div></div><div class="col-md-5 pricebox binder"><div class="money-format"><p class="sign">'+ oHolder['denomination'] +'</p><div class="money-value-text" id="'+ v['id'] +'" data-emaillabel="'+ v['emaillabel'] +'">'+ prefixVal +'</div></div></div>'; //<div class="obj-clear"></div>

											

											}); 

											

											v_str2 += '</div><div class="row"><hr><div class="'+ v_diver +'">' + sResultbox;

											v_str2 += '</div><div class="'+ v_diver +'">';

										

										} else {

											

											v_str2 += '</div><div class="row"><div class="'+ v_diver +'">&nbsp;</div><div class="'+ v_diver +'">'; 

											

										}										

										

									}

								

						    } else v_str2 += ((iButton % 2) == 0) ? '</div></div><div class="row"><div class="'+ v_diver +'">' : '';	

							v_str2 += base.selectionObject( v_diver, v );

							

						}

											 

						iButton++;

					}

								

				}				 

								

			});

			if(v_diver == 'col-md-6') v_str2 += '</div>';		

			return v_str2;

		}

		

		//

		base.selectionObject  = function(column, details, additional, container){

			if(typeof additional === 'undefined') additional = '';

			if(typeof container === 'undefined') container = '';

			switch(details['type']){

				case 'range':					

					return base.objectRange(column, details);

					break;

				case 'dropdown':

					return base.objectDropdown(column, details);

					break;

				case 'checkbox':

					return base.objectcheckBox(column, details);

					break;

				case 'radio':

					return base.objectradioBox(column, details);

					break;	

				default:

					return base.objectSubbutton(column, details, additional, container);

					break;

			}			

		}		

		

		//

		base.objectRange     = function(column, details){

			v_str      = '';

			v_agnt     = base.getNavAgent();  

			v_addCss   = (v_agnt == 'msie') ? ' class="obj-background-none"' : '';

			v_readonly = (details['readonly'] == 1) ? ' readonly="readonly" ' : '';

			v_str += '<div class="'+ column +' obj-padding-devices">';

			v_str += '<div class="calc-obj-title">'+ details['header'] +'</div>';

			v_str += '<div class="calc-obj-holder">';

			v_str += '<input type="text" class="outputdiv" id="object'+ details['id'] +'" value="'+ details['contents'][0]['min'] +'" />';

			v_str += '<div class="obj-range-container">';

			v_str += '<div id="nObjSlider-'+ details['id'] +'" class="sliderLevelPos"></div>';

			v_str += '<input type="text" class="obj-range" id="'+ details['id'] +'" name="'+ details['id'] +'" data-emaillabel="'+ details['emaillabel'] +'" value="'+ details['contents'][0]['min'] +'" data-slider-min="'+ details['contents'][0]['min'] +'" data-slider-max="'+ details['contents'][0]['max'] +'" data-slider-step="'+ details['contents'][0]['step'] +'" data-object-model="'+ objModel +'" />';

			v_str += '</div>';

			if(details['addedcontainer'].length > 0){  

				v_str += '<div class="obj-clear"></div>';

				v_str += '<div class="flow-text">'+ base.getAdditionalDiv( details['addedcontainer'] ) +'</div>';				

     		} else {

				v_str += '<div class="obj-clear"></div>';

			}

			v_str += '</div>';

			v_str += '</div>';		

				 

			return v_str;                	 

		}		

		

		//

		base.objectDropdown  = function(column, details){

			v_str = '';

			v_str += '<div class="'+ column +' obj-padding-devices">';

			v_str += '<div class="calc-obj-title">'+ details['header'] +'</div>';

			v_str += '<div class="calc-obj-holder">';

			v_str += '<div class="btn-group obj-width98 btn-input clearfix">';

			v_str += '<button type="button" class="btn btn-default dropdown-toggle btn-calc-dd obj-width98 form-control btn-lookup-control" style="text-align: left" data-toggle="dropdown" aria-expanded="false" id="'+ details['id'] +'" value="" data-emaillabel="'+ details['emaillabel'] +'" data-object-model="'+ objModel +'">';

			v_str += '<span data-bind="label">' + details['label'] + '</span> <span class="caret"></span> ';

			v_str += '</button>';

			v_str += '<ul class="dropdown-menu calc-btn-group">';			 

			v_ctr = 0;

			$.each( details['contents'], function( i, v ){

				v_str += ' <li><a href="#" data-value-menu="' + v['value'] + '" data-value-original="' + v['value'] + '" data-item-select="'+v['selected']+'">' + v['text'] + '</a></li>';		

			});

			v_str += '</ul>';

			v_str += '</div>';

			v_str += '</div>';

			v_str += '</div>'; 

			return v_str;

		}

		

		//

		base.objectcheckBox  = function(column, details){

			v_str = '';

			v_totalIndex = details['contents'].length;			 

			v_str += '<div class="'+ column +' obj-padding-devices">';

			v_str += '<div class="calc-obj-title">'+ details['header'] +'</div>';

			v_str += '<div class="calc-obj-holder">';

			

			if((v_totalIndex % 2) == 0) zColumn = 'col-md-6';

			else zColumn = 'col-md-12';

			$.each( details['contents'], function( i, v ){	

				v_readonly = (v['readonly'] == 'yes') ? ' readonly="readonly" ' : '';	

				v_disabled = (v['disabled'] == 'yes') ? ' disabled="disabled" ' : '';

				v_checked  = (v['checked'] == 'yes') ? ' checked="checked" ' : '';	

				v_graytxt  = (v['checked'] == 'yes') ? ' obj-text-gray ' : ''; 	

				v_createTooltip = base.whatTooltipType(v['tooltip_behavior'], v['tooltip'], details['id'], i);

				if(!v_createTooltip) return;	

				if(zColumn == 'col-md-12'){				

					v_str += '<div class="row">';

					v_str += '<div class="'+ zColumn +'">';

					v_str += '<input type="checkbox" id="' + details['id'] + '" name="' + details['id'] + '" value="' + v['value'] + '" class="check-box" '+ v_readonly +' '+ v_disabled +' '+ v_checked +' data-emaillabel="'+ details['emaillabel'] +'" data-object-model="'+ objModel +'" data-value-original="' + v['value'] + '" /> ';

					v_str += '<label class="check-label '+ v_graytxt +'">' + v['text'];

					//v_str += (v['tooltip'] != '') ? '&nbsp;<span class="glyphicon glyphicon-question-sign" data-toggle="tooltip" title="' + v['tooltip'] + '"></span>' : '&nbsp;<span class="glyphicon glyphicon-question-sign"></span>';

					v_str += v_createTooltip;

					v_str += '</label><div class="obj-clear"></div>';

					v_str += '</div>';

					v_str += '</div>';

				} else {

					if(i == 0) v_str += '<div class="row">';

					else v_str += ((i % 2) == 0) ? '</div><div class="row">' : '';				



					v_str += '<div class="'+ zColumn +'">';

					v_str += '<input type="checkbox" id="' + details['id'] + '" name="' + details['id'] + '" value="' + v['value'] + '" class="check-box" '+ v_readonly +' '+ v_disabled +' '+ v_checked +' data-emaillabel="'+ details['emaillabel'] +'" data-object-model="'+ objModel +'" data-value-original="' + v['value'] + '" /> ';

					v_str += '<label class="check-label '+ v_graytxt +'">' + v['text'];

					//v_str += (v['tooltip'] != '') ? '&nbsp;<span class="glyphicon glyphicon-question-sign" data-toggle="tooltip" title="' + v['tooltip'] + '"></span>' : '&nbsp;<span class="glyphicon glyphicon-question-sign"></span>';

					v_str += v_createTooltip;

					v_str += '</label><div class="obj-clear"></div>';

					v_str += '</div>';			

				}								 

			});                 	 

			if(zColumn == 'col-md-6') v_str += '</div>';

			v_str += '</div>';		

			v_str += '</div>'; 

			return v_str;

		}	

		

		//

		base.objectradioBox  = function(column, details){

			v_str = '';

			v_totalIndex = details['contents'].length;			 

									

			v_str += '<div class="'+ column +' obj-padding-devices">';

			v_str += '<div class="calc-obj-title">'+ details['header'] +'</div>';

			v_str += '<div class="calc-obj-holder">';

			

			if((v_totalIndex % 2) == 0) zColumn = 'col-md-6';

			else zColumn = 'col-md-12';

			$.each( details['contents'], function( i, v ){	

				v_readonly = (v['readonly'] == 'yes') ? ' readonly="readonly" ' : '';	

				v_disabled = (v['disabled'] == 'yes') ? ' disabled="disabled" ' : '';

				v_checked  = (v['checked'] == 'yes') ? ' checked="checked" ' : '';	

				v_graytxt  = (v['checked'] == 'yes') ? ' obj-text-gray ' : ''; 	

								

				v_createTooltip = base.whatTooltipType(v['tooltip_behavior'], v['tooltip'], details['id'], i); 

				if(!v_createTooltip) return;	

				if(zColumn == 'col-md-12'){

					v_str += '<div class="row">';

					v_str += '<div class="'+ zColumn +'">';

					v_str += '<input type="radio" id="' + details['id'] + '" name="' + details['id'] + '" value="' + v['value'] + '" class="check-box" '+ v_readonly +' '+ v_disabled +' '+ v_checked +' data-emaillabel="'+ details['emaillabel'] +'" data-object-model="'+ objModel +'" data-value-original="' + v['value'] + '" /> ';

					v_str += '<label class="check-label '+ v_graytxt +'">' + v['text'];

					//v_str += (v['tooltip'] != '') ? '&nbsp;<span class="glyphicon glyphicon-question-sign" data-toggle="tooltip" title="' + v['tooltip'] + '"></span>' : '&nbsp;<span class="glyphicon glyphicon-question-sign"></span>';

					v_str += v_createTooltip;

					v_str += '</label><div class="obj-clear"></div>';

					v_str += '</div>';

					v_str += '</div>';

				} else {

					if(i == 0) v_str += '<div class="row">';

					else v_str += ((i % 2) == 0) ? '</div><div class="row">' : '';				



					v_str += '<div class="'+ zColumn +'">';

					v_str += '<input type="radio" id="' + details['id'] + '" name="' + details['id'] + '" value="' + v['value'] + '" class="check-box" '+ v_readonly +' '+ v_disabled +' '+ v_checked +' data-emaillabel="'+ details['emaillabel'] +'" data-object-model="'+ objModel +'" data-value-original="' + v['value'] + '" /> ';

					v_str += '<label class="check-label '+ v_graytxt +'">' + v['text'];

					//v_str += (v['tooltip'] != '') ? '&nbsp;<span class="glyphicon glyphicon-question-sign" data-toggle="tooltip" title="' + v['tooltip'] + '"></span>' : '&nbsp;<span class="glyphicon glyphicon-question-sign"></span>';

					v_str += v_createTooltip;

					v_str += '</label><div class="obj-clear"></div>';

					v_str += '</div>';			

				}								 

			});                 	 

			if(zColumn == 'col-md-6') v_str += '</div>';

			v_str += '</div>';			

			v_str += '</div>'; 

			return v_str;

		}

		

		//

		base.objectSubbutton = function(column, details, others, containers){

			if(typeof others === 'undefined') others = '';

			if(others != '') others = others.replace('^name', "collapseOne-" + objModel); 

			v_str = '';	 
					 

			v_action   = base.processAction(details['id'], details['type']);
			v_objwidth = (column != 'col-md-12') ? '' : ' obj-left-margin75 obj-width20 '; //obj-left-margin8 obj-width80 

			if(details['type'] != 'button-reg'){

				v_objtype  = (details['type'] == 'button-submit') ? 'submit' : 'button';	

				v_objcolor = (details['type'] == 'button-submit') ? ' btn-darkness border-outline0 ' : ' btn-warning border-outline0 ';

			} else {

				v_objtype  = 'button';

				v_objcolor = ' btn-default ';

			}

			v_objrounds  = (details['rounds'] == 'Yes') ? ' border-rounds ' : '';

			v_objsliders = base.objCounterInsideSlider(containers, 'includedinmoreoption');

			//v_str += '<div class="'+ column +'">';

			//v_str += '<div class="calc-obj-title">&nbsp;</div>';

			//v_str += '<div class="calc-obj-holder">';

			if(details['type'] == 'button-collapse' && v_objsliders <= 0) return '';

			else if(details['type'] == 'button-submit' && v_objsliders <= 0) v_objwidth += ' obj-left-margin40 obj-width80 obj-small-screen-button';

			v_sAdded = (sDomainName.indexOf('localhost') > -1) ? v_objwidth + v_objcolor + v_objrounds : 'btn-submit';

			v_str += '<button type="' + v_objtype + '" class="btn '+ v_sAdded +' btn-custom-class btn-lookup-control" ' + v_action +' data-object-model="'+ objModel +'" '+ others +'>'+ details['label'] +'</button>';

			//v_str += '</div>';

			//v_str += '</div>';

			return v_str;  

		}	

		

		//

		base.getActionData = function(v_id, model){

			if(typeof actions[model] === 'undefined') return "";

			v_objAction = actions[model];

			if(typeof v_objAction[v_id] === 'undefined') return "";

			return v_objAction[v_id];		 

		}

		

		//

		base.getAllData = function(type){

			if(typeof type === 'undefined') return Array();

			for(dIndex in aSetupInfo['obj-containers']){

				if(aSetupInfo['obj-containers'][dIndex]['type'] == type){

					return aSetupInfo['obj-containers'][dIndex];

				}

			}

			return Array();

		}

		

		//

		base.updateResultBox = function(model){			   

				//Update Object base variables

				base.updateChangeVariables(model);

						 							 		 			

				for(aIndex in resultBox[model]){  

					 

					if(sSkipWords.indexOf(aIndex) > -1) return false;

					v_objcur  = $('#' + aIndex);   

					if(resultBox[model][aIndex]['formula'] != ''){

						 

						v_formula  = base.replaceChangeVariableWithReal(resultBox[model][aIndex]['formula'], model);  

						v_eformula = base.replaceConstantsWithReal(v_formula, model);    

						v_value    = eval(v_eformula);     

						v_value    = (resultBox[model][aIndex]['roundnumber'] == 'no') ? v_value : v_value.toFixed();  

						if(v_objcur.prop("tagName") == "DIV" || v_objcur.prop("tagName") == "SPAN" || v_objcur.prop("tagName") == "LABEL" || v_objcur.prop("tagName") == "P"){

							v_objcur.html(v_value);

						} else {

							v_objcur.val(v_value);

						}

						 

					}

				}

		}

		

		

		//

		base.replaceConstantsWithReal = function(str, model){

			sFormula = str;

			for(cIndex in contants[model]){

				if(sFormula.indexOf(cIndex) > -1){

					sFormula = sFormula.replace(new RegExp(cIndex, "gi"), parseFloat(contants[model][cIndex]['value']));	

				}

			}

			return sFormula;
		}

		

		//

		base.replaceChangeVariableWithReal = function(str, model){

			sFormula = str;

			for(cIndex in genvars[model]){ 			

			    sFormula = base.replaceChangeVariableWithCondition(sFormula, model, cIndex);

				if(sFormula.indexOf(cIndex) > -1){		 			  

					sFormula = sFormula.replace(new RegExp(cIndex, "gi"), parseFloat(genvars[model][cIndex]['value']));	

				}

			}

			return sFormula;

		}	

		

		

		//

		base.replaceChangeVariableWithCondition = function(str, model, obj){

			sTrReplacement = '';

			if(typeof aValueRange[model][obj] !== 'undefined'){  

				oVal = parseInt(genvars[model][cIndex]['value']);  

				oKey = aValueRange[model][obj]; 

				 

				for (var k in oKey) {   

					 				

					if(typeof oKey[k]['init'] === 'undefined' || typeof oKey[k]['max'] === 'undefined') break;

					if(oKey[k]['init'] == '' || oKey[k]['max'] == '') break;

					if(oVal >= parseInt(oKey[k]['init']) && oVal <= parseInt(oKey[k]['max'])){	

					    sTrReplacement = obj;  					

						sTrReplacement += base.setOperation(genvars[model][cIndex]['changeby']);

						sTrReplacement += oKey[k]['val'];

						break;

					} 				 

				} 				 

			} 

			

			if(sTrReplacement == '') {				

				sTrReplacement = obj;   

				sTrReplacement += base.setOperation(genvars[model][cIndex]['changeby']); 

				sTrReplacement += genvars[model][cIndex]['default'];  

			}

			sTrKey = obj + base.setOperation(genvars[model][cIndex]['changeby']) + 'changeval'; 

			sTrRet = str.replace(sTrKey, sTrReplacement);	 

			return sTrRet;

		}

		

		

		//

		base.setOperation = function(opt){

			switch(opt){

				case 'addition': return ' + '; break;

				case 'substraction': return ' - '; break;

				case 'multiply': return ' * '; break;

				case 'division': return ' / '; break;

				default: return ''; break;

			}

		}

		 

		

		//

		base.updateChangeVariables = function(model){

			if(typeof model === 'undefined') model = objModel;

			if(genvars[model].length < 0) return;

			for(bIndex in genvars[model]){

				 if(sSkipWords.indexOf(bIndex) > -1) return false;

				 objlist  = genvars[model][bIndex]['target'].split('|'); 

				 objvalue = 0;

				 v_objsum  = 0;

				 for(i = 0; i < objlist.length; i++){  

				 	 v_objcur = $('#' + objlist[i]); 

					 if(v_objcur.prop("tagName") == "INPUT" && (v_objcur.attr('type') == 'checkbox' || v_objcur.attr('type') == 'radio')){		 				 

						 $('input[type='+v_objcur.attr('type')+']').each(function(){

							 id = $(this).attr('id');                                                                     	

							 if(id == objlist[i] && $(this).is(':checked')) { v_objsum += parseInt($(this).val());	}						  

						 });						  

					 } else {						 

						 v_objsum += (v_objcur.val() == '') ? 0 : parseFloat(v_objcur.val());
					 	 

					 } 					 

				 }

				 

				 genvars[model][bIndex]['value'] = v_objsum;  

			}				 

			  

		}

		

		//

		base.processAction = function(v_id, v_type, model){

			if(typeof model === 'undefined') model = objModel;

			data = base.getActionData(v_id, model);  

			   

			switch(v_type){

				case 'range':
					 
					base.actionProceed(v_id, data); 

					break;

				case 'dropdown': 

					base.actionProceed(v_id, data); 

					break;

				case 'checkbox': 

					base.actionProceed(v_id, data); 

					break;

				case 'button-submit':

					v_action = '';

					for (prop in data){ 

						v_action += ' data-event-value="' + prop + '"'; 

						v_action += ' data-action-value="' + data[prop].func + '"';	

						if(typeof data[prop].options !== 'undefined' && data[prop].options.length > 0){

							$.each( data[prop].options, function( a, b ){

									v_action += (b['type'] == 'fetch') ? ' data-fetch-values="' + b['process'] + '"' : ' data-fetch-values=""';								

							});			

						}

						 

					}					 

					return v_action;

					break;	

				case 'button-collapse':

					v_action = '';

					for (prop in data){ 

						v_action += ' data-event-value="' + prop + '"'; 

						v_action += ' data-action-value="' + data[prop].func + '"';

						v_action += ' data-action-type="' + v_type + '"';

					}

					return v_action;

					break;	

				default:

					 

					break;

			} 		

		}

		

		//

		base.fetchObjectValues = function(str){

			if(str == '') return '';

			v_objects   = str.split('|');			 

			v_returnStr = '';

			for(i = 0; i < v_objects.length; i++){

				v_obj = $('#' + v_objects[i]);				

				if(v_obj.prop("tagName") == 'INPUT' && (v_obj.attr('type') == 'checkbox' || v_obj.attr('type') == 'radio')){

					v_valueStr = '';

					$('input[type='+v_obj.attr('type')+']').each(function(){

						 id = $(this).attr('id');  

						 if(id == v_objects[i] && $(this).is(':checked')) {

							 	v_sStr  =  $(this).next('label').html();

								v_sSplt = v_sStr.split('&nbsp;');

						 		if(v_valueStr != '') v_valueStr += ', ';

						 		v_valueStr += v_sSplt[0];

						 }						  

					 });

					 if(v_returnStr != '') v_returnStr += '|';

					 v_returnStr += v_obj.attr('data-emaillabel') + '~';

					 v_returnStr += v_valueStr;

					 

				} else if(v_obj.prop("tagName") == 'INPUT' && (v_obj.attr('type') == 'text' || v_obj.attr('type') == 'range')){	 

					 if(v_returnStr != '') v_returnStr += '|';

					 v_returnStr += v_obj.attr('data-emaillabel') + '~';

					 v_returnStr += v_obj.val();	

				} else if(v_obj.prop("tagName") == 'DIV' || v_obj.prop("tagName") == 'SPAN' || v_obj.prop("tagName") == 'LABEL'){				 					 if(v_returnStr != '') v_returnStr += '|';

					 v_returnStr += v_obj.attr('data-emaillabel') + '~';

					 v_returnStr += v_obj.prev().html() + " " + v_obj.html();

				} else {

					if(v_returnStr != '') v_returnStr += '|';

					v_returnStr += v_obj.attr('data-emaillabel') + '~';

					if(v_obj.prop("tagName") == 'BUTTON' && v_obj.hasClass('btn-lookup-control')){

						v_returnStr += (v_obj.find('[data-bind="label"]').text() != 'Choose a value') ? v_obj.find('[data-bind="label"]').text() : '';

					} else {

						v_returnStr += v_obj.html();	

					}

				}

			}

			if($.isFunction( $.cookie )){

				//if (typeof $.cookie('hubspotutk') !== 'undefined')  $.cookie('hubspotutk', config.cookie);

				if(typeof $.cookie('hubspotutk') !== 'undefined') {

				   var cookie = $.cookie('hubspotutk');

				   //if(v_returnStr != '') v_returnStr += '|';

				   //v_returnStr += 'hubspotutk~' + cookie;

				    

				} 

				

			} /*else if(config.cookie != '' && !$.isFunction( $.cookie )){

				alert('Jquery Cookie function is not present.\nPlease attached in order to use the Cookie Value.');

			}*/

			return v_returnStr;

		}

		

		//

		base.actionProceed = function(id, data){

			v_bFound = false; 
			
			for (prop in data){

				v_process = data[prop]; 

				if(typeof v_process['func'] !== 'undefined') eval(v_process['func']);				 				 

				if(typeof v_process['options'] !== 'undefined' && v_process['options'].length > 0){  

					$.each( v_process['options'], function( a, b ){						  
						
						v_objcur = $('#' + id);                    

						if(b['type'] == 'html'){

							

							e = eval(b['process']);

							e = (b['roundnumber'] == 'no') ? e : e.toFixed();

							

							if($('#' + b['resultholder']).prop("tagName") != 'INPUT'){

								$('#' + b['resultholder']).html(e);

							} else {

								$('#' + b['resultholder']).value(e);

							}

						} else if(b['type'] == 'select-increase') {

							 

							if(v_objcur.hasClass('btn-lookup-control')){ //v_objcur.prop("tagName") == 'BUTTON' && 

								

								v_ctr      = 0; 

								v_val      = v_objcur.find('[data-bind="label"]').text();								

								v_loopObj  = $('#' + b['target']);

								v_ptoValue = b['other_value'];

								

								if(v_val == b['process']){  									

									

									if(v_loopObj.prop("tagName") == 'INPUT' && (v_loopObj.attr('type') == 'checkbox' || v_loopObj.attr('type') == 'radio')){							

										v_whatObj = '';

										$('input[type='+v_loopObj.attr('type')+']').each(function(){

												v_loopcurid = $(this).attr('id');  

												if(v_whatObj != v_loopcurid) v_ctr = 0;

												if(v_loopcurid == b['target']){ 

													

													curpoint  = $(this).next('label').html();

													curvalue  = parseFloat($(this).val());	

													oldkey    = $(this).attr('data-value-original');

													

													v_rowinc   = curvalue + v_ptoValue;

													v_rowvalue = eval(v_rowinc);

													v_newlabel = curpoint.replace(oldkey, v_rowvalue);

													

													$(this).val(v_rowvalue);

													$(this).next('label').html(v_newlabel);

													

												}

												v_whatObj = v_loopcurid;

												v_ctr++;

										});

										

								    } else if(v_loopObj.hasClass('btn-lookup-control')){   //v_loopObj.prop("tagName") == 'BUTTON' && 

										

										v_curObjLabel = v_loopObj.find('[data-bind="label"]').text();

										v_loopObj.next('ul').children('li').each(function(){

											

											curpoint = $(this).children('a').html();

											curvalue = parseFloat($(this).children('a').attr('data-value-menu'));

											oldkey    = $(this).children('a').attr('data-value-original');						 

											 

											v_rowinc   = curvalue + v_ptoValue;

											v_rowvalue = eval(v_rowinc);

											v_newlabel = curpoint.replace(oldkey, v_rowvalue); 

											

											if(v_curObjLabel == curpoint){

												v_curModel = v_loopObj.attr('data-object-model');

												v_loopObj.find('[data-bind="label"]').text(v_newlabel);

												v_loopObj.val(v_rowvalue);

												base.updateResultBox(v_curModel);

											}

											

											$(this).children('a').attr('data-value-menu', v_rowvalue);

											$(this).children('a').html(v_newlabel);										

											

											v_ctr++;

										});

										

									}

									

								} else {

									 

									if(v_loopObj.prop("tagName") == 'INPUT' && (v_loopObj.attr('type') == 'checkbox' || v_loopObj.attr('type') == 'radio')){

										v_whatObj = '';

										$('input[type='+v_loopObj.attr('type')+']').each(function(){

												v_loopcurid = $(this).attr('id');

												if(v_whatObj != v_loopcurid) v_ctr = 0;

												if(v_loopcurid == b['target']){

													

													curpoint  = $(this).next('label').html();											 

													oldkey    = $(this).val();

													

													v_vOriginal = $(this).attr('data-value-original');

													v_newlabel  = curpoint.replace(oldkey, v_vOriginal);

													$(this).val(v_vOriginal);

													$(this).next('label').html(v_newlabel);

												

												}

												v_whatObj = v_loopcurid;

												v_ctr++;

										});

										

								    } else if(v_loopObj.hasClass('btn-lookup-control')){ //v_loopObj.prop("tagName") == 'BUTTON' && 

										

										v_curObjLabel = v_loopObj.find('[data-bind="label"]').text();

										v_loopObj.next('ul').children('li').each(function(){

											

											curpoint = $(this).children('a').html();

											curvalue = $(this).children('a').attr('data-value-original'); 

											oldkey   = parseFloat($(this).children('a').attr('data-value-menu'));

											

											v_vOriginal = $(this).children('a').attr('data-value-original');																				

											v_newlabel = curpoint.replace(oldkey, v_vOriginal); 										

											

											if(v_curObjLabel == curpoint){

												v_curModel = v_loopObj.attr('data-object-model');

												v_loopObj.find('[data-bind="label"]').text(v_newlabel);

												v_loopObj.val(v_vOriginal);												

												base.updateResultBox(v_curModel);

											}

											

											$(this).children('a').attr('data-value-menu', v_vOriginal);

											$(this).children('a').html(v_newlabel);

											

											v_ctr++;

											

										});

										

									}

									

								}

								

							} else if(v_objcur.prop("tagName") == 'INPUT' && (v_objcur.attr('type') == 'checkbox' || v_objcur.attr('type') == 'radio')){   

								 

								$('input[type='+v_objcur.attr('type')+']').each(function(){

											

											v_loopCtr 		= 1;   

											v_loopObj        = $('#' + b['target']);

											v_val            = $(this).next('label').html();

											v_ptoValue       = b['other_value'];

											

											if(v_val.indexOf(b['process']) > -1){

												v_targetchecked  = ($(this).is(':checked')) ? true : false;		

											}

											

											if(typeof v_targetchecked !== 'undefined' && typeof v_targetchecked === 'boolean'){

												 

													if(v_loopObj.prop("tagName") == 'INPUT' && (v_loopObj.attr('type') == 'checkbox' || v_loopObj.attr('type') == 'radio')){							

															

														v_whatObj = '';

														$('input[type='+v_loopObj.attr('type')+']').each(function(){

																v_loopcurid = $(this).attr('id');  

																if(v_whatObj != v_loopcurid) v_ctr = 0;

																if(v_loopcurid == b['target']){ 

																																			

																		if(v_targetchecked && !v_bFound){

																			

																			curpoint  = $(this).next('label').html();

																			curvalue  = parseFloat($(this).val());	

																			oldkey    = $(this).attr('data-value-original');						 

																			

																			v_rowinc   = parseFloat($(this).val()) + v_ptoValue;

																			v_rowvalue = eval(v_rowinc);

																			v_newlabel = curpoint.replace(oldkey, v_rowvalue); 

																			if(v_loopCtr == $("body").find("#" + b['target']).length) v_bFound = true;

																		} else {

																			

																			curpoint  = $(this).next('label').html();

																			oldkey    = $(this).val();

																			v_rowvalue = $(this).attr('data-value-original');

																			v_newlabel  = curpoint.replace(oldkey, v_rowvalue);

																			v_bFound   = false; 															 

																		}

																		

																		$(this).val(v_rowvalue);

																		$(this).next('label').html(v_newlabel);

																	}

																	

																 

																v_whatObj = v_loopcurid;

																v_loopCtr++;

														});

														

													} else if(v_loopObj.hasClass('btn-lookup-control')){  //v_loopObj.prop("tagName") == 'BUTTON' && 

														

														v_loopCtr = 1; 

														v_curObjLabel = v_loopObj.find('[data-bind="label"]').text();

														

														v_loopObj.next('ul').children('li').each(function(){

															 														

																if(v_targetchecked && !v_bFound){

																		curpoint  = $(this).children('a').html();

																		curvalue  = parseFloat($(this).children('a').attr('data-value-menu'));	

																		oldkey    = $(this).children('a').attr('data-value-original');						 

																		

																		v_rowinc   = curvalue + v_ptoValue;  

																		v_rowvalue = eval(v_rowinc); 

																		v_newlabel = curpoint.replace(oldkey, v_rowvalue);  

																		if(v_loopCtr == v_loopObj.next('ul').children('li').length) v_bFound   = true;														

																} else {

																		curpoint  = $(this).children('a').html();

																		oldkey    = $(this).children('a').attr('data-value-menu');																																	

																		v_rowvalue = $(this).children('a').attr('data-value-original');

																		v_newlabel  = curpoint.replace(oldkey, v_rowvalue);	

																		v_bFound   = false;													 

																}

																 

																if(v_curObjLabel == curpoint){

																	v_curModel = v_loopObj.attr('data-object-model');

																	v_loopObj.find('[data-bind="label"]').text(v_newlabel);

																	v_loopObj.val(v_rowvalue);																	

																	base.updateResultBox(v_curModel);

																}

																

																$(this).children('a').attr('data-value-menu', v_rowvalue);

																$(this).children('a').html(v_newlabel);

															 																					

																												 

															    v_loopCtr++;

														});

														

												   }	

												   

												   

												   v_targetchecked = null;				 

										}	

											 

								});

								

							}

							

						} else if(b['type'] == 'select-value'){

							

							if(v_objcur.hasClass('btn-lookup-control')){   //v_objcur.prop("tagName") == 'BUTTON' && 

								v_ctr = 0; 

								v_val = v_objcur.find('[data-bind="label"]').text();								

								v_loopObj = $('#' + b['target']);

								ptolook  = parseInt(b['selectvalue'].replace('target.item=', ''));

								

								if(v_val == b['process']){  									

									

									if(v_loopObj.prop("tagName") == 'INPUT' && (v_loopObj.attr('type') == 'checkbox' || v_loopObj.attr('type') == 'radio')){							

										v_whatObj = '';

										$('input[type='+v_loopObj.attr('type')+']').each(function(){

												v_loopcurid = $(this).attr('id');  

												if(v_whatObj != v_loopcurid) v_ctr = 0;

												if(v_loopcurid == b['target'] && v_ctr == ptolook){ 

													$(this).prop('checked', true);

													$(this).prop('disabled', 'disabled');

												}

												v_whatObj = v_loopcurid;

												v_ctr++;

										});

										

								    } else if(v_loopObj.hasClass('btn-lookup-control')){    //v_loopObj.prop("tagName") == 'BUTTON' && 

										

										v_loopObj.next('ul').children('li').each(function(){

											

											curpoint = $(this).children('a').html();

											curvalue = $(this).children('a').attr('data-value-menu');

											if(v_ctr == ptolook){

												v_loopObj.find('[data-bind="label"]').text(curpoint);

												v_loopObj.val(curvalue);

											}

											v_ctr++;

										});

										

									}

									

								} else {

									

									if(v_loopObj.prop("tagName") == 'INPUT' && (v_loopObj.attr('type') == 'checkbox' || v_loopObj.attr('type') == 'radio')){

										v_whatObj = '';

										$('input[type='+v_loopObj.attr('type')+']').each(function(){

												v_loopcurid = $(this).attr('id');

												if(v_whatObj != v_loopcurid) v_ctr = 0;

												if(v_loopcurid == b['target'] && v_ctr == ptolook){

													$(this).prop('checked', false);

													$(this).removeProp('disabled');

												}

												v_whatObj = v_loopcurid;

												v_ctr++;

										});

										

								    } else if(v_loopObj.hasClass('btn-lookup-control')){     //v_loopObj.prop("tagName") == 'BUTTON' && 

										

										v_loopObj.next('ul').children('li').each(function(){

											

											curpoint = $(this).children('a').html();

											curvalue = $(this).children('a').attr('data-value-menu');

											if(v_ctr == ptolook){

												v_loopObj.find('[data-bind="label"]').text('Choose a value');

												v_loopObj.val('');

											}

											v_ctr++;

										});

										

									}

									

								}

							}

							

						} else if(b['type'] == 'remove-value'){

							

							if(v_objcur.hasClass('btn-lookup-control')){             //v_objcur.prop("tagName") == 'BUTTON' && 

								

								v_ctr = 0; 

								v_val = v_objcur.find('[data-bind="label"]').text();								

								v_loopObj = $('#' + b['target']);

								ptolook  = parseInt(b['selectvalue'].replace('target.item=', ''));

								

								if(v_val == b['process']){  									

									

									if(v_loopObj.prop("tagName") == 'INPUT' && (v_loopObj.attr('type') == 'checkbox' || v_loopObj.attr('type') == 'radio')){							

										v_whatObj = '';

										$('input[type='+v_loopObj.attr('type')+']').each(function(){

												v_loopcurid = $(this).attr('id');  

												if(v_whatObj != v_loopcurid) v_ctr = 0;

												if(v_loopcurid == b['target'] && v_ctr == ptolook){ 

													$(this).parent('div').hide();

												}

												v_whatObj = v_loopcurid;

												v_ctr++;

										});

										

								    } else if(v_loopObj.hasClass('btn-lookup-control')){      //v_loopObj.prop("tagName") == 'BUTTON' && 

										

										v_loopObj.next('ul').children('li').each(function(){

											

											curpoint = $(this).children('a').html();

											curvalue = $(this).children('a').attr('data-value-menu');

											if(v_ctr == ptolook){

												$(this).hide();

											}

											v_ctr++;

										});

										

									}

									

								} else {

									

									if(v_loopObj.prop("tagName") == 'INPUT' && (v_loopObj.attr('type') == 'checkbox' || v_loopObj.attr('type') == 'radio')){

										v_whatObj = '';

										$('input[type='+v_loopObj.attr('type')+']').each(function(){

												v_loopcurid = $(this).attr('id');

												if(v_whatObj != v_loopcurid) v_ctr = 0;

												if(v_loopcurid == b['target'] && v_ctr == ptolook){

													$(this).parent('div').show();

												}

												v_whatObj = v_loopcurid;

												v_ctr++;

										});

										

								    } else if(v_loopObj.hasClass('btn-lookup-control')){        //v_loopObj.prop("tagName") == 'BUTTON' && 

										

										v_loopObj.next('ul').children('li').each(function(){

											

											curpoint = $(this).children('a').html();

											curvalue = $(this).children('a').attr('data-value-menu');

											if(v_ctr == ptolook){

												$(this).show();

											}

											v_ctr++;

										});

										

									}

									

								}

								

							}

							

						}

						 

					});							

				}

				if(typeof v_process['efunc'] !== 'undefined') eval(v_process['efunc']);

			}

		}

		

		base.updateRangeValue = function(input){

    

			var selectedColor    = "#CCE9F9"; //428bca

			var nonSelectedColor = "#FFF";

			var idname           = input.attr('id');

			var value            = input.val();

			var maximum          = input.attr('max'); 

			var inputWidth       = input.width();

			var background       = base.getRangeGradient(selectedColor, nonSelectedColor, value, maximum);  

			input.css('background', background);   

		

		}

		

		base.getNavAgent = function(){

			browsername = window.navigator.userAgent; 

			if(browsername.indexOf('Firefox') > -1)	return 'firefox';

			else if(browsername.indexOf('MSIE') > -1 || browsername.indexOf('Trident') >-1) return 'msie';

			else if(browsername.indexOf('Opera') > -1) return 'opera';

			else if(browsername.indexOf('Chrome') > -1) return 'chrome';

			else return 'others';

		

		}

		

		base.getPseudoCode = function(){

			browsername = base.getNavAgent();  

			if(browsername == 'firefox') return "-moz-linear-gradient"; //"moz-range-track";

			else if(browsername == 'msie') return "linear-gradient"; //"ms-track";

			else if(browsername == 'opera') return "-o-linear-gradient"; //"ms-track";

			else      return "linear-gradient"; //"webkit-slider-runnable-track";

		}

		

		//

		base.getRangeGradient = function(color1,color2,value,maximum){

			var gradient = base.getPseudoCode();

			gradient += "(to right, ";

			var breakPoint = (value/maximum)*100;

			var attrValue = gradient + color1 + " 0%, " + color1 + " " + breakPoint + "%, " + color2 + " " + breakPoint + "%, " + color2 + " 100%)";  

			return attrValue;

		}

		

		//

		base.setSelectedItem = function(){

			$(".btn-group").children(".calc-btn-group").each(function(){

					 

				v_ctr         = 0;

				v_aObjConData = [];

				v_sObjTarget  = $(this).prev('button').attr('id');

				v_sModelType  = $(this).prev('button').attr('data-object-model');

				v_sObjType    = 'dropdown';

				$(this).children('li').each(function(){

					v_sDataText  = $(this).children('a').html();

					v_sDataValue = $(this).children('a').attr('data-value-menu');

					if($(this).children('a').attr('data-item-select') == 'yes'){  

						v_aObjConData[v_ctr]          = [];

						v_aObjConData[v_ctr]['text']  = v_sDataText;

						v_aObjConData[v_ctr]['value'] = v_sDataValue; 

						v_ctr++;

					}

				});

				 

				if(v_aObjConData.length > 0){

					if(v_aObjConData.length > 1){

						alert('Unable to set default value for ' +v_sObjTarget+ ' for many selected items were set.');

						return;

					} else if(v_aObjConData.length == 1){

						$(this).prev('button').find( '[data-bind="label"]' ).text(v_aObjConData[0]['text']);

						$(this).prev('button').val(v_aObjConData[0]['value']);

						base.processAction(v_sObjTarget, v_sObjType, v_sModelType);

					}				

				}

			});

			

		}

		

		

		//

		base.setEvents = function(){

			 

			//For Tool Tip

			$('[data-toggle="tooltip"]').tooltip();

	  		

			//For Dropdowns

			$(".btn-calc-dd").dropdown();

			$(".calc-btn-group").on('click', 'li a', function(e){ 

				var v_target = $( e.currentTarget );	

				var v_target2    = $( e.currentTarget );	  

			  

				v_target.closest( '.btn-group' )

				 .find( '[data-bind="label"]' ).text( v_target.text() )

				 .end()

				 .children( '.btn-calc-dd' ).dropdown( 'toggle' )

				 .val( v_target.attr('data-value-menu'));

				 

			  

			  	v_id    = v_target.closest('.btn-group').children('.btn').attr('id'); 			  	

			 	v_model = v_target.closest('.btn-group').children('.btn').attr('data-object-model');

				v_type  = 'dropdown';			    

			   

			 	//base.updateChangeVariables(v_model);

			  	base.processAction(v_id, v_type, v_model);

				if(v_target2.closest('.btn-group').hasClass('open')){

					v_target2.closest('.btn-group').children('button').attr('aria-expanded', false);

					v_target2.closest('.btn-group').removeClass('open');					 

				} 

     		  	return false; 

			});

		    

			//For Range				

			$(".obj-range").each(function(){

				v_thisCon   = $(this);

				v_thisConID = v_thisCon.attr('id');					

				v_type      = 'range';

				if(typeof aSliderInfo[v_thisConID] === 'undefined'){

					aSliderInfo[v_thisConID] = new Array();

				}

				if(typeof aSliderInfo[v_thisConID]['objSlider'] === 'undefined')  aSliderInfo[v_thisConID]['objSlider']  = document.getElementById('nObjSlider-' + v_thisConID);
				if(typeof aSliderInfo[v_thisConID]['objSlider2'] === 'undefined') aSliderInfo[v_thisConID]['objSlider2'] = 'nObjSlider-' + v_thisConID;
				if(typeof aSliderInfo[v_thisConID]['objOutput'] === 'undefined')  aSliderInfo[v_thisConID]['objOutput']  = (v_thisCon.parent('div').find('output').length > 0) ? v_thisCon.parent('div').prev('output').attr('id') :  v_thisCon.parent('div').prev('.outputdiv').attr('id');
                  
				nVStep = (v_thisCon.attr('data-slider-step') % 1 === 0) ? parseInt(v_thisCon.attr('data-slider-step')) : parseFloat(v_thisCon.attr('data-slider-step'));                          
				noUiSlider.create(aSliderInfo[v_thisConID]['objSlider'], {

					start: [0],
					step: nVStep,					 
					connect: "lower",
					animate: false,  
					range: {
						'min': parseInt(v_thisCon.attr('data-slider-min')),
						'max': parseInt(v_thisCon.attr('data-slider-max'))
					}

				});				

				 

				aSliderInfo[v_thisConID]['objSlider'].noUiSlider.on('update', function( values, handle ){					 
					
					v_type      = 'range';
					objSliderId = $(this)[0].target.id; 
					objOutput   = (v_thisCon.parent('div').find('output').length > 0) ? $('#' + objSliderId).parent('div').prev('output') : $('#' + objSliderId).parent('div').prev('.outputdiv');
					objTInput   = objSliderId.replace(/nObjSlider-/g, ''); 
					objInput    = $('#' + objTInput);  

					sTrFilter   = values[handle];
					sTrFilter   = sTrFilter.replace('.00', '');   
					sTrFilter   = ( sTrFilter % 1 === 0 ) ? parseInt( sTrFilter ) : parseFloat( sTrFilter );
															                    		 	              
					objInput.val  ( sTrFilter );  	 
					objOutput.val( sTrFilter ); 
					base.processAction(objTInput, v_type, objInput.attr('data-object-model'));

				}); 		
						 
 
			});		
			
			
			//For editable div 
			if(v_thisCon.parent('div').find('output').length == 0){
				 
				var aIVar = Array();
				if( base.detectmob() ) {
					
					aIVar['min']  = 48; 
					aIVar['max']  = 57;
					aIVar['bspc'] = 8;
					aIVar['rar']  = -1;
					aIVar['lar']  = -1;						
					aIVar['del']  = -1;
					
				} else {
					
					aIVar['min']  = 95; 
					aIVar['max']  = 105;
					aIVar['rar']  = 39;
					aIVar['lar']  = 37;
					aIVar['bspc'] = 8;
					aIVar['del']  = 46;
					
				}
				 
				 
				$('.outputdiv').on("keyup",function(e){  
				
					 
				   if((parseInt(e.keyCode) >= aIVar['min'] && parseInt(e.keyCode) <= aIVar['max']) || parseInt(e.keyCode) == aIVar['rar'] || parseInt(e.keyCode) == aIVar['lar'] || parseInt(e.keyCode) == aIVar['bspc'] || parseInt(e.keyCode) == aIVar['del']){  
												
					   val      = $(this).val();						  
					   imax     = $(this).next("div").children("input[class=obj-range]").attr('data-slider-max');
					   sliderID = $(this).next("div").children("input[class=obj-range]").attr('id');
					   sval     = '';					   

					   if(val == '' || isNaN(parseInt(val))){   $(this).empty();  }
					   else if(parseInt(val) < 0){              val  = $(this).val(0);       }
					   else if(parseInt(val) > parseInt(imax)){  $(this).val(imax); val  = parseInt($(this).val());   }
					  	
					 			 
					   if(val != '' || parseInt(val) > -1) { 
					   		 
							oSlider = document.getElementById(aSliderInfo[sliderID]['objSlider2']); 
					   	  	oSlider.noUiSlider.set( val ); 
					   
					   } else if(isNaN(parseInt(val)) || val == '<br>') {
						   
						   $(this).empty();
					   } 
					  

				   } else {

					   $(this).html(0);

				   }
				   
				   return;

				}); 

				$('.outputdiv').on("focusout",function(e){
				   val      = $(this).val();						  
				   imax     = $(this).next("div").children("input[class=obj-range]").attr('data-slider-max');
				   sliderID = $(this).next("div").children("input[class=obj-range]").attr('id');

				   if(val == '' ) {
					   $(this).val('');
					   val = 0;
				   }
				   
				   oSlider1 = document.getElementById(aSliderInfo[sliderID]['objSlider2']);  
				   oSlider1.noUiSlider.set( val );

				}); 
 
			}

 
			//For CheckBox
 			$('input[type=checkbox]').on("click", function() {
 
				if(typeof $(this).attr('data-object-model') !== 'undefined'){
 
					v_id    = $(this).attr('id');  
  					v_type  = $(this).attr('type');
 					v_model = $(this).attr('data-object-model');

 					//base.updateChangeVariables(v_model);
 
					base.processAction(v_id, v_type, v_model);
 
				}

 
			});

 			//For Radio Button

 			$('input[type=radio]').on("click", function() {

 				if(typeof $(this).attr('data-object-model') !== 'undefined'){

					v_id    = $(this).attr('id');  

					v_type  = $(this).attr('type');

					v_model = $(this).attr('data-object-model');

					//base.updateChangeVariables(v_model);

					base.processAction(v_id, v_type, v_model);

				}

				 	

			});

			//Button Submit

			$('.btn-custom-class').on("click blur dblclick mousedown mouseover", function(e) {

				v_type = e.type; 

				v_func = $(this).attr('data-action-value');	

				v_evnt = $(this).attr('data-event-value'); 

				v_fetc = $(this).attr('data-fetch-values');

				v_model = $(this).attr('data-object-model');

				if(v_type == v_evnt) { 

					if(v_func != '') eval(v_func);

					if(document.getElementById('_fetchvalues') != null && v_fetc != null) $('#_fetchvalues').val(base.fetchObjectValues(v_fetc));  

				}

			});		

			 

		

		}	 

		

		//

		base.setEmailModal = function(model){			 

			if(typeof aEmailHolder[model] === 'undefined'){

				alert('Sorry! No email fields were found.\nPlease check the package file for set  up info.');

				return '';	

			} 

			eform    = base.emailFormBody(aEmailHolder[model]); 

			ebuttons = base.emailFormButtons(aEmailHolder[model]);

			v_str = '';

			v_str += '<div class="modal fade" id="mailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">';

			v_str += '<div class="modal-dialog">';

			v_str += '<div class="modal-content">';

			v_str += ' <div class="modal-body">';

			v_str += '<div class="form-group class-header">';

			v_str += '&nbsp;	';

			v_str += '</div>';

			v_str += '<form>';			 

			v_str += eform;

			v_str += '<div class="form-group">';

			v_str += '	<input type="hidden" class="form-control" name="fetchvalues" id="_fetchvalues" value="">';

			v_str += '</div>';

			v_str += '</form>';           

			v_str += '</div>';

			v_str += ' <div class="modal-footer">';			 

			v_str += ebuttons;

			v_str += '</div>';
			
			v_str += '<div class="obj-overlay" style="display:none"><div class="plus"><img src="'+ base.pluginPath('generic/img/animated-loader-icon.gif') + '" width="32" height="32" /></div></div>';		
			
			v_str += '</div>';
			
			v_str += '</div>';

			v_str += '</div>';  

			obj.after(v_str);

		}

		

		

		//

		base.emailFormBody = function(arr){

			if(typeof arr['body'] === 'undefined'){

				alert('Sorry! No email fields were found.\nPlease check the package file for set up info.');

				return false;	

			} 

			v_str = '';			

			$.each( arr['body'], function( i, v ){	

					s_id  =  v['name'].replace('_', '-');

					v_str += '<div class="form-group">';

					v_str += '	<label for="'+s_id+'" class="control-label">';

					v_str += (v['required'] == '1') ? '	<span class="required-span">*</span>' : '';

					v_str += v['label'] + ':</label>';

					v_str += (v['type'] == 'text') ? '	<input type="text" class="form-control" name="'+v['name']+'" id="'+s_id+'" data-func="'+v['func']+'" data-required="'+v['required']+'" value="'+v['default']+'" class="obj-padding5" >' : '';

					v_str += '</div>';



			});

			return v_str;

		}

		

		//

		base.emailFormButtons = function(arr){

			if(typeof arr['buttons'] === 'undefined'){

				alert('Sorry! No email buttons were found.\nPlease check the package file for set  up info.');

				return false;	

			} 

			v_str = '';			

			$.each( arr['buttons'], function( i, v ){	

					if(v['trigger'] == 'modal-close'){

						strigger = ' class="btn btn-default" id="send_cancel" ';

					} else if(v['trigger'] == 'send'){

						strigger = ' class="btn btn-primary" id="send_msg" ';

					} else{

						strigger = '';

					}

					v_str += '<button type="button" '+ strigger +'>'+ v['label'] +'</button>';					 



			});

			return v_str;			

		}

		

		//

		base.placeCompleteURL = function(path){

			var sUrlHeader = window.location.protocol;
			var sDomain    = window.location.hostname;
			return (path.indexOf(sDomain) == -1) ? sUrlHeader + '//' + sDomain + '/' + path : path;

		}

		

		//

		base.emailAction = function(m){

			if(document.getElementById('mailModal') == null) base.setEmailModal(m);			 

			$('.modal').modal('show');
			
			$('#send_cancel').on('click', function(){
				$('.modal').modal('hide').detach();
			});

			$('#send_msg').on('click', function(e){

                var oJSON, v_return = '';
				v_total = 0;

				v_null  = 0;

				v_error = 0;

				e.preventDefault();	
				 
				 
				$('.form-group').each(function(){

					v_cur  = $(this).children('input');

					v_type = v_cur.attr('type');

					v_func = v_cur.attr('data-func');									

					v_req  = v_cur.attr('data-required');				

					if(v_type == 'text'){

						if(v_req == 1){

						 

							if(base.isNull(v_cur)){

								
								v_null++; 
								base.seterror(v_cur, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is required');

							

							} else if(v_func != '') {

								

								v_rfunc = v_func.replace('x', '$(this).children(\'input[type=text]\')');

								v_ret   = eval(v_rfunc);

								

								if(!v_ret){

									base.seterror(v_cur, 'Please enter valid values');

									v_error++;

								}

								

							}

							

						} else if(v_func != ''){

							

							v_rfunc = v_func.replace('x', '$(this).children(\'input[type=text]\')');

							v_ret   = eval(v_rfunc);

							

							if(!v_ret){

								base.seterror(v_cur, 'Please enter valid values');

								v_error++;

							}

							

						}

						v_total++;

					}

				});			
				 
				 
				if(v_error == 0 && v_null == 0){

					v_vals = "";
					o_vals = {};

					$('.form-group').each(function(){

						v_cur   = $(this).children('input');

						if(typeof v_cur.attr('name') !== 'undefined'){							

							v_name  = v_cur.attr('name');						

							//if(v_vals != "") v_vals += '&';
							//v_vals += v_name  + "=" + v_cur.val();
							o_vals[v_name] = v_cur.val();

						}

							

					});					
					
									 
					v_page   = base.placeCompleteURL(config.pluginpath) + 'php/comEmail.php' ; //+ v_vals 					
					v_return = '';					 
					
					$('.obj-overlay').show(); 
					oJSON = $.getJSON(v_page, o_vals).done(function (data){
						
						v_return = data;
												
						if(v_return != 'EMAIL SENT'){						
										
							window.setTimeout(function() {
								
									 $('.obj-overlay').hide(); //.remove();									  
									 
							}, 200);											
	
							$(".class-header").html('<div class="red">An error had occurred. Please try again.</div>');							
							window.setTimeout(function() {
	
								 $(".class-header").children(".red").hide().remove();
								 $(".class-header").html('&nbsp;');
	
							}, 3000);
							
										
	
						} else {		
	
							
							window.setTimeout(function() {
								 $('.obj-overlay').hide(); //.remove();
							}, 200); 								 
	 
							$(".class-header").html('<div class="green">Thank you. Your quote is on the way.</div>');
							window.setTimeout(function() {
	
								$(".class-header").children(".green").hide().remove();
								$(".class-header").html('&nbsp;');
								$('.form-group').each(function(){
	
									v_cur   = $(this).children('input');
									v_cur.val('');									
	
								});
	
								$('.modal').modal('hide').detach();
	
							}, 2000);					 
	
						} 
					});									 
					
 
				} 

			});

			$('input[type=text]').on('click', function(){

					if($(this).hasClass('obj-error')) base.removerror($(this));					 

			});

		}

		

		//

		base.getAdditionalDiv = function(details){

			 v_str = '';

			 $.each( details, function( i, v ){

				 v_label    = (typeof v['label'] !== null) ? v['label'] : '';

				 v_labelids = (typeof v['idnames'] !== null) ? v['idnames'] : '';

				 

				 if(v_labelids != ''){

					 

					 v_explode = v_labelids.split('|');

					 for(i = 0; i < v_explode.length; i++){

						 v_replaceObject = '<label id="'+ v_explode[i] +'" class="flow-text-label">&nbsp;</label>';

						 v_label = v_label.replace('{object' + i + '}', v_replaceObject);

					 }

					 

					 v_str = v_label;

					 

				 } else {

					 v_str += v_label;

				 }

				 

			 });

			 return v_str;

		}
	
		//
		base.displayTimer = function(msg){
			
			 var dTimer = new Date();
			 
			 console.log(msg);				
			 console.log( dTimer.getHours() + ' hr(s) : ' + dTimer.getMinutes()+ ' min(s) : ' + dTimer.getSeconds() + ' sec(s) '); 
			
		}
		

		//

		base.isEmail = function(v_obj){

			//testing regular expression

			var a = v_obj.val(); 

			var filter = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  //[a-z_.A-Z_.0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z]{2,4}

			//if it's valid email
			if(!filter.test(a)){								 

				return false;

			} else {						

				return true;

			}

		}

		

		//

		base.isNull = function(v_obj){

			var r = v_obj.val();

			r   = r.replace(/\s/g,'');

			if(r.length <= 0){					 

				return true;

			} else{		

				return false;		

			}

		}

		

		//

		base.isPhone = function(v_obj){ 

			var r = v_obj.val();   

			var ValidChars = "0123456789-()+ ";

			var ValidChars1 = "0123456789";

			var blnResult = true;

			var Char;		

			var telnum = 0;

			var ep = r.replace(/\s+$/, '');

			var re = /\D+/g;

			var cleanphone = r.replace(re,"");

			var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

			cleanphone = cleanphone.replace(" ","");

			cleanphone = cleanphone.replace(/[+-\/]/,""); 	 			 

			if(regex.test(r)){ 

				blnResult = true;  

			} else if(base.isNumber(cleanphone) && (cleanphone.length > 6 || cleanphone.length <= 14)){

				 

				blnResult = true;   

			} else {			   

		

			   blnResult = false;

			}

			return blnResult;

		}

		

		//

		base.isNumber = function(str){

			var ValidChars = "0123456789";	

			var sSplit     = str.split("");		 

			for(var i = 0; i < sSplit.length; i++){

				if(ValidChars.indexOf(sSplit[i]) == -1){

					return false;

				}

			}

			return true;

		}

		

		//

		base.seterror = function(v_obj, v_text){

			v_obj.addClass('obj-error');   

			if(v_obj.next('.obj-errspan').length == 0) v_obj.after('<span class="obj-errspan">'+ v_text +'</span>');

		}

		

		//

		base.removerror = function(v_obj){

			v_obj.removeClass('obj-error');

			v_obj.next('.obj-errspan').remove(); 			

		}

		

		//

		base.whatTooltipType = function(v_type, v_text, v_id, v_Index){

			if(v_type == 'hover'){

				return base.createTooltipHover(v_text);

			} else if(v_type == 'popup') {

				return base.createPopUpTooltip(v_id, v_Index, v_text);				

			} else {

				alert('Invalid tool tip value found.');

				return false;

			}			

		}

		

		

		//

		base.createTooltipHover = function(v_text){

			v_toolhover = (v_text != '') ? '&nbsp;<span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="' + v_text + '"></span>' : '&nbsp;'; //<span class="glyphicon glyphicon-question-sign"></span>

			return v_toolhover;	
		}

		

		//

		base.createPopUpTooltip = function(v_id, v_index, v_text){

			v_poptool = '';

			if(v_text != ''){ 

				v_poptool +=  '&nbsp;<a class="md-trigger" data-modal="modal-'+v_id+v_index+'"><span class="glyphicon glyphicon-info-sign"></span></a>'; 

				if(typeof aPopTooltxt[v_id] === 'undefined') aPopTooltxt[v_id] = [];				

				aPopTooltxt[v_id][v_index] = v_text;

			} else  v_poptool +=  '&nbsp;';  

			return v_poptool;

		}

		

		//

		base.createDivPopHolder = function(v_arr, v_id){

			v_popholder = '';

			if(v_arr.length <= 0) return v_popholder;

			for(var key in v_arr){

				if(sSkipWords.indexOf(key) == -1){ 

					v_popholder += '<div class="md-modal md-effect-1" id="modal-'+v_id+key+'">';

					v_popholder += '<div class="md-content">';

					v_popholder += v_arr[key];

					v_popholder += '</div>';

					v_popholder += '</div>';

				}

			}

			return v_popholder;

		}

		

		//

		base.setDivPopHolder = function(){

			v_strr = ''; 			

			if(aPopTooltxt.length > -1){

				for(var key in aPopTooltxt){

										 

					if(sSkipWords.indexOf(key) == -1){ 

						if(aPopTooltxt[key].length > -1) v_strr += base.createDivPopHolder(aPopTooltxt[key], key);

					}

				}				

				if(v_strr != '') return '<div>' + v_strr + '<div class="md-overlay"></div></div>';	 		 

			}

			return '';

		}

		

		//

		base.moveOptionDiv = function(e){

			v_objTarget = $(e).attr('data-target');

			v_objType   = $(e).attr('data-action-type');

			v_objHTML   = $(e).html();			

			$('#'+ v_objTarget).collapse('toggle');

			v_objModel  = v_objTarget.split('-');

			v_objProp   = base.getAllData(v_objType);

			v_objLabel1 = v_objProp['label'];  

			v_objLabel2 = v_objProp['label2'];				

			 		

			if(v_objHTML == v_objLabel1) $(e).html(v_objLabel2);

			else $(e).html(v_objLabel1); 

			

		} 

		

		//

		base.objCounterInsideSlider = function (object, lookup){

				v_ctr = 0;

				if(typeof object !== 'object' || object != '') return v_ctr;

				$.each( object, function( i, v ){

					if(typeof v[lookup] !== 'undefined' && v[lookup] === 'Yes') v_ctr++;

				});

				return v_ctr;

				

		}
		//
		base.detectmob = function () { 
			 if( navigator.userAgent.match(/Android/i)
			 || navigator.userAgent.match(/webOS/i)
			 || navigator.userAgent.match(/iPhone/i)
			 || navigator.userAgent.match(/iPad/i)
			 || navigator.userAgent.match(/iPod/i)
			 || navigator.userAgent.match(/BlackBerry/i)
			 || navigator.userAgent.match(/Windows Phone/i)
			 ){
				return true;
			  }
			 else {
				return false;
			  }
	     }

		//Initiate
		return base.each( function() {
			base.init();
		});

	}
	
})(jQuery, document);