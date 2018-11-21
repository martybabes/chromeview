var rootPathEntry = null;
var rootPath = "";
var showall = true;
var songDirs = [];  // keep Directory readers
var mediaDir = null;  // media directory reader
var mediaFiles = []; // get all the filenames in the directory - NO SORT
var mediaExts = []; // get all the file extensions in the directory - NO SORT
var sheetsDir = null;
var chosenEntry = null;
// song arrays for Lists and autocomplete
var songNames = []; 
var allSongNames = [];
var foundMediaType = ""; // "audio"/"video"/"" - use as for type and success flag 
var mp3found = true;
// Directory and file reader
// Taking care of the browser-specific prefixes.
//window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem; 
//window.directoryEntry = window.directoryEntry || window.webkitDirectoryEntry;

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function displayEntryData(theEntry) {
  if (theEntry.isFile) {  dirReader.getFile(f, {create: false},

    chrome.fileSystem.getDisplayPath(theEntry, function(path) {
      console.log("File: " + path);
    }));

  }else{
    chrome.fileSystem.getDisplayPath(theEntry, function(path) {
      document.querySelector('#id-rootpath').textContent = path;
      rootPath = path;
      console.log("Dir: "+ path);
    });
  }
}

// require test for audio / video 
function getMediaSRC(sgname) {
  foundMediaType = "";
  mp3found = true;
  var fname ="media/" + sgname + ".mp3"; 
  rootPathEntry.getFile(fname, {},
    function(fileEntry) {  // function  is a callback with selected file fileEntry
      if (!fileEntry) { console.log("File not found!");
        mp3found = false;
        return;
      }

    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        mediaMp3.src = this.result;
        document.querySelector("#id-audioplayer").load();
        foundMediaType="audio";
        songready = 2;
      };
      
      reader.readAsDataURL(file);
    }, errorHandler);
  }, errorHandler);
}

function getImageData(fname, elemstyle, callback) { 
  rootPathEntry.getFile(fname, {},
  function(fileEntry) { // function  is a callback with selected file fileEntry
    if (!fileEntry) { console.log("File not found!");
      return;
    }
    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        elemstyle.backgroundImage = 'url(' + this.result + ')';
        callback();  // we do a callback
      };
      reader.readAsDataURL(file);
    }, errorHandler);
  }, errorHandler);
}

function getImageBGURL(fname, elemstyle) {
  rootPathEntry.getFile(fname, {},
    function(fileEntry) {  // function  is a callback with selected file fileEntry
      if (!fileEntry) { console.log("File not found!");
        return;
      }
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
        elemstyle.backgroundImage = 'url(' + this.result + ')';
      };
      
      reader.readAsDataURL(file);
    }, errorHandler);
  }, errorHandler);
}
function getVideoURL(fname, video) {
  rootPathEntry.getFile(fname, {},
    function(fileEntry) {  // function  is a callback with selected file fileEntry
      if (!fileEntry) { console.log("File not found!");
       return;
      }
    // Get a File object representing the file
    // then use FileReader to read its contents
    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onloadend = function() {
        video.src = URL.createObjectURL(new Blob([this.result]));
        video.play();
      };
      // reader.readAsDataURL(file);
      reader.readAsArrayBuffer(file);
    }, errorHandler);
  }, errorHandler);
}

function addDirEntry (item) {
  var dismiss = ["images","media","programs","scripts","sheets","videos"];
  if ((dismiss.indexOf(item.name) < 0) && (songDirs.length < 10)) {
    songDirs.push(item);
    return;
  }
 // needed for getting media files
  if (item.name === "media") {
    mediaDir = item;
    return;
  }
}

function clearSongArrs () {
  allSongNames = [];
  for (var i=0; i < 10; i++) {
    songNames[i] = []; // reset arrays
  }
}
// tabs limited to 10 by addDirEntry
function addDirTabs () {
  //songDirs.sort();
  var tab = 0;
  songDirs.forEach(function(item) {
    document.querySelector('#id-tab-' + tab).textContent = item.name;
    tab++;
  });
}

// for directories, read the contents of the top-level directory (ignore sub-dirs)
function loadDirEntry(_chosenEntry) {
  deleteTabsLists();
  chosenEntry = _chosenEntry;
  songDirs = [];
  
  clearSongArrs ();
  
  if (chosenEntry.isDirectory) {
    rootPathEntry = chosenEntry;
    displayEntryData(chosenEntry);
    var dirReader = chosenEntry.createReader();
    var entries = [];
    
    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {

       dirReader.readEntries (function(results) {

        if (results.length) {
          entries = entries.concat(toArray(results));
          // keep reading
          readEntries();
        } else {
          entries.forEach(function(item) { 
            if  (item.isDirectory) {
              addDirEntry(item);
            }
          });
          getMediaFiles();
          console.log("mf: " + mediaFiles.length); //DO NOT sort();

          addDirTabs(); // reset 
          
          addSongLists();
          setAutoComplete();
          //setTimeout(setAutoComplete, 1000);
           $('#id-loading').hide();
          console.log("LoadDirs completed");
        }
      }, errorHandler);
    };
    readEntries(); // Start reading dirs.    
  }
}
function setAutoComplete(){
  allSongNames.sort();
  $( "#id-autocomplete" ).autocomplete({	source: allSongNames });

}

function addSongLists(){
  for (i=0; i < songDirs.length; i++) {
    getFileList(songDirs[i], i);
  }
}
function notFoundHandler () {
  console.log( "-");
  return false;
}
function foundHandler (f) {
  console.log( "+" + f.name);
  return true;
}

