function initGallery(galElId, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay, thumbLayout) {

	var imageList = getImageList(galElId + "_thumbs", galWidth, galHeight, browsingControls);
	
	var hasCaption = false;
	if(imageList != null){
	   for (var j=0; j<imageList.length; j++){
	      if (imageList[j][6] && imageList[j][6].length>0){
		     hasCaption = true;
			 break;
		  }
	   }
	}
	
	
	var height = galHeight;
	var heightWithCaptionPanel = galHeight;
	var heightOfNavPanel =35;
	var heightOfCaptionPanel = this.calculateCaptionPanelHeight(25, thumbLayout, galHeight);;
	
	
	//The controls are shown all the time we want gallery to be bigger and display controls at bottom of pic
	if (browsingControls || hasCaption){
		height = galHeight + heightOfNavPanel + Math.floor(galHeight/25);
		heightWithCaptionPanel = galHeight + heightOfNavPanel + heightOfCaptionPanel + Math.floor(galHeight/25);
	}
	
	var myGallery = new simpleGallery({
		wrapperid: galElId + "_gallery", //ID of main gallery container,
		galWidth: galWidth, //width/height of gallery in pixels. Should reflect dimensions of the images exactly
		imagearray: imageList,
		relpath: relPath,	
		bgcolor: bgColor,
		fontfamily: capFont,
		fontcolor: capColor,
		showControls : browsingControls,
		showGallery: showGallery,				
		autoplay: [autoplay, slideshowDelay, 200], //[auto_play_boolean, delay_btw_slide_millisec, cycles_before_stopping_int]
		persist: false, //remember last viewed slide and recall within same session?
		calcCaptionPanelHeight: heightOfCaptionPanel,
		fadeduration: 500, //transition duration (milliseconds)
		oninit:function(){ //event that fires when gallery has initialized/ ready to run
			//Keyword "this": references current gallery instance (ie: try this.navigate("play/pause"))
		},
		onslide:function(curslide, i){ //event that fires after each slide is shown
			//Keyword "this": references current gallery instance
			//curslide: returns DOM reference to current slide's DIV (ie: try alert(curslide.innerHTML)
			//i: integer reflecting current image within collection being shown (0=1st image, 1=2nd etc)
		}
	});

	return myGallery;
}

function calculateCaptionPanelHeight(defaultHeightOfCaptionPanel, thumbLayout, galHeight){
	    
	    var calcHeightOfCaptionPanel = defaultHeightOfCaptionPanel;
	    
	    if(thumbLayout == null){
	       thumbLayout = "";
	    }
		
		if(thumbLayout == 'landscape'){
	       //bump up the height to avoid overlap with captions.
	       if(galHeight > 400){
	          calcHeightOfCaptionPanel += 75;
	       }
	       else{
	          calcHeightOfCaptionPanel += 35;
	       }
	    }
	    else if(thumbLayout == 'square' && galHeight > 525){
	       //bump up the height to avoid overlap with captions.
	       calcHeightOfCaptionPanel += 65;
	    }
	    
	    return calcHeightOfCaptionPanel
}

function getImageList(elemId, galWidth, galHeight , browsingControls){
	var imgArray = $('#' + elemId).find('img');
	var paramArray = new Array(imgArray.length);
	
	imgArray.each(function(i){

		//[widht, height, html attribute]
		var fittedDimension = getFittedDimension(this.attributes['orig_width'].value,this.attributes['orig_height'].value,galWidth,galHeight);
		
		paramArray[i] = [	this.attributes['source_path'].value,
		                 	fittedDimension[0],
							fittedDimension[1],
							this.attributes['title'].value,
							fittedDimension[2],
							"margin:10px 0px;",
							this.attributes['caption'].value];
							
	});
	return paramArray;
}

/**
 * fit the images to the widht and height column.
 * return an array with the selected [width, height and html attribute for the <img> tag. 
 * */
