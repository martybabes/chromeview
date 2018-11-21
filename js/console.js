var showAllImg = document.getElementById("id-showAllImg");
var textarea = document.getElementById("id-textarea");
var notearea = document.getElementById("id-notearea");
var notefile = document.getElementById("id-notefile");
var progeditarea = document.getElementById("id-progeditarea");
var classtext = document.getElementById("id-classtext");
var progfile = document.getElementById("id-progfile");
var autocomplete = document.getElementById("id-autocomplete");
var mediaMp3 = document.getElementById("id-mp3src");
var audioPlayer =  document.getElementById("id-audioplayer");
var selbgfile = document.getElementById("id-selbgfile");
var timesbody = document.querySelector("#id-timesbody");
var timesorder = document.querySelector("#id-timesorder");
var viewplaypos = document.querySelector("#id-playpos");
var consolescreen = document.getElementById("id-consolescreen");
var myscreen = document.getElementById("id-myscreen");
//document.documentElement.style.overflow='scroll';
var theme = "green";
var widescreen = true;
var fontwidthClass = "fontXnormal";
var fontheightClass = "fontYnormal";
var fontfaceClass = "normal";
var textClass = "txtwhite";
var splashFN = "splash";
var backgndFN = "#";
var bgClass = "bgblack";
var plainTI = false;
var progcount = 0;
var progpos = -1;
var gonextitem = false;
var showtitleinf = false;


var selectors = ["bgblack","midcenter","","txtcenter","txtwhite","fontYnormal","fontXnormal","#"];
//var edstylenote = true; // for font size changing

$.extend({ alert: function (message, title) {
  $("<div></div>").dialog( {
    buttons: { "Ok": function () { $(this).dialog("close"); } },
    close: function (event, ui) { $(this).remove(); },
    resizable: false,
    title: title,
    modal: true
  }).text(message);
}
});

// window initialisation
window.addEventListener('load', function() {
  //jQuery UI apply css rules
  $( "#id-accordion" ).accordion({ collapsible: true });
//  $( "#id-consoleaccordion" ).accordion({ heightStyle: "content" });
  $( "#id-seltabs" ).tabs();
  $( "#id-prevtabs" ).tabs();

//  $( "#id-choose_dir" ).button();
//  $( "#id-showlist" ).button();
//  $( "#id-showsplashscr" ).button();
//  $( "#id-showblankscr" ).button();
//  $( "#id-showselectedsong" ).button();

  $( "#id-themecolor" ).button();
  $( "#id-fontheight" ).button();
  $( "#id-fontwidth" ).button();
  $( "#id-fontface" ).button();
  $( "#id-savesettings" ).button();

  $( "#id-addselectedsong").button();
  $( "#id-addsplash").button();
  $( "#id-addblank").button();
  $( "#id-choose_image").button();
  $( "#id-choose_video").button();

  $( "#id-updateprog").button();
  $( "#id-canceledit").button();
  $( "#id-title").addClass("title" + theme);
  $( "#id-info").addClass("info" + theme);
  setClassText();
//  $( "#id-showconsole" ).button();
//  $("#id-shownotepad").button();
  consoleResize();
});
window.addEventListener("resize", consoleResize);
function consoleResize() {

  // var maxh = window.innerHeight - 190;
  // var maxw = window.innerWidth - 480;
  // ratio 9/16 = h = w*.45
  // maxh = maxw *  9 / 16; // viewratio;
  // 3:4 = 9:12 = 75% of 16
  var w = document.getElementsByTagName("article")[0].clientWidth - 20; // exclude 20px padding
  if ( widescreen === false ) { w = w * 0.75 }
  //  consolescreen.style.width = "75%";// exclude 20px padding
  //}else{
    consolescreen.style.width = w + "px";
  //}    
//  consolescreen.style.height = Math.floor(maxh) + "px";
//  consolescreen.style.width = Math.floor(maxw) + "px";
  chrome.app.window.get("viewAudienceWin").contentWindow.onScrAspect(widescreen);
}

