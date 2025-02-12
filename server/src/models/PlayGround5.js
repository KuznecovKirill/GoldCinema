const brain = require('brain.js');

const net = new brain.NeuralNetwork();

const trainingData = [
{ input: [0, 0], output: [0] },
{ input: [0, 1], output: [1] },
{ input: [1, 0], output: [1] },
{ input: [1, 1], output: [0] }
];

net.train(trainingData);

const output = net.run([1, 0]);

console.log(output);
