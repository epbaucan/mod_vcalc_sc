// JavaScript Document
var style   = document.createElement("style");
var aConfig = [];

// Append the style tag to head
document.head.appendChild(style); 
 
 
$(function () {
   $('[data-toggle="tooltip"]').tooltip();
  
   $(".dropdown-menu").on('click', 'li a', function(){
	  value = $(this).text();
      $(this).parent().parent().prev('.btn').html(value + '<div class="caret-holder"><span class="caret obj-fontsize24"></span></div>');
      $(this).parent().parent().prev('.btn').val(value); 
   });
   
  $('input[type=range]').on("change mousemove keypress", function() {
		$(this).prev().html($(this).val());
		updateRangeValue($(this));		
	});
	
	$.ajax({
		type: "GET",
		url: "package.xml",
		dataType: "xml",
		async: false,
		success: function(xml) {
		    $(xml).find('calculator').each(function(){
				var groups = $(this).find('calc_group');
				ctr = 0;
				groups.each(function(){
					
					var group                      = $(this);	
					aConfig[ctr]                   = [];	
					aConfig[ctr]['obj-results']    = [];
					aConfig[ctr]['obj-containers'] = [];
					aConfig[ctr]['obj-actions']    = [];
					aConfig[ctr]['obj-required']   = "";
						 
					aConfig[ctr]['name']   = group.attr('name');
					aConfig[ctr]['title']  = group.find('title').text();
					aConfig[ctr]['column'] = group.find('number_column').text();
					
					rBoxGroupCtr = 0;
					if(group.find('boxgroup').length > 0){
						 
						 rBoxGroup = group.find('boxgroup');
						 
						
						 rBoxGroup.each(function(){
							 aConfig[ctr]['obj-results'][rBoxGroupCtr]            = [];
							 aConfig[ctr]['obj-results'][rBoxGroupCtr]['id']      = rBoxGroup.find('id').text();
							 aConfig[ctr]['obj-results'][rBoxGroupCtr]['label']   = rBoxGroup.find('label').text();
							 aConfig[ctr]['obj-results'][rBoxGroupCtr]['default'] = rBoxGroup.find('default').text();						 
							 rBoxGroupCtr++;
						 
						 });
						 
					}
					
					rActionGroupCtr = 0;
					if(group.find('actions').length > 0){
						 
						 rActionGroup = group.find('actions');
						 
						 
						 rActionGroup.each(function(){					
						 	 aConfig[ctr]['obj-actions'][rActionGroupCtr]             = [];	
							 aConfig[ctr]['obj-actions'][rActionGroupCtr]['filter']   = rActionGroup.find('filter').text();
							 aConfig[ctr]['obj-actions'][rActionGroupCtr]['event']    = rActionGroup.find('event').text();
							 aConfig[ctr]['obj-actions'][rActionGroupCtr]['function'] = rActionGroup.find('function').text();
							 aConfig[ctr]['obj-actions'][rActionGroupCtr]['formula']  = rActionGroup.find('formula').text();				 
							 rActionGroupCtr++;
							 
						 });
						
					}
					
					rDataObjectGroupCtr = 0;
					if(group.find('object_values').length > 0){
						  
						 rDataObjectGroup = group.find('object_values');
						 						 
						 rDataObjectGroup.each(function(){					
						     aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]             = [];		 
							 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['type']     = rDataObjectGroup.find('type').text();
							 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['header']   = rDataObjectGroup.find('header').text();
							 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['id']       = rDataObjectGroup.find('id').text();
							 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['label']    = rDataObjectGroup.find('label').text();
							 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['default']  = rDataObjectGroup.find('default').text();
							 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['tooltip']  = rDataObjectGroup.find('tooltip').text();	
							 
							 if(rDataObjectGroup.find('required').text() == 1){
								 if(aConfig[ctr]['obj-required'] != '') aConfig[ctr]['obj-required'] += ',';
								 aConfig[ctr]['obj-required'] += aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['id'];
							 }
							 
							 
							 rDataObjectGroupCtr_1 = 0;
							 if(rDataObjectGroup.find('contents').length > 0){
								 
								 aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents']  = [];
								 
								 rDataObjectContents = rDataObjectGroup.find('contents');								 
								 rDataObjectContents.each(function(){		 
								      
									  aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]  = [];
									  switch(aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['type']){
										  case 'range':
										  		
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['min'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['max'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['step'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['value'] = '';
												break;
												
										  case 'dropdown':
										  		
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['text'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['selected'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['tooltip'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['value'] = '';
												break;
												
										  case 'checkbox':
										  		
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['text'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['checked'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['tooltip'] = '';
												aConfig[ctr]['obj-containers'][rDataObjectGroupCtr]['contents'][rDataObjectGroupCtr_1]['value'] = '';
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
  
  	 
  
});


function updateRangeValue(input){
    
	var selectedColor    = "#428bca";
    var nonSelectedColor = "#FFF";
	var idname           = input.attr('id');
    var value            = input.val();
    var maximum          = input.attr('max'); 
    var inputWidth       = input.width();
    var background       = getRangeGradient(selectedColor, nonSelectedColor, value, maximum);  
	/*var pseudocode       = getPseudoCode(); console.log(pseudocode);
	var csscode          = "#" + idname + "::" + pseudocode + "{background: " + background + "}"; console.log(csscode);
	var str = window.getComputedStyle($('.red'), '::before').getPropertyValue('content');
	
	document.styleSheets[0].addRule('.red::before','content: "' + str + str + '"');
	document.styleSheets[0].insertRule('.red::before { content: "' + str + str + '" }', 0); 	 
*/	

	 input.css('background', background);   
}

function getPseudoCode(){
	
	browsername = navigator.userAgent;  
	if(browsername.indexOf('Firefox') > -1) return "-moz-linear-gradient"; //"moz-range-track";
	else if(browsername.indexOf('MSIE') > -1) return "linear-gradient"; //"ms-track";
	else if(browsername.indexOf('Opera') > -1) return "-o-linear-gradient"; //"ms-track";
	else      return "linear-gradient"; //"webkit-slider-runnable-track";
	
}

function getRangeGradient(color1,color2,value,maximum){
    var gradient = getPseudoCode();
	gradient += "(to right, ";
    var breakPoint = (value/maximum)*100;
    
    var attrValue = gradient + color1 + " 0%, " + color1 + " " + breakPoint + "%, " + color2 + " " + breakPoint + "%, " + color2 + " 100%)";  
    return attrValue;
}