function getFittedDimension(width, height, galWidth, galHeight){
		width = parseInt(width);
		height = parseInt(height);

		var response = [width, height, ""];

		if((height > 0) && (galHeight > 0)){
			if((width < galWidth) && (height < galHeight)){
				response = [width, height, ' width="' + width + 'px"'];

			}else if((width/height) > (galWidth/galHeight)){ //image width ratio is larger
				///width --> galWidth
				///height --> x
				response = [galWidth, Math.floor( (galWidth * height) / width) , ' width="' + galWidth + 'px"'];

			}else{  //height ratio is larger
				///height --> galHeight
				///width  --> x
				response = [Math.floor( (galHeight * width) /  height), galHeight, ' height="' + galHeight + 'px"'];
			}
		}
		return response;
}

function getTopOffset(width, height, galWidth, galHeight, browsingControls){
		var offSet;
		var marginValue = 0;
		if((height > 0) && (galHeight > 0)){
			if((width < galWidth) && (height < galHeight)){
				marginValue= Math.floor((galHeight-height)/2 ) ;
			}else if((width/height) > (galWidth/galHeight)){ //image width ratio is larger... determine ratio to shrink height and pad
				marginValue= Math.floor((galHeight-((galWidth/width)*height))/2) ;
			}
		}
		//If browisng control shown all the time we want image to appear below the desc panel in gallery
		
		if (browsingControls){
			marginValue = Math.floor(marginValue + (galHeight/25));
			}
		
		marginValue = marginValue/4; //reduce the blank space
		marginValue = Math.floor(marginValue);
		offSet= "margin:" + marginValue + "px 0px;";
		return offSet;
}
	
function getThumbWidth(galleryWidth, thumbnailsPerRow) {
	var iWidthCalc = galleryWidth / thumbnailsPerRow;
	iWidthCalc = iWidthCalc - 8; /*margin right + margin left*/
	return iWidthCalc;
}

