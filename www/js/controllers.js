//Data
var cities = [
              {
                  city : 'ang mo kio',
                  desc : 'ang mo kio town',
                  lat : 1.368964,
                  long : 103.846692
              },
              {
                  city : 'bishan',
                  desc : 'bishan town',
                  lat : 1.350772,
                  long : 103.848387
              },
              {
                  city : 'woodlands',
                  desc : 'woodlands town',
                  lat : 1.437995,
                  long : 103.790366
              },
              {
                  city : 'jurong',
                  desc : 'Jurong town',
                  lat : 1.332715,
                  long : 103.741747
              },
              {
                  city : 'serangoon  ',
                  desc : 'serangoon town',
                  lat : 1.351313,
                  long : 103.869136
              }
          ];

          //Angular App Module and Controller
          var sampleApp = angular.module('mapsApp', []);
          sampleApp.controller('MapCtrl', function ($scope) {

              var mapOptions = {
                  zoom: 13,
                  center: new google.maps.LatLng(1.355914,103.853873),
                  mapTypeId: google.maps.MapTypeId.TERRAIN
              }

              $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

              $scope.cities = cities;
              $scope.markers = [];
              
              var infoWindow = new google.maps.InfoWindow();
              
              var createMarker = function (info){
                  
                  /*var icon_data = {
                      url: file_url,
                      scaledSize: new google.maps.Size(30, 30),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(15, 15)
                  }*/
                  
                  var marker = new google.maps.Marker({
                      map: $scope.map,
                      // icon: icon_data,
                      position: new google.maps.LatLng(info.lat, info.long),
                      title: info.city
                  });
                  marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
                  
                  google.maps.event.addListener(marker, 'click', function(){
                      infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                      infoWindow.open($scope.map, marker);
                  });
                  
                  $scope.markers.push(marker);
                  
              }
              
              $scope.map.addListener('click', function(e) {
                  placeMarker(e.latLng, $scope.map);
                  $scope.calculateDistance(e.latLng);
              });
              
              function placeMarker(position, map) {
                var marker = new google.maps.Marker({
                    position: position,
                    map: map
                });
              }
              
              for (i = 0; i < cities.length; i++){
                  createMarker(cities[i]);
              }
              
              $scope.openInfoWindow = function(selectedMarker){
                  google.maps.event.trigger(selectedMarker, 'click');
              }
              
              $scope.calculateDistance = function(origin) {
                  var destinationList = [];
                  
                  for (city in cities) {
                    destinationList.push(new google.maps.LatLng(cities[city].lat, cities[city].long));
                  }
                  
                  var distance = {
                      origins: [origin],
                      destinations: destinationList,
                      travelMode: 'DRIVING', //'TRANSIT'
                  };
                  
                  var distanceService = new google.maps.DistanceMatrixService();
                  distanceService.getDistanceMatrix(distance, callback);
                  
                  var allDistances = [];
                  function callback(response, status) {
                      if (status == 'OK') {
                          var origins = response.originAddresses;
                          var destinations = response.destinationAddresses;
                          
                          for (var i=0; i < origins.length; i++) {
                              var results = response.rows[i].elements;
                              for (var j=0; j < results.length; j++) {
                                  var element = results[j];
                                  var distance = element.distance.value;
                                  var duration = element.distance.text;
                                  var from = origins[i];
                                  var to = destinations[j];
                                  allDistances.push({destination: to, dist: distance});
                              }
                          }
                      }
                      
                      for (var i=0; i < allDistances.length; i++) {
                          console.log(allDistances[i].destination + "   " +  allDistances[i].dist);
                      }
                  };
              }

          });