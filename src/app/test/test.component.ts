import { Component, OnInit } from '@angular/core';

import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  linearModel: tf.Sequential;
  prediction: any;


  constructor() { }

  ngOnInit() {
    this.train(); 
  }

  async train(): Promise<any> {
    // Define a model for linear regression.
  this.linearModel = tf.sequential();
  this.linearModel.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  this.linearModel.compile({loss: 'meanSquaredError', optimizer: 'sgd'});


  // Training data, completely random stuff
  const xs = tf.tensor1d([3.2, 4.4, 5, 8.4, 9.5]);
  const ys = tf.tensor1d([1.6, 2.2, 2.5, 4.2, 4.75]);


  // Train
  await this.linearModel.fit(xs, ys)

  console.log('model trained!')
  }

  predict(val) {
    val= +val;
    console.log(val);
    const output = this.linearModel.predict(tf.tensor2d([val], [1, 1])) as any;
    this.prediction = Array.from(output.dataSync())[0]
  }
}
