import { Component, OnInit } from '@angular/core';

import{Router} from '@angular/router';

import {ImageData} from '../classes';
import{PictureDataService} from '../picture-data.service';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

	imageData: ImageData;

	constructor(
		private pictureDataService: PictureDataService,
		private router: Router
	) { }

	ngOnInit() {
	}

	ImageUploaded(event) {
		let reader = new FileReader();
		if(event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.pictureDataService.SaveImageData(reader, file);
				this.InitializeOptions();
			}
		}
		return;
	}

	InitializeOptions() {
		this.router.navigate(['/options']);
	}

}
