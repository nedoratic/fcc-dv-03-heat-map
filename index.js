let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
let req = new XMLHttpRequest();

let baseTemperature;
let monthlyVarianceValues = [];

let xScale;
let yScale;

let minYear;
let maxYear;

let padding = 60;
let height = 600;
let width = 1200;

let canvas = d3.select('#canvas');

canvas.attr('height', height);
canvas.attr('width', width);

let tooltip = d3.select('#tooltip');

let generateScales = () => {
	minYear = d3.min(monthlyVarianceValues, (item) => {
		return item.year;
	});
	maxYear = d3.max(monthlyVarianceValues, (item) => {
		return item.year;
	});
	xScale = d3
		.scaleLinear()
		.domain([minYear, maxYear + 1])
		.range([padding, width - padding]);
	yScale = d3
		.scaleTime()
		.domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
		.range([padding, height - padding]);
};

let drawCells = () => {
	canvas
		.selectAll('rect')
		.data(monthlyVarianceValues)
		.enter()
		.append('rect')
		.attr('class', 'cell')
		.attr('fill', (item) => {
			variance = baseTemperature + item.variance;
			if (variance >= 2.8 && variance < 3.9) {
				return '#4475B4';
			} else if (variance >= 3.9 && variance < 5.0) {
				return '#75ACD0';
			} else if (variance >= 5.0 && variance < 6.1) {
				return '#AAD9E9';
			} else if (variance >= 6.1 && variance < 7.2) {
				return '#E0F2F8';
			} else if (variance >= 7.2 && variance < 8.3) {
				return '#FFFFBF';
			} else if (variance >= 8.3 && variance < 9.5) {
				return '#FEE08F';
			} else if (variance >= 9.5 && variance < 10.6) {
				return '#FCAD61';
			} else if (variance >= 10.6 && variance < 11.7) {
				return '#F36D43';
			} else if (variance >= 11.7 && variance < 12.8) {
				return '#D73026';
			} else if (variance < 2.8) {
				return '#313695';
			} else {
				return '#A50026';
			}
		})
		.attr('data-year', (item) => {
			return item.year;
		})
		.attr('data-month', (item) => {
			return item.month - 1;
		})
		.attr('data-temp', (item) => {
			return baseTemperature + item.variance;
		})
		.attr('height', (height - 2 * padding) / 12)
		.attr('y', (item) => {
			return yScale(new Date(0, item.month - 1, 0, 0, 0, 0, 0));
		})
		.attr('width', (item) => {
			let numberOfYears = maxYear - minYear;
			return (width - 2 * padding) / numberOfYears;
		})
		.attr('x', (item) => {
			return xScale(item.year);
		})
		.on('mouseover', function (event, item) {
			let rectYear = item.year;
			let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			let monthName = monthNames[item.month - 1];
			tooltip.transition().style('visibility', 'visible');
			tooltip
				.html(`Month: ${monthName}<br>Year: ${item.year}<br>Temperature: ${baseTemperature + item.variance} °C`)
				.style('left', `${event.pageX}px`)
				.style('top', `${event.pageY - 28}px`)
				.attr('data-year', rectYear);
			// Add outline to the hovered rect
			d3.select(this)
				.attr('stroke', 'black') // Set stroke color to black
				.attr('stroke-width', '1px') // Set stroke width to 1px
				.attr('stroke-opacity', '1'); // Ensure stroke is visible
		})
		.on('mouseout', function () {
			tooltip.transition().style('visibility', 'hidden');
			// Remove outline when mouse moves away
			d3.select(this).attr('stroke', 'none');
		});
};

let drawAxes = () => {
	// Determine the first and last years
	let firstYear = Math.ceil(minYear / 10) * 10;
	let lastYear = Math.floor(maxYear / 10) * 10;

	// X Axis Label
	let xAxis = d3
		.axisBottom(xScale)
		.tickFormat(d3.format('d'))
		.tickValues(d3.range(Math.ceil(minYear / 10) * 10, maxYear + 1, 10)); // Adjust ticks to every ten years starting from 1760
	// Y Axis Label
	let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

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
