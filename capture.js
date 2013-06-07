    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 
 
    // Wait for PhoneGap to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);
 
    // PhoneGap is ready to be used!
    function onDeviceReady() 
    { 
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
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
      var date=""
      var d = new Date();
      date=""+d.getDate()+"-"+ (d.getMonth()+1) +"-"+d.getFullYear();
      alert(date);
      // Get image handle
      console.log(JSON.stringify(imageData));
      // Get image handle
      var smallImage = document.getElementById('smallImage');
      // Unhide image elements
      smallImage.style.display = 'block';
      // Show the captured photo ,The inline CSS rules are used to resize the image
      smallImage.src = imageData;
      alert("Location of picture:" + imageData);
      //create a directoy
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, null); 

      function onRequestFileSystemSuccess(fileSystem)
      { 
        alert('Nom Du Syteme de Fichier:    '+fileSystem.name);
        alert('Nom De la Racine du Syteme de Fichier:    '+fileSystem.root);
        var entry=fileSystem.root; 
        entry.getDirectory("monFichier", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail); 
      } 
        
      function onGetDirectorySuccess(dir)
      { 
          // convert the String imageData to a FileEntry
         var fileEntry= new FileEntry(imageData.substring(imageData.lastIndexOf('/')+1),imageData);
         alert("Created dir "+dir.name+ "Resultat de substring: "+imageData.substring(imageData.lastIndexOf('/')+1));
         console.log("Created dir "+dir.name); 
         fileEntry.copyTo(dir,"file_copy",successCallback,failCallback);
         
         //call back functions
        function successCallback(entry) {
            console.log("New Path: " + entry.fullPath);
            alert("New Path of the new File: " + entry.fullPath);
        }
        
        function failCallback(error) {
            alert("Dommage! Copie echouee"+error.code);
        }
      } 

      function onGetDirectoryFail(error) 
      {
        alert("Error creating directory "+error.code);
        console.log("Error creating directory "+error.code); 
      } 
    }
 
    // Called when a photo is successfully retrieved (DATA_URI) from Library oder Album not from Camera
    function onPhotoURISuccess(imageURI) 
    {
      // Uncomment to view the image file URI 
      //console.log(imageURI);
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
    function onFail(message) {
      alert('Failed because: ' + message);
    }
 
