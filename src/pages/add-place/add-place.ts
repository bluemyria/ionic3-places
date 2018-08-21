import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from 'ionic-angular';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location.model';

import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';

import { PlacesService } from '../../services/places.service';

// trick to inform angular var cordova is gonna be available at runtime
declare var cordova: any;

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };
  locationIsSet = false;
  imageUrl = '';

  constructor(private modalCtrl: ModalController, private geolocation: Geolocation, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private camera: Camera, private placesService: PlacesService, private file: File) { }

  onSubmit(form: NgForm) {
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.locationIsSet = false;
    this.imageUrl = '';
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, { location: this.location, isSet: this.locationIsSet });
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: "Searching for your location..."
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then((location) => {
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
        console.log(location);
        this.toastCtrl.create({ message: "You were located!", showCloseButton: true }).present();
      }).catch((error) => {
        loader.dismiss();
        console.log('Error getting location', error);
        this.toastCtrl.create({ message: "You could not be located!", showCloseButton: true }).present();
      });
  }

  onTakePhoto() {
    const camOptions: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(camOptions)
      .then((imageData) => {
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';
        this.file.moveFile(path, currentName, cordova.file.externalDataDirectory, newFileName)
          .then(
            (data: Entry) => {
              this.imageUrl = data.nativeURL;
              this.camera.cleanup();
            }).catch(
              (err: FileError) => {
                this.imageUrl = '';
                this.toastCtrl.create({ message: 'Could not save image, please try again', showCloseButton: true }).present();
                this.camera.cleanup();
              });
        this.imageUrl = imageData;
        //this.toastCtrl.create({ message: this.imageUrl, showCloseButton: true }).present();
      }).catch((err) => {
        console.log(err);
      });
  }
}