$("#id-prgreset").click(function() { 
  progpos = -1;
  document.getElementById("id-progitem").innerText = progpos + 1;
});
$("#id-btnfonttags").click(function() { $("#id-fonttags").toggle(800); });
$("#id-btnbuilder").click(function() { $("#id-builder").toggle(800); });
$("#id-btnsettings").click(function() { $("#id-settings").toggle(800); });
//$("#id-btnclosesettings").click(function() { $("#id-settings").toggle(800); });
$("#id-savesettings" ).click(function() {
  $("#id-settings").toggle(800); 

    var settings = {
      'theme' :  theme, 
      'splash':  splashFN,
      'widescreen': widescreen,
      'fontwidth': fontwidthClass,
      'fontheight': fontheightClass,
      'fontface': fontfacetype,
      'textcolor': textClass,
      'bgcolor' :  bgClass,
      'backgnd' :  backgndFN,
      'plainTI' :  plainTI,
      'T' : $("#id-showtitle").prop("checked"),
      'K' : $("#id-karaoke").prop("checked"),
      'I' : $("#id-immediate").prop("checked")
    };
    chrome.storage.local.set({"settings" : settings}, function() {
          // Notify that we saved.
          console.info('Settings saved');
    });      
});
$("#id-showconsole").click(function(event) {  $("#id-consolescreen").toggle(); });
$("#id-shownotepad").click(function(event) {  $("#id-editor").toggle(); });
$("#id-fontheight").click(function(event) { 
  var s = event.target.id;
  if (s.length > 0) { fontheightClass = s.substr(3); }
});
$("#id-fontwidth").click(function(event) {
    var s = event.target.id;
  if (s.length > 0) {
    fontwidthClass = s.substr(3); 
    widescreen = (fontwidthClass === "fontXnormal");
    consoleResize();
  }
});
$("#id-fontface").click(function(event) { 
  var s = event.target.id; //Roboto, Nunito
    if (s.length > 0) {
       fontfacetype = s.substr(3); 
       if (fontwidthClass !== "fontXsmall") {
          fontwidthClass = "fontX" + fontfacetype;
      }
    }
});

/*$("#id-foreback" ).click(function(event) {
  var s = event.target.id;
  if (s === "whiteonblack") {
    bgClass = "bgblack";
    textClass = "txtwhite";
  }else{
    bgClass = "bgwhite";
    textClass = "txtblack";
  }
  setTitleInfo();
});*/

$( "#id-themecolor" ).click(function(event) {
  var s = event.target.id;
  if (s === "id-themegreen") {
    theme = "green";
  }else{
    theme = "blue";
  }
  setTheme();
  setTitleInfo();
});  
function setTheme() {
	document.getElementById('id-theme').setAttribute('href', 'resources/jquery-ui-' + theme + '.css');
}
$( "#id-plainti" ).change(function(event) {
  plainTI = $(this).prop('checked');
  setTitleInfo();
});
function setTitleInfo() {
  if (plainTI) {
    document.getElementById("id-title").className = "tiplain title";
    document.getElementById("id-info").className = "tiplain info";
  }else{
    document.getElementById("id-title").className = "title" + theme;
    document.getElementById("id-info" ).className = "info" + theme;
  }
}

$("#id-edratio").click(function(event) {
  var s = event.target.id.substr(3);
  if (s.length === 0 || s === "edratio") { return; }
  //edstylenote = (s === "edtext");
  notearea.className = s;
  //if (!edstylenote) {
  if (s !== "edtext") {
    $(notearea).addClass(function() {
      return document.querySelector('input[name="edsize"]:checked').id.substr(3);
    });
  }
});

$("#id-edsize").click(function(event) {
  var s = event.target.id.substr(3);
  if (s.length === 0 || s === "edsize") { return; }
  var id = document.querySelector('input[name="edratio"]:checked').id.substr(3);
  if (id === "edtext") { return; }
    notearea.className = id + " " + s;
});


