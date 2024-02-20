let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
let req = new XMLHttpRequest();

let baseTemperature;
let monthlyVarianceValues;

let xScale;
let yScale;

let padding = 60;
let height = 600;
let width = 1200;

let canvas = d3.select('#canvas');

canvas.attr('height', height);
canvas.attr('width', width);
