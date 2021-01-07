import { Component, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  // Readable Address
  address: string;

  // Location coordinates
  latitude: number;
  longitude: number;
  accuracy: number;
  distance: any;
  markers: any;
  
  zoom: number;
  private geoCoder;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {
    this.markers = [];
  }

  ngOnInit(): void {
    
  }

  markerDragEnd($event: any) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  //Get current coordinates of device
  getGeolocation() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
  }

  public deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  public getDistance(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);
      var dLon = this.deg2rad(lon2-lon1); 
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
  
        this.markers.push({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          title: 'Sua Geolocalização',    
          label: 'S',
          draggable: false
        });

        this.markers.push({
          lat: -23.4672712,
          lng: -47.4288690,
          title: 'Casa do Adriano',
          label: 'A',
          draggable: false
        });
      
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
        this.zoom = 17;
        //this.getAddress(this.latitude, this.longitude);
        this.distance = this.getDistance(-23.4672712, -47.4288690, this.latitude, this.longitude);
      });
    }
  }

  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }
}