$("#id-karaoke").click(function(event) {
  if (!$("#id-karaoke").prop("checked")) { $("#id-immediate").prop("checked",false); } 
});
$("#id-immediate").click(function(event) {
  if ($("#id-immediate").prop("checked")) { $("#id-karaoke").prop("checked",true); } 
});
$("#id-showlist").click(function() {
  var elem = document.getElementById("id-seltabs");
  if (elem.style.display === "none") {
      elem.style.display = "inline";
  }else{
      elem.style.display = "none";
  }  
});

$("#id-editprog").click(function(event) {
  var prg = []; 
  var s = "";
  //prg.push(s);
  $("#id-progblock").hide();
  $("#id-progbody td").each(function(index) {
    if (index % 2 === 0) {
      s ="item:" + $(this).text() + ":"; 
    }else{
      s += $(this).text();
      prg.push(s);
    }
  });
  s = "";
  prg.forEach(function(item, index) {
    //console.log(item);
    s += item + "\n";
  });
  progeditarea.value = s;
  $("#id-progeditblock").show();
});

$("#id-updateprog").click(function() {
  $("#id-progeditblock").hide();
  $("#id-progbody").empty();
  progcount = 0;
  progpos = -1;
  var sarr = progeditarea.value.split("\n");
  sarr.forEach(function(item, index) {
    if (item !== "" & item.substr(0,5) === "item:") {
      var s = item.split(":");
      addSongItem(s[1], s[2]);
    }
  });
  $("#id-progblock").show();
});

$("#id-canceledit").click(function() {
  $("#id-progeditblock").hide();
  $("#id-progblock").show();
});

$( autocomplete ).on('click', function(e, ui) { autocomplete.value = ""; });
$( autocomplete ).autocomplete({
  source: function( request, response ) {
    var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
    response( $.grep( tags, function( item ){
    return matcher.test( item );
    }) );
  },
  close: function( event, ui ) {
    // var f = autocomplete.value;
    // var d = findSongDir(f);
    // addSongItem(getMode(), f);
    // $( "#id-prevtabs" ).tabs( "option", "active", 0 );
    //openSelectedSong(d,f);
  }
});

$("#id-choose_video").click(function() { chooseFile("vid"); });
$("#id-choose_image").click(function() { chooseFile("img"); });
function chooseFile(type) {  
  chrome.fileSystem.chooseEntry({type: 'openFile'}, function(theEntry) {
    if (!theEntry) {
      output.textContent = 'No file selected.';
      return;
    }
    chrome.fileSystem.getDisplayPath(theEntry, function(path){
      console.log(path);
      var pix = path.indexOf(rootPath);
      if (pix < 0) { 
        $("#id-img_error").text("File must be in a directory under settings path");
        return;
      }
      $("#id-img_error").text("");
      var n = path.substr(rootPath.length + 1).replace(/\\/g,"/");
      switch(type) {
        case "splash":
          splashFN = n;
          showSplashScreen();
          break;
        case "cibg":
          selbgfile.value = n;
          selectors[7] = n;
          break;
        case "bg":
          backgndFN = n;
          var fdiv = createTestFGBG();
          bgClass = "bgimage";
          fdiv.className = bgClass + " midcenter ";
          getImageData(backgndFN, fdiv.style, function() {
            showBGTestScreen(fdiv);
          });
          break;
        default:
          addSongItem(type, n);
      }
    });
  });
}

$("#id-btnupdate").on('click', function() { 
  setClassText();
  showTestScreen();
});
function showTestScreen() {
  var fdiv = document.createElement('DIV');
  fdiv.id = "id-sd1";
  fdiv.className = selectors[0] + " " + selectors[1];
  var fp = document.createElement('P');// place all text into span element and wrap in a div
  fp.id = "id-ss1";
  fp.className = selectors[2] + " " + selectors[3] + " " 
        + selectors[4] + " " + selectors[5] + " " + selectors[6];
  var txt = document.getElementById("id-testnotearea").value;
  fp.innerHTML = txt.replace(/\n/g,"<br>");
  fdiv.appendChild(fp);

	if (selectors[7] !== "#") { 	// get the file URL Data
  	getImageBGURL(selectors[7], fdiv.style);
  }
  var dest = myscreen;
  $(dest).empty();// innerHTML = "";
  dest.appendChild(fdiv);
}

