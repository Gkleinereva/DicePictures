import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PictureDataService } from '../picture-data.service';
import { ImageData } from '../classes';
import { Router } from '@angular/router';

// https://www.npmjs.com/package/file-saver/v/1.3.2
import {saveAs} from 'file-saver'; 

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit, AfterViewInit {

  diceDims: number;
  diceType: string;
  
  imageData: ImageData;
  pixelData: Uint8ClampedArray;
  dataURI: string;

  greyScaleData: number[] = [];
  greyScaleBlockData: number[] = [];
  sortedGreyScaleBlockData: number[] = [];

  thresholds: number[] = [];

  ready: boolean = false;
  imgScaled: boolean;
  imagesLoaded: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false];

  constructor(
    private pictureDataService: PictureDataService,
    private router: Router  
  ) { }

  ngOnInit() {
    this.imageData = this.pictureDataService.getImageData();
    if(!this.imageData) {
      this.router.navigate(['']);
    }

    this.diceDims = this.pictureDataService.diceDims;
    this.diceType = this.pictureDataService.diceType;

    let i = 0;
    while(i < 12) {
      (function(i) {
        let img = document.getElementById('d' + (i + 1));
        img.onload = function() {
          this.checkImagesLoadedAndProceed(i);
        }.bind(this);
      }).bind(this)(i);
    i++;
    }


  }

  ngAfterViewInit() {
    this.initializeOriginalImage();
    this.calculateGreyScaleData();
    this.calculateBlockGreyScaleData();
    // this.calculateTwelveDiceThresholds();
    if(this.diceType === 'black' || this.diceType === 'white') {
      this.calculateDiceThresholds(6);
    }
    else {
      this.calculateDiceThresholds(12);
    }
    // this.setStaticDiceThresholds();
  }

  // Makes sure we don't try to draw the image before each dice img element is loaded
  checkImagesLoadedAndProceed(i: number) {
    this.imagesLoaded[i] = true;
    let ready = true;
    let j = 0;
    while(j < this.imagesLoaded.length) {
      if(!this.imagesLoaded[j]) {
        ready = false;
        break;
      }
      j++;
    }

    if(ready) {
      if(this.diceType === 'both') {
        this.drawImages(1, 12);
      }
      else if(this.diceType === 'white') {
        this.drawImages(1, 6)
      }
      else {
        this.drawImages(7, 12)
      }
      // this.drawTwelveImages();
      this.scaleCanvas();
    }
  }

  initializeOriginalImage() {
    // First we gotta draw the og image on the original huge canvas
    let image = new Image();
    image.src = this.imageData.value;
    let canvas = <HTMLCanvasElement> document.getElementById('ogImg');
    let context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);

    // Got to use .data to give us an actual array instead of bullshit
    this.pixelData = context.getImageData(0, 0, this.imageData.fWidth, this.imageData.fHeight).data;
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
  }

  calculateGreyScaleData() {
    // A) First we convert the image data to greyscale and store it in a separate array
    let i = 0;
    let greyVal;
    while(i < this.pixelData.length/4) {
      greyVal = Math.floor((this.pixelData[4*i] + this.pixelData[4*i + 1] + this.pixelData[4*i + 2])/3);
      this.greyScaleData.push(greyVal);
      i++;
    }
  }

  calculateBlockGreyScaleData() {
    // B) Then we calculate the average greyscale value for each 'dice chunk' and store
    // that in a separate array
    // this.greyScaleBlockData

    let pixelXIndex, pixelYIndex;

    let blockYIndex = 0;
    let blockXIndex;
    while(blockYIndex < Math.floor(this.imageData.fHeight/this.diceDims)) {
      blockXIndex = 0;
      while(blockXIndex < Math.floor(this.imageData.fWidth/this.diceDims)) {

        // Alright, so this block of code will run for each die
        let initHIndex = blockYIndex*this.diceDims;
        let initWIndex = blockXIndex*this.diceDims;

        let greySum = 0;
        pixelYIndex = 0;
        while(pixelYIndex < this.diceDims) {
          pixelXIndex = 0;
          while(pixelXIndex < this.diceDims) {

            // Runs for each pixel inside a given die
            greySum += this.greyScaleData[
              (initHIndex + pixelYIndex)*this.imageData.fWidth +
              initWIndex + pixelXIndex
            ];

            pixelXIndex++;
          }
          pixelYIndex++;
        }
        // Now, add our new value to the greyScaleBlockData array
        this.greyScaleBlockData.push(Math.floor(greySum/Math.pow(this.diceDims,2)));
        blockXIndex++;
      }
      blockYIndex++; 
    }
  }

  // Sort our array of grey scale blocks into a new array, and figure out our thresholds
  calculateDiceThresholds(numBuckets: number) {
    this.sortedGreyScaleBlockData = this.greyScaleBlockData.slice();
    this.sortedGreyScaleBlockData.sort((a, b) => {
      return (a - b);
    });

    let i = 0;
    while(i < numBuckets - 1) {
      this.thresholds.push(this.sortedGreyScaleBlockData[
        (i + 1)*Math.floor(this.sortedGreyScaleBlockData.length/numBuckets)
      ]);
      i++;
    }

    // Add the limit threshold for better looping logic in draw functions
    this.thresholds.push(256);
  }

  // Draw the right die in each spot based on threshold calculations
  // Parameters are a number 1-12
  drawImages(startDieIndex: number, endDieIndex: number) {
    let outCanvas = <HTMLCanvasElement> document.getElementById('diceImg');
    let outContext = outCanvas.getContext('2d');

    let x, y, imgId, img, j;
    let i = 0;
    while(i < this.greyScaleBlockData.length) {
      y = Math.floor(i/(Math.floor(this.imageData.fWidth/this.diceDims)))*this.diceDims;
      x = (i*this.diceDims)%(Math.floor(this.imageData.fWidth/this.diceDims)*this.diceDims);

      j = startDieIndex - 1;
      while(j < endDieIndex) {
        if(this.greyScaleBlockData[i] < this.thresholds[j - startDieIndex + 1]) {
          imgId = 'd' + (endDieIndex - j + startDieIndex - 1);
          break;
        }
        j++;
      }

      img = document.getElementById(imgId);
      outContext.drawImage(img, x, y, this.diceDims, this.diceDims);
      i++;
    }

    this.ready = true;
  }

  scaleCanvas() {
    
    // These 2 type declarations are apparently equivalent.
    let fullImageCanvas = <HTMLCanvasElement> document.getElementById('diceImg');
    let scaledImageCanvas = document.getElementById('scaledImg') as HTMLCanvasElement;
    let scaledImageContext = scaledImageCanvas.getContext('2d');

    // If we had to scale the image, scale the preview
    this.imgScaled = false;
    if(this.imageData.sWidth < this.imageData.fWidth) {
      this.imgScaled = true;
      scaledImageContext.scale(this.imageData.sWidth/this.imageData.fWidth, this.imageData.sWidth/this.imageData.fWidth);
    }

    scaledImageContext.drawImage(fullImageCanvas, 0, 0);
  }

  downloadImage() {
    let canvas = document.getElementById('diceImg') as HTMLCanvasElement;
    canvas.toBlob(function(blob) {
      saveAs(blob, 'diceImage.png');
    })
  }

}
