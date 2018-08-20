import { Component } from '@angular/core';
import { Location } from '../../models/location.model';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})

export class SetLocationPage {
  location: Location;
  marker: Location;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.location = this.navParams.get('location');
    if (this.navParams.get('isSet')) {
      this.marker = this.location;
    }
  }

  onSetMarker(event: any) {
    this.marker = new Location(event.coords.lat, event.coords.lng);
    console.log(event.coords);
  }

  onConfirm() {
    this.viewCtrl.dismiss({ location: this.marker });
  }

  onAbort() {
    this.viewCtrl.dismiss();
  }

}
