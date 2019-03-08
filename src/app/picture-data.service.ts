import { Injectable } from '@angular/core';

import {Router} from '@angular/router';

import{ImageData} from './classes';

@Injectable({
	providedIn: 'root'
})
export class PictureDataService {

	imageData: ImageData;

	constructor(
		private router: Router
	) { }

	SaveImageData(reader: FileReader, file: any) {
		this.imageData = new ImageData;
		this.imageData.fileName = file.name;
		this.imageData.fileType = file.type;
		this.imageData.value = String(reader.result);
	}

	GetImageValue() {
		if(!this.imageData) {
			this.router.navigateByUrl('/');
		}
		else {
			return(this.imageData.value);
		}
	}
}
