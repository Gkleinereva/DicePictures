import { Injectable } from '@angular/core';

import{ImageData} from './classes';

@Injectable({
	providedIn: 'root'
})
export class PictureDataService {

	imageData: ImageData;

	constructor() { }

	SaveImageData(reader: FileReader, file: any) {
		this.imageData = new ImageData;
		this.imageData.fileName = file.name;
		this.imageData.fileType = file.type;
		this.imageData.value = String(reader.result);
		console.log(file);
		console.log(reader.result);
	}
}