function getFileList(chosenEntry, tab) {
  // chosenEntry isDirectory
  var dirReader = chosenEntry.createReader();
  var entries = [];
  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
    dirReader.readEntries (function(results) {
      if (results.length) {
        entries = entries.concat(toArray(results));
        // keep reading
        readEntries();
      } else {
        entries.forEach(function(item) { 
          if  (!item.isDirectory) {
            addSong(tab, item.fullPath);
          }
        });
        songNames[tab].sort();
        addListEntries(tab);
      }
    }, errorHandler);
  };
  readEntries(); // Start reading dirs.    
}

function addSong (tab, sname) {
  if (sname.substr(-4) ===".txt") {
    songNames[tab].push(sname.substring(sname.lastIndexOf('/') + 1, sname.length - 4));
  }
}


// return "class"
function getMediaType(fname) {  //name.*
  // see if a sound file exists for this file
  var ix = mediaFiles.indexOf(fname); 

  if (ix === -1 ) { return "textonly"; }

  var ext = mediaExts[ix].toLowerCase();
  if (ext === "mp3" || ext === "ogg") {
    return "play"; 
  }else{
    return "textonly";
  }
//  if (ext === "mp4") { return "movie"; }
}

function getMediaFiles() {  //name.*
  mediaFiles = []; mediaExts = [];
  var entries = [];

  if (mediaDir === undefined) {
    console.log("No media directory");
      return; 
  }
  // Call the reader.readEntries() until no more results are returned.
  var dirReader = mediaDir.createReader();
  var readEntries = function() {

    dirReader.readEntries (function(results) {

      if (results.length) {
        entries = entries.concat(toArray(results));
        // keep reading
        readEntries();
      } else {
        entries.forEach(function(item) { 
          if  (item.isFile) {
            var names = item.name.split(".");
            mediaFiles.push(names[0]);
            if (names.length > 1) {
              mediaExts.push(names[1]);
            } else { 
              mediaExts.push("dummy");
            }
          //  console.log(names[1]);
          }
        });
      }
    }, errorHandler);
  };
  readEntries(); // Start reading dirs.    
}

function getDirItem(dname) {
  var dirItem = null;
  songDirs.forEach(function(item) {
    var f = event.target.innerText + ".txt";

    if (dname == item.name) {
    //  console.log(item.name);
      dirItem = item; 
    }
  });
  return dirItem;
}

function findSongDir(sname) {
  for (i=0; i<10; i++){

    var ix = songNames[i].indexOf(sname);
    if (ix >= 0) {
       return document.querySelector('#id-tab-' + i).innerText;
    }
  } return "";
}

function deleteTabsLists() {
  for(var id=0; id < 10; id++) {
    $('#id-tab-' + id).innerText = "";
    $('#id-table-' + id).empty();
  }   
}

function addListEntries(tab) {
//  var showall = $("#id-show_all").is(':checked');
  var arr = songNames[tab];
  // To improve performance, we create document fragments, 
  // which are appended to the DOM only once. 
  // So only one browser reflow occurs.
  var fragment = document.createDocumentFragment();

  arr.forEach(function(sname) {
    var cl = getMediaType(sname);
    // add ALL songs to Tab Lists

    if (showall || cl !== "textonly") {   
      allSongNames.push(sname);
    }
    var li = document.createElement('li');
    li.setAttribute("class", cl);
    li.innerHTML = sname;
    li.addEventListener('click', selectSong);

    fragment.appendChild(li);
  });

  document.querySelector("#id-table-" + tab).appendChild(fragment);
}

function loadInitialFile(launchData) {
//  if (launchData && launchData.items && launchData.items[0]) {
//    loadFileEntry(launchData.items[0].entry);
//  } else {
    // see if the app retained access to an earlier file or directory
  chrome.storage.local.get('chosenFile', function(items) {
    if (items.chosenFile) {
      // if an entry was retained earlier, see if it can be restored
      chrome.fileSystem.isRestorable(items.chosenFile, function(bIsRestorable) {
        // the entry is still there, load the content
        console.info("Restoring " + items.chosenFile);
        chrome.fileSystem.restoreEntry(items.chosenFile, function(chosenEntry) {
          if (chosenEntry) {
            //chosenEntry.isFile ? loadFileEntry(chosenEntry) : loadDirEntry(chosenEntry);
            rootPathEntry = chosenEntry;
            loadDirEntry(chosenEntry);
          }
        });
      });
    }
  });
  chrome.storage.local.get('settings', function(items) {
    if (items.settings) { 
      console.info("Restoring " + items.settings ); 
      var settings = items.settings;
      if (settings.theme !== undefined) { theme = settings.theme; }
      if (settings.widescreen !== undefined) { widescreen = settings.widescreen; }
      if (settings.fontwidth !== undefined) { fontwidthClass = settings.fontwidth; }
      if (settings.fontheight !== undefined) { fontheightClass = settings.fontheight; }
      if (settings.fontface !== undefined) { fontfacetype = settings.fontface; }
      if (settings.textcolor !== undefined) { textClass = settings.textcolor; }
      if (settings.splash !== undefined) { splashFN = settings.splash; }
      if (settings.bgcolor !== undefined) { bgClass = settings.bgcolor; }
      if (settings.backgnd !== undefined) { backgndFN = settings.backgnd; }
      if (settings.plainTI !== undefined) { plainTI = settings.plainTI; }
      if (settings.T !== undefined) { $("#id-showtitle").prop("checked", settings.T); }
      if (settings.K !== undefined) { $("#id-karaoke").prop("checked", settings.K); }
      if (settings.I !== undefined) { $("#id-immediate").prop("checked", settings.I); }
      
      setTheme();
      setTitleInfo();
    }
  });

  //}
}



function errorHandler(err) {
  var msg = '';
  console.log('Error: ' + err.message);
}

loadInitialFile(launchData);
