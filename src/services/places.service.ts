import { Place } from "../models/place.model";
import { Location } from "../models/location.model";

import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file";
import { Injectable } from "@angular/core";

declare var cordova: any;

@Injectable()
export class PlacesService {
    private places: Place[] = [];

    constructor(private storage: Storage, private file: File) { }

    addPlace(title: string, description: string, location: Location, dataUrl: string) {
        const place = new Place(title, description, location, dataUrl);
        this.places.push(place);
        this.storage.set('places', this.places)
            .then()
            .catch((err) => {
                this.places.splice(this.places.indexOf(place), 1);
            });
    }

    loadPlaces() {
        return this.places.slice();
    }

    fetchPlaces() {
        this.storage.get('places')
            .then((places: Place[]) => {
                this.places = places != null ? places : [];
            }).catch((err) => {
                console.log(err);
            });
    }

    deletePlace(index: number) {
        const place = this.places[index];
        this.places.splice(index, 1);
        this.storage.set('places', this.places)
            .then(() => {
                this.removeFile(place);
            }).catch(err => console.log(err));


    }

    private removeFile(place: Place) {
        const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
        this.file.removeFile(cordova.file.dataDirectory, currentName)
            .then()
            .catch(() => {
                console.log('Error while removing file');
                this.addPlace(place.title, place.description, place.location, place.imageUrl);
            });
    }
}