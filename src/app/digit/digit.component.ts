import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import { DrawableDirective } from '../drawable.directive';
import { PinchDirective } from '../drag.directive';

@Component({
  selector: 'app-digit',
  templateUrl: './digit.component.html',
  styleUrls: ['./digit.component.scss']
})
export class DigitComponent implements AfterViewInit {

  model: tf.LayersModel;
  predictions: any;

  @ViewChild(DrawableDirective, {static: false}) canvas!:DrawableDirective;
  // @ViewChild(PinchDirective, {static: false}) canvas!:PinchDirective;

  constructor() { }

  ngAfterViewInit() {
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('./assets/model.json');
  }

  async predict(imageData: ImageData) {

    await tf.tidy(() => {
  
      // Convert the canvas pixels to a Tensor of the matching shape
      let img = tf.browser.fromPixels(imageData).resizeNearestNeighbor([28, 28]).mean(2).expandDims(2).expandDims().toFloat();
      img = tf.cast(img, 'float32');
  
      // Make and format the predications
      const output = this.model.predict(img) as any;
  
      // Save predictions on the component
      this.predictions = Array.from(output.dataSync()); 
      console.log(this.predictions)
    });
  
  }
  Onclear(){
    this.canvas.clear();
    this.predictions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
}