$("#id-addsplash").click(function() { addSongItem("spl", "Splash screen"); });
$("#id-addblank").click(function() { addSongItem("blk", "Blank screen"); });

$("#id-selbgcolor").change(function(e) { 
  selectors[0] = event.target.value;
  if (selectors[0] === "bgtile"  || selectors[0] === "bgimage") {
    selectors[7] = selbgfile.value;
  }else{  
    selectors[7] = "#";
  } setClassText(); showTestScreen(); });
$("#id-seltxtpos").change(function(e) { 
  selectors[1] = event.target.value; setClassText(); showTestScreen(); });
$("#id-selwidth").change(function(e) { 
  selectors[2] = event.target.value; setClassText(); showTestScreen(); });
$("#id-seltxtlayout").change(function(e) { 
  selectors[3] = event.target.value; setClassText(); showTestScreen(); });
$("#id-seltxtcolor").change(function(e) { 
  selectors[4] = event.target.value; setClassText(); showTestScreen(); });
$("#id-seltxtsize").change(function(e) { 
  selectors[5] = event.target.value; setClassText(); showTestScreen(); });
$("#id-seltxtface").change(function(e) { 
  selectors[6] = event.target.value; setClassText(); showTestScreen(); });
//$("#id-selbgimage").click(function(e) { 
//  selectors[7] = event.target.value; setClassText(); showTestScreen(); });
$(selbgfile).click(function(e) { chooseFile("cibg"); });
$(selbgfile).change(function(e) {
  if (selbgfile.value === '') {
    selectors[7] = "#";
  }else{
    selectors[7] = selbgfile.value;
  }
  setClassText(); showTestScreen();
});  


function setClassText() {
  classtext.value = "CI:" + selectors[0] + " " + selectors[1] + ","
        + selectors[2] + " " + selectors[3] + " " + selectors[4] + " "
        + selectors[5] + " " + selectors[6] + "," + selectors[7];
}

document.getElementById("id-choose_dir").addEventListener('click', function(e) {
  chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(theEntry) {
    if (!theEntry) {
      output.textContent = 'No Directory selected.';
      return;
    }
    // use local storage to retain access to this directory
    chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
    
    loadDirEntry(theEntry);
  });
});

function getMode(song) {
  var md = $("#id-showtitle").prop("checked") ? "T" : "_";
  var k = $("#id-karaoke").prop("checked") && (mediaFiles.indexOf(song) >= 0);
  md +=  k ? "K" : "_";
  md += $("#id-immediate").prop("checked") ? "I" : "_";
  return md;
}
// list selection event
function selectSong(event) {
  var id = event.target.parentElement.id;
  id = id.substr(-1);
  var d = document.querySelector('#id-tab-' + id).innerText;
  var f = event.target.innerText;
  autocomplete.value = f;

//  addSongItem(getMode(f), f);
//  $( "#id-prevtabs" ).tabs( "option", "active", 0 );
  //openSelectedSong(d, f);
}

showAllImg.addEventListener('click', function(e) {
  showall = !showall;
  if ( showall ) {
      showAllImg.src = "resources/xfiletxt.png";
    } else {
      showAllImg.src = "resources/xfileplay.png";
    }
    loadDirEntry(rootPathEntry);
});

$("#id-updatetimesresult").click(function(e) {
  //var inp = $("#id-timestable input");
  var dat = $("#id-timestable td");
  var p = "PLAY:";
  for (var i = 0; i < scrtimes.length; i++ ){
    p += dat[i*3].firstChild.value + "s" + dat[i*3 + 1].innerText + "#"; 
  }
  document.getElementById("id-timesresult").value = p;
});

$("#id-edittimings").on('click', editTimings);
function editTimings() { 
  var elm = $("#id-timesresblock");
  elm.toggle();
//   if (elm.css("display") === "none") {
//     $(".settime").css("visibility","hidden");
//     $("#id-timestable input").prop("disabled","disabled");
//   }else{
//     $("#id-timestable input").prop("disabled","");
//     $(".settime").css("visibility","visible");
//     $(timesorder).prop("value", scrviews);
//   }
}

