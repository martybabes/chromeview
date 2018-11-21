// globals
  var songmode = "___";
	var scrtimes = []; //sss.d 
	var scrviews = ""; //v  v=0-9 (99==blank change to 0)
	var scrorder = "";  // empty or 'vvvvvv' v=0-9 (0==blank)
	var scrtimespos = 0; // current timing array position being watched
	var currentscreen = 0; // current screen showing (0==blank//	$('#id-titlescr').css("display","none");
	var currentpos = 0; // position pointer for scrtimes[]
  var songready = 0;
  
(function (expsong) {
// Song setup and control variables
  var titletext = "";
  var infolines = ""; // ...<br>...etc
  var showtitleinf = false; // when manual verse change
	var songlines = [];
  
	var scrorderpos= 0;	//current pos in scrorder string (overrides going incremental order of screens)
	var versecount = 9; // number of screens
	var fxshow =  ["#","#","#","#","#","#","#","#","#","#","#","#"];
	var timerId = 0;


  expsong.scrSetupSong = function () { 
    // song loaded in hidden textarea
  	songlines = [];
  	this.clearMediaData();
  	this.clearPreviews();
  	currentscreen = 0;
    scrtimespos = 0;

  	var lyrics = textarea.value;
  	var splitexp = /\n/;
  	songlines = lyrics.split(splitexp);
    if (songlines.length <= 1) {return;}
  
  	// changePlayfile($(eid).val()); ********************
  
  	// clear previews, arrays
  	for (var i=1; i<10; i++) {
  	  var ix = "#id-ptd" + i;
  	  $(ix).empty(); //html(''); // clear the text
  	  fxshow[i] = "#";
  	}
  	scrtimes = []; scrviews = "";
  
  	if (songlines[0].slice(0,5) == "PLAY:"){
  		$("#id-titleinfo #id-title").html(songlines[1]);
  			this.setScrTimes();
  			i = 2;
  		}else{
  			$("#id-titleinfo #id-title").html(songlines[0]);
  			i = 1;
  		}
  		scrorder = "";
  		if (songlines[i].slice(0,6) == "ORDER:") {
  			scrorder = songlines[i].slice(6);
  			i++;
  		}
  		s = '';
  		// get info lines
  		var fl = true; // first line
  		while (i < songlines.length)  {
  			if (songlines[i].length > 0) {
  				if (fl) {
  					s = songlines[i];
  					fl = false;		
  				}else{
  					s = s + '<br>' + songlines[i];
  				}
  				i++;
  			}else{
  			break;
  			}
  		}
  		i++; // go past blank line 
  		$("#id-titleinfo #id-info").html(s);
  		
  		// get verses
  		versecount = 1 ;  // first preview screen
  		//outerloop:
  		while (i < songlines.length)  {
  	  	  fl = true; // first line
  		  while (i < songlines.length)  {
  			if (songlines[i].length > 0) { 
  				if (songlines[i].slice(0,3) == "FX:") {
  					// don't add this line to verse
  					fxshow[versecount] = "$('#id-sd" + versecount + "')." +  songlines[i].substr(3);
  				}else{
  					if (fl) {
  						s = songlines[i];
  						fl = false;		
  					}else{
  						s = s + '<br>' + songlines[i];
  					}
  				}
  				i++;
  			}else{
  			break; //outerloop;
  			}
  		}
  		this.copyTextToScr(s, versecount);
  	  	versecount++;
  	  	if (versecount > 9) {
  	  		break;
  	  	}
    	i++; // go past blank line
    	}
  	versecount--;
  	if (scrorder.length === 0) { scrorder = "123456789".substr(0,versecount); }
		$("#id-screenorder>span").text(scrorder);
		this.setPreviewTitles();
  	songready = 1;
  };


//------------ COPY TEXT TO SCR -------------------------------------
  expsong.copyTextToScr = function(text, scr){
  	var cmd = false;  var img = false; var music = false;
  	var s = "";
  	var sUrl = backgndFN; // "#" or filename
  	var sColor = "";
  	var scls = "";  // string class
  	var cs = "";
  	
    var fdiv = document.createElement('DIV');
      fdiv.id = "id-sd" + scr;
      
    var fp = document.createElement('P');// place all text into span element and wrap in a div
      fp.id = "id-ss" + scr;
      fdiv.appendChild(fp);
    
  	var ix = text.indexOf('<br>'); // -1 if only command line
  	if (ix == -1 ) { s = text;
  	}else{ 	s = text.substring(0, ix) ; // (no '<br>')
  	}
  	// combine classes and Image file (use '#' where no file)
  	// span font height and width classes must be included
  	// format eg. CI:divclass1 divclass2,spanclass1 spanclass2,# (note commas) 
    if (s.substr(0,3) === 'CI:') {
  	  cs = s.substr(3).split(",");
   	  fdiv.className = cs[0];
   	  fp.className = cs[1];
  	  sUrl = cs[2];
  		cmd = true;
    }
    // Loop Forever -- if filename supplied, load a media file.
    if (s.substr(0,3) === 'LF:') {
  	  getMediaSRC(s.substr(3));  	    //filename or '' or '#'
  		cmd = true;
    }
    if (s.substr(0,3) === 'TL:') {
      fdiv.className = bgClass + " midcenter ";
   	  fp.className = fontheightClass + " " + fontwidthClass + " " + textClass + " txtleft";
  		cmd = true;
    }
  	// combine color and Image file (use '#' where no file)
    // format FB:color #  (no comma -- special 'notext') 
    if (s.substr(0,3) === 'FB:') { 
  	  cs = s.substr(3).split(" "); // color imagefile
  	  fdiv.className = "bgimage midcenter";
      fp.className = fontheightClass + " " + fontwidthClass + " txtcenter"; // includes color padding and align
  	  var css = cs[0];
  	  if (css.substr(0,1) === ".") {
        fp.className += " " + (css.substr(1));
  	  }else{   
  	    if (cs[0]==="notext") {
  	      fp.style.visibility="hidden";
  	    }else{
  	      fp.style.color=cs[0];   
  	    }
  	  }
  	  sUrl = cs[1];
  		cmd = true;
  	}

    if (!cmd) { // default color centering
      fdiv.className = bgClass + " midcenter ";
      fp.className = fontheightClass + " " + fontwidthClass + " " + textClass + " txtcenter"; // includes color padding and align
  		s = text ;
    }
  	
  	if (cmd) {
  		if (ix > 0) {
  		  s = text.substring(ix + 4); // go past <br>
  		} else {
  		  s = ""; // ix=-1, no more text
  		}
  	}
  	fp.innerHTML = s;  
  
  	if (sUrl !== "#") { // || sUrl !== "") { 	// get the file URL Data
  	  getImageBGURL(sUrl, fdiv.style);
  	}
    document.querySelector("#id-ptd" + scr).appendChild(fdiv);
  	
  };
	
//---------------------------------------------------------------	



  expsong.setScrTimes = function (){ // return msec
  	var tl = [], s = [];
  	tl = songlines[0].substring(5).split('#');
  	for (var i=0; i < tl.length ; i++) {
  		s = tl[i].split('s');
  	  if (s.length > 1) {
  			scrtimes.push(Number(s[0]));
  			scrviews += String(s[1]);
  		}	
   	}
   	tl = [];
   	//alert(scrviews)
  };

  expsong.getFirstLine = function(scr) {
    var t = $("#id-ptd" + scr).text();
    return t.substr(0,30);
  };
  
  expsong.setPreviewTitles = function() {
    for (var i = 1; i <= 9; i++) {
      var s = i;
      if (i <= versecount) { s = this.getFirstLine(i); }
      document.getElementById("id-ptd" + i).setAttribute('title',s);
    }
  };
  expsong.setTimesTable = function(){
    var fragment = document.createDocumentFragment();
    for (i=0; i<scrtimes.length; i++){
      var tr = document.createElement('tr');
      tr.id = "id-tt00" + i;
      var td1 = document.createElement('td');
      //td1.id = "tt10" + i;
      td1.innerHTML = "<input type='text' class='scrtime' disabled value='" + scrtimes[i] + "'><span class='settime'>&lt;&nbsp;</span>" ;
      var td2 = document.createElement('td');
      //td2.id = "tt20" + i;
      td2.innerHTML = scrviews.charAt(i);
      var td3 = document.createElement('td');
      //td3.id = "tt30" + i;
      td3.innerHTML = this.getFirstLine(scrviews.charAt(i));
      //td3.addEventListener('click', function() {ttClick(i);});

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      fragment.appendChild(tr);
      tr.addEventListener('click', ttClick);
      }  
  
    timesbody.appendChild(fragment);
  
  };
  
  expsong.getFX = function(scr){
    return fxshow[scr];
  };
  
  expsong.clearMediaData = function(){
    $(timesbody).empty();
  //document.querySelector("#id-timesbody").innerHTML="";
    mediaMp3.src = "none";
  };
  //  testimg.style.backgroundImage = "none";
  
  expsong.clearPreviews = function(){
    for (var i = 1; i < 10; i++) {
     // document.querySelector("#id-p"+i).style.backgroundImage = "none";
      $("#id-ptd" + i).empty();
    }
  };
  

})(this.thesong = {});