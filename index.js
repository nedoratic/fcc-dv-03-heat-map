let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
let req = new XMLHttpRequest();

let baseTemperature;
let monthlyVarianceValues = [];

let xScale;
let yScale;

let padding = 60;
let height = 600;
let width = 1200;

let canvas = d3.select('#canvas');

canvas.attr('height', height);
canvas.attr('width', width);

let generateScales = () => {
	xScale = d3.scaleLinear().range([padding, width - padding]);
	yScale = d3.scaleTime().range([padding, height - padding]);
};

let drawCells = () => {};

let drawAxes = () => {
	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);

	// Draw X Axis
	canvas
		.append('g')
		.call(xAxis)
		.attr('id', 'x-axis')
		.attr('transform', `translate(0, ${height - padding})`);

	// Draw Y Axis
	canvas.append('g').call(yAxis).attr('id', 'y-axis').attr('transform', `translate(${padding}, 0)`);
};

// Fetching JSON Data
req.open('GET', url, true);
req.onload = () => {
	// console.log(req.responseText);
	let object = JSON.parse(req.responseText);
	// console.log(object);
	baseTemperature = object.baseTemperature;
	// console.log(baseTemperature);
	monthlyVarianceValues = object.monthlyVariance;
	// console.log(monthlyVarianceValues);
	generateScales();
	drawCells();
	drawAxes();
};
req.send();
