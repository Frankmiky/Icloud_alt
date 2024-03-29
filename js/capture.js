    var pictureSource;   // picture source
    var destinationType;// sets the format of returned value 
    var picturesStore; // contain all the pictures for app
    
    var menuOpen = false;
    var menuDiv = "";
    
    
    // Wait for PhoneGap to connect with the device
    function onLoad()
    {
        document.addEventListener("deviceready",onDeviceReady,false);
        //document.addEventListener("menubutton", onExit, false);
    }
    
    // PhoneGap is ready to be used!
    function onDeviceReady()
    {
        menuDiv = document.querySelector("#menu");
        document.addEventListener("online", onOnline, false);
        document.addEventListener("menubutton", onExit, false);
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        //create a directoy
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, null);
    }
     // Handle the online event
    function onOnline() 
    {
        alert("The Device is online");
    }
    function onExit()
    {
    	if(menuOpen) {
			menuDiv.style.display="none";
			menuOpen = false;
		} else {
			menuDiv.style.display="block";
			menuOpen = true;
		}
        
    }
    
    function onRequestFileSystemSuccess(fileSystem)
    { 
        var entry=fileSystem.root; 
        entry.getDirectory("iCloudStore", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);
    } 
    
    function onGetDirectorySuccess(dir)
    { 
        picturesStore = dir;
        console.log("Created dir "+dir.name);
    } 
    
    function onGetDirectoryFail(error) 
    {
        console.log("Error creating directory "+error.code); 
    }
    
    // Called when a photo is successfully retrieved DATA_URL
    function onPhotoDataSuccess(imageData)
    {
        // Get image handle
        var smallImage = document.getElementById('smallImage');
        // Unhide image elements
        smallImage.style.display = 'block';
        // Show the captured photo
        // The inline CSS rules are used to resize the image
        smallImage.src = "data:image/jpeg;base64," + imageData;
    }
    
    // Called when a photo is successfully retrieved DATA_URI
    function onPhotoFileSuccess(imageData) 
    {
        var date="";
        var d = new Date();
        date=""+d.getDate()+"-"+ (d.getMonth()+1) +"-"+d.getFullYear()+"-"+ d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds();
        // Get image handle
        console.log(JSON.stringify(imageData));
        // Get image handle
        var smallImage = document.getElementById('smallImage');
        // Unhide image elements
        smallImage.style.display = 'block';
        // Show the captured photo ,The inline CSS rules are used to resize the image
        smallImage.src = imageData;
            
        // convert the String imageData to a FileEntry
        var fileEntry = new FileEntry(imageData.substring(imageData.lastIndexOf('/')+1),imageData);        
        fileEntry.copyTo(picturesStore,date.toString()+".jpg",successCallback,failCallback);
        
        //call back functions
        function successCallback(entry) 
        {
            console.log("New Path: " + entry.fullPath);
        }
        
        function failCallback(error) 
        {
            console.log("File could not copied" + error.code);
        }
    
    }
    
    // Called when a photo is successfully retrieved (DATA_URI) from Library oder Album not from Camera
    function onPhotoURISuccess(imageURI) 
    {
        console.log(imageURI);
        // Get image handle
        var largeImage = document.getElementById('largeImage');
        // Unhide image elements
        largeImage.style.display = 'block';
        // Show the captured photo      // The inline CSS rules are used to resize the image
        largeImage.src = imageURI;
    }
    
    // A button will call this function
    function capturePhotoWithData()
    {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail,
        { quality: 75 ,
        destinationType: destinationType.DATA_URL
        });
    }
    
    function capturePhotoWithFile()
    {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail,
        { quality: 75 ,
        destinationType: destinationType.FILE_URI
        });
    }
    
    // A button will call this function
    function getPhoto(source)
    {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 75, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }
    
    // Called if something bad happens.
    function onFail(message)
    {
        console.log('Failed because: ' + message);
    }
    // Exit for the App
    function exit()
    {
       navigator.app.exitApp();
    }
    
    