$("#id-timesorderupdate").click(function(e) {
  var tov =  $(timesorder).prop("value");
  if ( tov.length > 0 ) { 
    var ix; var i;
    if (scrtimes.length > tov.length ) {
       ix = scrtimes.length - tov.length;
      for ( i = 0; i < ix; i++) { scrtimes.pop(); }
    }
    if (scrtimes.length < tov.length ) {
       ix = tov.length - scrtimes.length;
      for ( i = 0; i < ix; i++) { scrtimes.push(999); }
    }
    $(timesorder).parent().hide();
    $(timesorder).prop("value", tov);
    $(timesbody).empty();
    scrviews =  tov;
    thesong.setTimesTable();
    editTimings();    
  }
});
//---------------------------------------
function viewScreen(scr) {
  if (scr === "id-sd0") { showBlankScreen();
    return;
  }
  
  var destwin = null;
  var elem = document.getElementById(scr);
  
  if (elem !== null) {
    var cln = elem.cloneNode(true);
    destwin = myscreen;
    $(destwin).empty(); //innerHTML = "";
    destwin.appendChild(cln);

    destwin = chrome.app.window.get("viewAudienceWin");
    cln = elem.cloneNode(true);
    var fx = (thesong.getFX(scr.slice(2))); // was (3)
    if  (fx !== "#") {
//      destwin.contentWindow.onScrFade();
//      $(scr).css("display","none");
    }
    destwin = destwin.contentWindow.document.body;
    $(destwin).empty(); //innerHTML = "";
    destwin.appendChild(cln);
//    if (FX) { eval(fxshow[scr.slice(3)]); }
  }
}

$("#id-titleinfo, #id-ptd1, #id-ptd2, #id-ptd3, #id-ptd4, #id-ptd5, #id-ptd6, #id-ptd7, #id-ptd8, #id-ptd9").on('click', function(event) { 
    var tid = event.target.id;
    var parent= event.target.parentElement;
    // barrel up the chain - 3 levels 
    if (tid === "") { tid = parent.id }
    if (tid === "") { tid = parent.parentElement.id }
    if (tid === 'id-title' || tid === 'id-info') { tid = 'id-titleinfo';
    } else { tid = "id-sd" + tid.substr(-1,1);
    }
    viewScreen(tid);
});

$("#id-titleinfo, #id-showtitleinfo").on('click', showTitleInfo);
function showTitleInfo() { 
  var destwin = null;
  
  var elem = document.getElementById("id-titleinfo");
  cln = elem.cloneNode(true);
  destwin = chrome.app.window.get("viewAudienceWin").contentWindow.document.body;
  $(destwin).empty(); //innerHTML = "";
  //destwin.contentWindow.document.body.appendChild(cln);
  destwin.appendChild(cln);

  //var cln = elem.cloneNode(true);
  var scr = document.createElement('DIV');
  scr.id = "id-screen";
  scr.innerHTML = elem.innerHTML;
  destwin = myscreen;
  $(destwin).empty(); //innerHTML = "";
  destwin.appendChild(scr);
}
$( "#id-splashimage").change(function(e) { // image selector
  var f = e.target.value;
  if (f === "choose") {
    chooseFile("splash"); // callback includes showSplashScreen()
  }else{
    splashFN = f; // "splash"
    showSplashScreen();
  }
});

function createTestFGBG () {
  var fdiv = document.createElement('DIV');
  fdiv.id = "id-slide";
  fdiv.className = bgClass + " midcenter ";
  var fp = document.createElement('P');
  fp.id = "stest";
  fdiv.appendChild(fp);
  fp.className = fontheightClass + " " + fontwidthClass + " " + textClass + " txtcenter"; // includes color padding and align
  fp.innerHTML = "Test default background/foreground";
  return fdiv;
}
function showBGTestScreen (fdiv) {
  var dest = myscreen;
  $(dest).empty();// innerHTML = "";

  if (backgndFN !== "#") {
    getImageData(backgndFN, fdiv.style, function() {
      myscreen.appendChild(fdiv);
    });    
  }else {
    dest.appendChild(fdiv);
  }  
}

