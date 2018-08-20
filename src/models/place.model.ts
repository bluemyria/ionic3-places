import { Location } from "./location.model";

export class Place {
    constructor(public title: string,
        public description: string,
        public location: Location,
        public imagePath: string) {
    }
}