
function launch(launchData) {
  chrome.app.window.create('console.html',
   {  frame: "chrome",
      id: "viewConsoleWin",
      outerBounds: {
        width: 1000,
        height: 700,
        left : 0,
    }
  }, 
  function(win) {
    win.contentWindow.launchData = launchData;
  });
  chrome.app.window.create('screen.html',
   {  frame: "none",
       id: "viewAudienceWin",
    outerBounds: {
      width: 800,
      height: 450,
      left : 50
    }
  });
  chrome.app.window.get("viewConsoleWin").focus();
}

chrome.app.runtime.onLaunched.addListener(launch);
//loadInitialFile(launchData);
chrome.app.window.onClosed.addListener(function () { closeAllWindows(); });


function closeAllWindows () {
  var wins = chrome.app.window.getAll();
  wins.forEach( function(win) { win.close(); 
  });
}


//$('#close').button().click(function() {
//    chrome.app.window.current().close();
//  });


/*
function viewScreen(scr) {
  var srcwin = chrome.app.window.get("viewConsoleWin");
  var destwin = chrome.app.window.get("viewAudienceWin");
  var cln = srcwin.contentWindow.document.getElementById(scr).cloneNode(true);
//  var cloneScr = cln.cloneNode(true);
//  destwin.contentWindow.document.body.innerHTML = "<div id='screen' class='songtext'>" + cln.innerHTML + "</div>";
  destwin.contentWindow.document.body.innerHTML = "<div id='screen' class='songtext'></div>";
  var destdiv = destwin.contentWindow.document.getElementById("screen").appendChild(cln);//
}

function viewSplashScreen() {
  var destwin = chrome.app.window.get("viewAudienceWin");
//  destwin.contentWindow.document.body.className = "bodysong";
  destwin.contentWindow.document.body.innerHTML = "<div id='screen' class='splash'></div>"; 
}
function viewBlankScreen() {
  var destwin = chrome.app.window.get("viewAudienceWin");
//  destwin.contentWindow.document.body.className = "bodysong";
  destwin.contentWindow.document.body.innerHTML = "<div id='screen' class='blank'></div>"; 
}
*/