$("#id-backgroundimage" ).change(function(e) {
  var f = e.target.value;
  if (f === "choose") {
    chooseFile("bg");   // bgClass = "bgimage"; //backgndFN = chosen file
                        // fdiv.className = bgClass + " midcenter ";
  }else{
    var fdiv = createTestFGBG();
    bgClass = event.target.value;
    fdiv.className = bgClass + " midcenter ";
    backgndFN = "#";
    showBGTestScreen(fdiv);
  } 
});
$("#id-lyricscolour" ).change(function(event) {
  textClass = event.target.value;
  var fdiv = createTestFGBG();
  showBGTestScreen(fdiv);
});

$( "#id-showblankscr").on('click', showBlankScreen );
function showBlankScreen () {
  var destwin = chrome.app.window.get("viewAudienceWin").contentWindow;
  destwin.onScrBlank();
  $(myscreen).empty();
  //document.getElementById("id-consolescreen").innerHTML = "";
  var scr = document.createElement('DIV');
  scr.id = "id-screen";
  scr.className = "blank";
  myscreen.appendChild(scr);
}

$( "#id-showsplashscr").on('click', showSplashScreen );
function showSplashScreen () { 
    showSlideScreen (splashFN);
}
function showSlideScreen (fn) {
  var destwin = null;
  var fdiv = document.createElement('DIV');
  fdiv.id = "id-slide";
  fdiv.className = "bgimage";
  if (fn ==="splash") {
    fdiv.style.backgroundImage = "url('splash.jpg')";
    showLoadedSlide(fdiv);
  }else{  
    getImageData(fn, fdiv.style,
    function() { showLoadedSlide(fdiv); }
    );
    // getImageBGURL(fn, fdiv.style);
    // showLoadedSlide(fdiv);
  }
}

function showLoadedSlide(fdiv) { // show when loaded
  var cln = fdiv.cloneNode(true);
  destwin = myscreen;
  $(destwin).empty(); //innerHTML = "";
  destwin.appendChild(cln);

  destwin = chrome.app.window.get("viewAudienceWin").contentWindow.document.body;
  cln = fdiv.cloneNode(true);
  $(destwin).empty(); //innerHTML = "";
  destwin.appendChild(cln);
}
function showVideo (fn) {
  //<video width="400" controls>
  //<source src="mov_bbb.mp4" type="video/mp4">
  //</video>
  var destwin = null;
  destwin = chrome.app.window.get("viewAudienceWin").contentWindow.document.body;
  $(destwin).empty(); //innerHTML = "";
  var fragment = document.createDocumentFragment();
  var vid = document.createElement('VIDEO');
  vid.setAttribute("width","100%");
  vid.setAttribute("preload","metadata");
  vid.setAttribute("controls","true");
//  vid.autoplay = true;
  vid.setAttribute("src", "#");
  fragment.appendChild(vid);
  destwin.appendChild(fragment);
  getVideoURL(fn, vid, function() { /*vid.play();*/ });
}

//---------------------------------------
function showPlayPos () {
  viewplaypos.value = audioPlayer.currentTime.toFixed(1);
}
$( "#id-play" ).on( 'click', function() {
  var T = " ";
  if ($("#id-showtitle").prop("checked")) { T = "T"; } 
    playsong(T);
});
function playsong(Tmode) {
	if (audioPlayer.currentTime === 0) {
	 // if (songmode.substr(0,1)==="T")
	 var ti = (Tmode === "T") ? showTitleInfo(): viewScreen('id-sd0');
	}
	audioPlayer.play();
	timerId = setInterval(timerHandler, 100);
	var destwin = chrome.app.window.get("viewAudienceWin");
	destwin.focus();

}
$( "#id-pause" ).on( 'click', function ( event ) {
	audioPlayer.pause();
	clearTimeout(timerId);
}); 
$( "#id-tostart" ).on( 'click', function ( event ) {
	audioPlayer.pause();
	currentscreen = 0;
	scrtimespos = 0;
  viewScreen("sd0");
	audioPlayer.currentTime = 0;
}); 
$( "#id-forward" ).on( 'click', function ( event ) {
	var tm = audioPlayer.currentTime;
	audioPlayer.currentTime = tm + 10;
});
function ttClick(e) {
  var elem = e.target;
  if (elem.nodeName == "SPAN") {
    if (viewplaypos.value !== "") {
      elem.parentNode.firstChild.value = viewplaypos.value;
      var ix = Number(elem.parentNode.parentElement.id.substr(-2));
      scrtimes[ix] = viewplaypos.value; // eq audioPlayer.currentTime
    }
  }else{
    elem = e.target.parentElement;
    if (elem.id.length > 2) {
      scrtimespos = Number(elem.id.substr(-2));
      audioPlayer.currentTime = scrtimes[scrtimespos];
    }
  }
}