$(window).bind("load", function() {
	//get all albums
	$(".wb_element_pa").each(function(i){
		var thumbLayout = this.attributes['thumblayout'].value;
		var heightFactor = 0;
		switch(thumbLayout){
			case "square":  //Slideshow with Thumbs
				heightFactor = 1;
				break;
			case "landscape":
				heightFactor = 0.75;
				break;
			case "portrait":
				heightFactor = 1.5;
				break;
			default:
				heightFactor = 0.75;
		}
		
		var albumElId = this.id;
		var galWidth = this.offsetWidth;
		var galHeight = Math.floor(heightFactor * galWidth);

	 	var relPath = this.attributes['relative_file_path'].value;
		var bgColor = this.attributes['bg_color'].value;
		var capColor = this.attributes['text_color'].value;
		var capFont = this.attributes['text_font_family'].value;
		
		var thumbnailsPerRow = 1;
		var sThumbsPerRow = this.attributes['thumbnails_per_row'];
		if(sThumbsPerRow && !isNaN(sThumbsPerRow.value)){
		   thumbnailsPerRow = parseFloat(sThumbsPerRow.value);
		}

		var thumbWidth = getThumbWidth((galWidth + 5), thumbnailsPerRow);
		
		
		var thumbHeight = Math.floor(heightFactor * thumbWidth);
		var thumbRatio = thumbWidth/thumbHeight;		
		var autoplay = this.attributes['autoplay'].value;
		//Make sure that old photo album which doesnot have the autoplay and slideshow attributes work as before
		if (autoplay !==""){
			if (autoplay ==='true'){
				autoplay=true;
			}else{
				autoplay=false;
			}
		}else{
			// default is start album in play mode
			autoplay=true;
		}
		
		var browsingControls =this.attributes['browsing_controls'].value;
		if (browsingControls !==""){
			if (browsingControls ==='true'){
				browsingControls=true;
			}else{
				browsingControls=false;
			}
		}else{
			//deafult is not show all the time
			browsingControls=false;
		}	
		
		var slideshowDelay = this.attributes['slideshow_delay'].value;
		if (slideshowDelay === ''){
			slideshowDelay = 4500
		}
				
		var albumId = this.id;
		var thumbDivId = albumId + '_thumbs'; 
		
		//prepare some variables to use in the loop
		var captionHeight = thumbHeight/2;
		if(captionHeight < 60){
		   //allow for maximum caption length
		   captionHeight = 60;
		}
		
		var captionFontSize = Math.floor(thumbWidth/8);
		if(captionFontSize > 12){
		   captionFontSize = 12;
		} 
		
		var thumbInterSpace = galWidth - (thumbWidth * thumbnailsPerRow);
		thumbInterSpace = thumbInterSpace / (thumbnailsPerRow * 2 );
		
		thumbInterSpace = Math.floor(thumbInterSpace);
	
		$('#' + thumbDivId + ' div').each(function(i) {
	      if(this.className == 'wb_element_paThumbBlock'){
		            $(this).height(thumbHeight);  
		            /*$(this).css('backgroundColor', bgColor);*/
		      }else if(this.className == 'wb_element_paThumbContainer'){
		            $(this).css("margin", '2px ' +  thumbInterSpace + 'px');
		            $(this).css('width', thumbWidth + 'px');

		      }else if(this.className == 'wb_element_paThumbRowSpacer'){
		            $(this).height(5);
		      }else{ //caption div
		            $(this).height(captionHeight);    
		            $(this).css('font-size', captionFontSize + 'px'); 
		            $(this).css('font-family', capFont);                                      
		      }

			});   

				
		switch(this.attributes['album_type'].value){
			case "1":  //Slideshow with Thumbs
 				var showGallery = true;
				var myGallery = initGallery(this.id, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay, thumbLayout);
				myGallery.start();
								
				$('#' + thumbDivId + ' img').each(function(i) {		
					$(this).css("cursor", "pointer");
					
					var imgRatio = this.attributes['thumb_width'].value/this.attributes['thumb_height'].value;

					if ((this.attributes['thumb_width'].value < thumbWidth) && (this.attributes['thumb_height'].value < thumbHeight)){ //image already fits... middle align

						$(this).width(this.attributes['thumb_width'].value + 'px');
						$(this).height(this.attributes['thumb_height'].value + 'px');
						 $(this).css("margin", Math.floor((thumbHeight - this.height)/2) + 'px 0px');
						

					} else if(imgRatio > thumbRatio){ //image width ratio is larger

						$(this).width(thumbWidth);
						$(this).height(Math.floor(thumbWidth / imgRatio));
						 $(this).css("margin", Math.floor((thumbHeight - this.height)/2) + 'px 0px');

																							
					}else{

						$(this).width(Math.floor(imgRatio * thumbHeight));
						$(this).height(thumbHeight);
					}	
										
					$(this).click(function(){
						myGallery.navigate(i);
					});
				});
				break;
 
			case "2":  //Slideshow Only
				var showGallery = true;
				var myGallery = initGallery(this.id, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay, thumbLayout);
				myGallery.start();
				break;

			case "3":  //Thumbs Only
				var showGallery = false;
				
				var myGallery = initGallery(this.id, galWidth, galHeight, relPath, bgColor, capColor, capFont,showGallery, autoplay, browsingControls, slideshowDelay, thumbLayout);
				myGallery.start();
				
				$('#' + thumbDivId + ' img').each(function(i) {
					$(this).css("cursor", "pointer");

					var imgRatio = this.attributes['thumb_width'].value/this.attributes['thumb_height'].value;

					if ((this.attributes['thumb_width'].value < thumbWidth) && (this.attributes['thumb_height'].value < thumbHeight)){ //image already fits... middle align			

						$(this).width(this.attributes['thumb_width'].value + 'px');
						$(this).height(this.attributes['thumb_height'].value + 'px');
						$(this).css("margin-top", Math.floor((thumbHeight - this.height)/2));
						
					} else if(imgRatio > thumbRatio){ //image width ratio is larger
						$(this).width(thumbWidth);
						$(this).height(Math.floor(thumbWidth / imgRatio));
						$(this).css("margin-top", Math.floor((thumbHeight - this.height)/2));
																							
					}else{
						$(this).width(Math.floor(imgRatio * thumbHeight));
						$(this).height(thumbHeight);
					}	
															
					$(this).click(function(){
						$('#' + albumId + '_galleryHolder').css("y", $('#' + thumbDivId).position().top);
						$('#' + albumId + '_galleryHolder').css("display", "block");
						myGallery.navigate(i);					
					});
				});
				break;

			default:
				alert('def');
		}
	});
});
