var lastratio = "";
var aspect =  9/16;
var docCssRules = document.styleSheets[0].rules;
// cssRules[0,1] = body, #id-sd1
// cssRules[2,3,4,5,6,7], #id-titleinfo,#id-scradjust,#id-title,#id-info
window.onload = function () {
  var widescreen = true;
  chrome.storage.local.get('settings', function(items) {
  if (items.settings) { 
    console.info("Restoring " + items.settings ); 
    var settings = items.settings;
    if (settings.widescreen !== undefined) { widescreen = settings.widescreen; }
    }
  });
  aspect = widescreen? 9/16 : 3/4;
  // Add event listeners once the DOM has fully loaded by listening for the
  // `DOMContentLoaded` event on the document, and adding your listeners to
  // specific elements when it triggers.
  document.getElementById('id-scrdone').addEventListener('click', 
    function () { 
      setBodyMargin();
      onScrBlank();
      chrome.app.window.get("viewConsoleWin").focus();
  });
};

function onScrBlank () {
  document.body.className = "bodysong";
  $(document.body).empty(); //innerHTML = "";
  var scr = document.createElement('DIV');
  scr.className = "blank";
  document.body.appendChild(scr);
}
// function onScrDone (cls) {
//   document.body.className = "bodysong"; 
//   $(document.body).empty(); //innerHTML = "";
//   var scr = document.createElement('DIV');
//   scr.className = cls;
//   document.body.appendChild(scr);
// }
function onScrFade() {
  $("div:first").show("fade");
}
function onScrAspect(flag) {
  if (flag) { aspect = 9/16; }else{ aspect = 3/4; } 
  setBodyMargin();
}
function setBodyMargin() {
  //return; // not use it yet!!
//  var w = document.body.clientWidth; var h = document.body.clientHeight;
  var w = window.innerWidth; var h = window.innerHeight;
  var divh = h; 
  var m = 0; s = '0 0 0 0';
  if (w * aspect < h) { // need a top/bottom margin
    m = h - w * aspect;
    divh = h - m;       // height adjustment
    if (m > h * 0.03) { // only if > 3% - fint-height still compensated
      s =  ' ' + Math.floor(m/2) + 'px' + ' 0px';
    }
  }else{ // need side margins
    m = w - h / aspect;
    if (m > w * 0.04) { // only if > 4%
      s =  '0px ' + Math.floor(m/2) + 'px';
    }
  }
  $('body').css('margin', s);           //8*1.2 = 9.6
  $('html').css('font-size', Math.floor(divh / 8 ) + 'px');//10.5
  //$('html, p').css('line-height', Math.floor(divh / 8.3) + 'px');
  //docCssRules[0].style.height = divh + "px";
  //docCssRules[0].style.setProperty("font-size","20px") ?advantage???
  //docCssRules[0].style.fontSize = Math.floor(divh / 10.5) + 'px'; // 9.5vh
  //docCssRules[0].style.lineHeight = Math.floor(divh / 8.3) + 'px'; // 12 vh (8lines)
//  $('.fontYnormal').css('font-size', Math.floor(h/9) + 'px').css('line-height', Math.floor(h/8) + 'px');
}
window.onresize = function (){
  setBodyMargin();
  // var w = document.body.clientWidth; var h = document.body.clientHeight;
  // var ratio = w / h;
  // var r = findRatio(ratio);
  // if (r !== lastratio) {
  //   lastratio = r;
  //   $("#id-specs").text("window aspect ratio:" + r);
  // }
  
};
function findRatio(v) {
  var ratio = ["1:2","9:16","2:3","3:4","1:1","16:15","16:14","16:13","4:3","16:11","3:2","16:10","16:9","2:1","21:9"];
  var lohi = [ 0.47, 0.54,  0.65, 0.74, 0.9,  1.02,   1.12,   1.21,   1.31,  1.43,  1.49,  1.58,  1.74,  1.95,  2.28, 2.4];

  for (var i=0; i<ratio.length;i++){
    if (v > lohi[i] && v <= lohi[i+1]) { 
      return ratio[i];
    }
  }
  return "---?!";
}