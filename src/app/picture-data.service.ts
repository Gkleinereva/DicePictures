import { Injectable } from '@angular/core';

import {Router} from '@angular/router';

import{ImageData} from './classes';

@Injectable({
	providedIn: 'root'
})
export class PictureDataService {

	imageData: ImageData;
	diceDims: number;

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

	setImageDims(fW: number, fH: number, sW: number, sH: number): void {
		this.imageData.fWidth = fW;
		this.imageData.fHeight = fH;
		this.imageData.sWidth = sW;
		this.imageData.sHeight = sH;
	}

	setDiceDims(dim: number): void {
		this.diceDims = dim;
		this.processImage();
		this.router.navigate(['/likeOmgMyPictureIsPrettyDicey']);
	}

	// Make the big ones on an 'invisible' canvas
	// 
	// How to save canvas as an Image:
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
	processImage(): void {
		console.log(this.imageData);
	}

	getImageData(): ImageData {
		return this.imageData;
	}
}
