import { Component, OnInit } from '@angular/core';

import{PictureDataService} from '../picture-data.service';

@Component({
	selector: 'app-options',
	templateUrl: './options.component.html',
	styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

	img: any;
	minDim: number;
	diceDim: number;
	
	constructor(
		private pictureDataService: PictureDataService
	) { }

	ngOnInit() {

		this.diceDim = 10;
		this.img = new Image();
		this.img.src = this.pictureDataService.GetImageValue();

		this.img.onload = () => {
			let canvas = <HTMLCanvasElement> document.getElementById("canvas");
			let context = canvas.getContext("2d");

			// Calculate scaled dimensions of image before we draw it
			let drawWidth, drawHeight, scaleFactor: number;
			if(this.img.width > 1000 || this.img.height > 1000) {
				if(this.img.width > this.img.height) {
					scaleFactor = this.img.width/1000.0;
					drawWidth = 1000;
					drawHeight = this.img.height/scaleFactor;
				}
				else {
					scaleFactor = this.img.height/1000.0;
					drawHeight = 1000;
					drawWidth = this.img.width/scaleFactor;
				}
			}
			// Image was small enough, no need to scale
			else {
				drawWidth = this.img.width;
				drawHeight = this.img.height;
			}
			this.minDim = Math.min(this.img.width, this.img.height);

			console.log("width: " + this.img.width + ", height: " + this.img.height);
			this.pictureDataService.setImageDims(
				this.img.width,
				this.img.height,
				drawWidth,
				drawHeight
			);
			context.drawImage(this.img, 0, 0, drawWidth, drawHeight);
		}
	}

	UpdateValue(event) {
		this.diceDim = event.target.value;
	}

	handleSubmit() {
		this.pictureDataService.setDiceDims(this.diceDim); 
	}

}