function timerHandler() {
	var tm = audioPlayer.currentTime;
	//var ts = tm.toFixed(1);
	if ( audioPlayer.ended ) {
		clearTimeout(timerId);
		if (gonextitem) {
		  doNextItem(0);
    }else{ showSplashScreen(); }
    $( "#id-prevtabs" ).tabs( "option", "active", 0 );
	}else{
		if (scrtimes.length > scrtimespos) {
   		showPlayPos();
			if ((scrtimes[scrtimespos] > 0) && (tm >= scrtimes[scrtimespos])){
				var oldscreen = currentscreen;
		   		currentscreen = scrviews.charAt(scrtimespos);		
		   		scrtimespos++;
		   		viewScreen("id-sd" + currentscreen);
//		   		screenToggleFX(oldscreen)
		   	}
		}
	}
}
// need per screen
/* !CS: colorstyleclass  #id-colorstyle# */
function createColorStyleClass (cname, fore, back) {
  // add a new style to the dom
  var style = document.createElement("style");
  style.type = "style/css";
  style.innerHTML = "." + cname 
        + " {color: " + fore 
        + "; background-color: " + back 
        + "; text-shadow: -1px -1px 0 " + back + ", 1px -1px 0 " + back + ", -1px 1px 0 " + back + ", 1px 1px 0 " + back + ";}";

  document.getElementByTagName("head")[0].appendChild(style);
}
function createBGImageStyleClass (cname, imgurl) {
  // add a new style to the dom
  var style = document.createElement("style");
  style.type = "style/css";
  //style.innerHTML = "." + cname 
  //      + " {background-image: ('" + imgurl + "') }";
  //getImageBGURL(imgurl, fdiv);
  document.getElementByTagName("head")[0].appendChild(style);
}
//---------------------------------------
function playReadyHandler () {
  if (songready === 2) {
    clearInterval(timerId);
    playsong(songmode.substr(0,1)); 
  }
}
$( "#id-showselectedsong" ).on( 'click', function ( event ) {
  gonextitem = false;
  var sng = autocomplete.value;
  var d = findSongDir(sng);
  showtitleinf = true;
  openSelectedSong(d,sng);
  $( "#id-prevtabs" ).tabs( "option", "active", 0 );

	scrorderpos = 0; // restart screen ordeer if manual song
  //songready = 0; // must wait for files to load
  $( "#id-prevtabs" ).tabs( "option", "active", 1 );
  if  ( $("#id-immediate").prop("checked")===true ) {
    if ( mp3found ) { timerId = setInterval(playReadyHandler, 20); } // waits for song to load
  }
});  

$( "#id-addselectedsong" ).on( 'click', function ( event ) {
  s = autocomplete.value;
  if (s !== "") {  addSongItem(getMode(s), s); 
  }else{
    $.alert("Select a song to add to the list.", "Select a song"); 
  }
});

$( "#id-nextitem" ).on( 'click', doNextItem );
function doNextItem(event) {
	progpos += 1; // next item
	if (progpos >= progcount) {
	  showSplashScreen();
	  return;
	}
  var elem = document.getElementById("id-prg" + progpos);
  gonextitem = true;
  doPrgItem(elem);
}

