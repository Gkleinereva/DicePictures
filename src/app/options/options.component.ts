import { Component, OnInit } from '@angular/core';

import{PictureDataService} from '../picture-data.service';

@Component({
	selector: 'app-options',
	templateUrl: './options.component.html',
	styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

	constructor(
		private pictureDataService: PictureDataService
	) { }

	ngOnInit() {
		console.log('From Service: ');
		console.log(this.pictureDataService.imageData);

		let img = new Image();
		img.src = this.pictureDataService.imageData.value;
		img.onload = () => {
			let canvas = document.getElementById("canvas");
			let context = canvas.getContext("2d");

			// Calculate scaled dimensions of image before we draw it

			console.log("width: " + img.width + ", height: " + img.height);
			context.drawImage(img, 0, 0);
			console.log("Here");
		}
	}

}
