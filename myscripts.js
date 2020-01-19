var cctvinformation = [];

function initMap(){
  //variable for options to be utilized for google maps api
  var options = {
    zoom:7,
    center:{lat:38.5449,lng:-121.7405}
  }

  //creates new instance of a google maps object
  var map = new google.maps.Map(document.getElementById('map'), options);

  var cameras = [];

  var incident = {
    center:{lat:38.544907, lng:-121.740517},
    timeStamp:1579068995,
    description:"Black Sedan, Asian American, Headed up I-##",
  }

  //Using Jquery to load the .xml file pass the xml data into the success callback functions
  $.ajax({
    type: "Get",
    async: true,
    url: "cctvinfo.xml",
    dataType: "xml",
    //Upon successful Get request of data execute the following function
    success:function(xml){
      var x = xml.documentElement.getElementsByTagName("cctv");
      for (var i = 0; i < x.length; i++) {
        var latTemp = x[i].getElementsByTagName("latitude")[0].childNodes[0].nodeValue;
        var longTemp = x[i].getElementsByTagName("longitude")[0].childNodes[0].nodeValue;
        var contentTemp = x[i].getElementsByTagName("nearbyPlace")[0].childNodes[0].nodeValue;
        var county = x[i].getElementsByTagName("county")[0].childNodes[0].nodeValue;
        // pushes data into the cameras array
        cameras.push(
          {
            coords:{lat: parseFloat(latTemp), lng: parseFloat(longTemp)},

            content:
            x[i].getElementsByTagName("nearbyPlace")[0].childNodes[0].nodeValue +
            "<br>" + x[i].getElementsByTagName("locationName")[0].childNodes[0].nodeValue
            +"<br> Longitude: " + x[i].getElementsByTagName("longitude")[0].childNodes[0].nodeValue
            +"<br> Latitude: " + x[i].getElementsByTagName("latitude")[0].childNodes[0].nodeValue +
            "<br> County: " + x[i].getElementsByTagName("county")[0].childNodes[0].nodeValue,
          }
        )
      }
      //requests for all the camera objects in cameras array
      for(var i = 0;i < cameras.length;i++){
        addNewMarker(cameras[i]);
      }

      //Draws circles around the searchable area for the cameras
      for(var i=0; i< cameras.length; i++){
        var cameraCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: cameras[i].coords,
          radius: 200
        })
      }

      DrawCircleAroundIncident(incident);
      //Draws circle around the incedent and grows overtime
      function DrawCircleAroundIncident(incidentObject)
      {
        var incidentCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: incident.center,
          radius: getRadius(incident),
        })
        console.log(incident.center);
      }
      console.log(getRadius(incident));

      //Function for determining the size of the search radius
      function getRadius(incedentOccurrence){
        timeOccurrence = incedentOccurrence.timeStamp;
        console.log(timeOccurrence);
        var d = new Date();
        var currentTime = d.getTime();
        deltaTime = currentTime - timeOccurrence;
        console.log(deltaTime);
        searchRadius = deltaTime * 0.00000008;
        //above number not chosen by random, based off of unix time standard
        console.log("Search Radius: " + searchRadius);
        return searchRadius;
      }

      //adds generic camera marker to objects in the camera array
      function addNewMarker(props){
        var image = {
          url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(15, 15),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };

        //creates a new marker instance
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map,
          icon:image
        });
        //sets the icon image
        if(props.iconImage){
          marker.setIcon(props.iconImage);
        };
        //sets the content of the pin
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click',function(){
            infoWindow.open(map, marker);
          });

        };
      }
    }
  })


  //iterates through the potential markers in the table
  for(var i = 0;i < markers.length;i++){
    addMarker(markers[i]);
  }

  //Sets up the content for the marker
  function addMarker(props){
    //creates a new marker instance
    var marker = new google.maps.Marker({
      position:props.coords,
      map:map,
    });
    //sets the icon image
    if(props.iconImage){
      marker.setIcon(props.iconImage);
    };
    //sets the content of the pin
    if(props.content){

      var infoWindow = new google.maps.InfoWindow({
        content:props.content
      });


      marker.addListener('click',function(){
        infoWindow.open(map, marker);
      });

    };
  }
}

/*
===========OLD CODE=================
//Temp COORDS for debugging/testing

var markers = [
  {
    coords:{lat:39.42002,lng:-123.80779},
    content:'<h1>Fort Bragg</h1> <br> <h2>SR-20 : At SR-1 - Looking East (C020)</h2>'
  },
  {
    coords:{lat:39.40581,lng:-123.36904},
    content:'<h1>Fort Bragg</h1> <br> <h2>SR-20 : At SR-1 - Looking North (C020)</h2>'
  },
];
*/