$( "#id-nextscr" ).on( 'click', function ( event ) {
  //var scrorder/scrorderpos
  if ($("#id-showtitle").prop("checked") && showtitleinf === true) {
    showtitleinf = false;
    showTitleInfo();
  }else{
    if (scrorderpos < scrorder.length) {
      var scr = "id-sd" + scrorder.charAt(scrorderpos);
      viewScreen(scr);  
      var s = scrorder.substr(0,scrorderpos) + "<b>" + scrorder.charAt(scrorderpos)
        + "</b>" + scrorder.substr(scrorderpos+1);
      $("#id-screenorder>span").html(s);
      scrorderpos++;
    }else{
       scrorderpos = 0; 
       showBlankScreen();
    }
  }
}); 

function ptClick(e) {
  var elem =  e.target.parentElement;
  progpos = Number(elem.id.substr(6));
  doPrgItem(elem);
}
function doPrgItem(elem) {
  document.getElementById("id-progitem").innerText = progpos + 1;
  var cn = elem.childNodes;
  songmode = cn[0].innerText;
  var sng = cn[1].innerText;

  if (songmode==="img") {
    showSlideScreen(sng);
    return;
  }

  if (songmode==="vid") {
    showVideo(sng);
    return;
  }
  
  if (songmode==="blk") {
    showBlankScreen();
    return;
  }
  if (songmode==="spl") {
    showSplashScreen();
    return;
  }
  // default
  console.log(sng);
  if (songmode.charAt(0)==="T") {
    showtitleinf = true; }else{ showtitleinf = false;
  }
  var d = findSongDir(sng);
  openSelectedSong(d,sng);
  $( "#id-prevtabs" ).tabs( "option", "active", 1 );
  if (songmode.substr(1,2) === "KI") {
    timerId = setInterval(playReadyHandler, 20); // waits for song to load
  }
}

function addSongItem(mode, sname) {
    var fragment = document.createDocumentFragment();
    var tr = document.createElement('tr');
    tr.id = "id-prg" + progcount;
    progcount += 1;
    var td1 = document.createElement('td');
    td1.innerHTML = mode;
    var td2 = document.createElement('td');
    td2.innerHTML = sname;

    tr.appendChild(td1);
    tr.appendChild(td2);
    fragment.appendChild(tr);
    tr.addEventListener('click', ptClick);
  
    document.querySelector("#id-progbody").appendChild(fragment);
}

progfile.addEventListener('change', function(e) {
  var file = progfile.files[0];
	var textType = /text.*/;

	if (file.type.match(textType)) {
		var reader = new FileReader();

		reader.onload = function(e) {
		  progeditarea.value = reader.result;
	  };

		reader.readAsText(file);	
	}else{
		progeditarea.value = "File not supported!";
	}
});  

function openSelectedSong(dir, sname) {
  if (dir === "" || sname === "") { return; }
	scrorderpos = 0; // restart screen ordeer if manual song
  songready = 0; // must wait for files to load
  // dir will be empty if invalid song
  getMediaSRC(sname);

  rootPathEntry.getFile(dir + "/" + sname + ".txt", {create: false},
  function(fileEntry) {  // function  is a callback with selected file fileEntry
    if (!fileEntry) { console.log("User did not choose a file");
      return;
    }
    document.getElementById("id-seltabs").style.display = "none";

    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        textarea.value = this.result;
      //  console.log(e.target.result);
        thesong.scrSetupSong();
        thesong.setTimesTable();
      };
      
      reader.readAsText(file);
    }, errorHandler);
  }, errorHandler);
}

notefile.addEventListener('change', function(e) {
  var file = notefile.files[0];
	var textType = /text.*/;

	if (file.type.match(textType)) {
		var reader = new FileReader();

		reader.onload = function(e) {
		  notearea.value = reader.result;
	  };

		reader.readAsText(file);	
	}else{
		notearea.value = "File not supported!";
	}
});  


/***************************************************************************************/

/*chrome.fileBrowserHandler.onExecute.addListener(function(id, details) {
  if (id == 'upload') {
    var fileEntries = details.entries;
    for (var i = 0, entry; entry = fileEntries[i]; ++i) {
      entry.file(function(file) {
      // send file somewhere
      });
    }
  }
});
*/