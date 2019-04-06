import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PictureDataService } from '../picture-data.service';
import { ImageData } from '../classes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit, AfterViewInit {

  imageData: ImageData;

  constructor(
    private pictureDataService: PictureDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.imageData = this.pictureDataService.getImageData();
    console.log(this.imageData);
    if(!this.imageData) {
      this.router.navigate(['']);
    }


  }

  ngAfterViewInit() {
    // First we gotta draw the og image on the original huge canvas
    let image = new Image();
    image.src = this.imageData.value;
    console.log(image);
    let canvas = <HTMLCanvasElement> document.getElementById('ogImg');
    let context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);
    let pixelData = context.getImageData(0, 0, this.imageData.fWidth, this.imageData.fHeight);
    /* This spits out a massive array where each entry is 
    [
      pixel 1: r
      pixel 1: g
      pixel 1: b
      pixel 1: a
      pixel 2: r
      ...
    ]
    */
    console.log(pixelData);

    let i = 0;
    while(i < pixelData.data.length) {

      i++;
    }
    // this.
  }

}
