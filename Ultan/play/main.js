var w = 1000;
var h = 500;
var vertSlot = 1; // 8 vertical slots: slot 0 is name, slot 1 to 7 is a day
var harSlot = 1; // 3 horizontal slots: slot 0 is date titles, slot 1 is member 1, slot 2 is member 2

var day1 = [];
var day2 = [];
var day3 = [];
var day4 = [];
var day5 = [];
var day6 = [];
var day7 = [];
var edges1 = [];
var edges2 = [];
var edges3 = [];
var edges4 = [];
var edges5 = [];
var edges6 = [];
var edges7 = [];
var svg1;
var svg2;
var svg3;
var svg3;
var svg4;
var svg5;
var svg6;
var svg7;

var converter = function(d) {
	return {
		name: d.name,
		size: parseInt(d.size),
		type: d.type,
		date: d.date,
		user: d.user,
		category: d.category
	};
}

d3.csv("data.csv", converter, function(error, data) {
	if(error) {
		console.log("bummer");
	}
	else {
		dataset = data;
		parse();
	}
});

function parse() {
	
	var currentDate = dataset[0].date;
	var previousDate = dataset[0].date;
	var count = 0;
	var day = 1;
	
	for(var i = 0; i < dataset.length; i++) {
		currentDate = dataset[i].date;	
		if(currentDate == previousDate) {
			makeNodes(dataset[i], day);
			count++;
		} else {
			// draw the current day
			makeEdges(count, day);
			makeGraph(day);
			vertSlot++;
			// reset for going to the next day 
			previousDate = currentDate;
			count = 0;
			day++;
			i--;
		}
	}
}

function makeNodes(data, day) {
	switch(day) {
		case 1:
			day1.push(data);
			break;
		case 2:
			day2.push(data);
			break;
		case 3:
			day3.push(data);
			break;
		case 4:
			day4.push(data);
			break;
		case 5:
			day5.push(data);
			break;
		case 6:
			day6.push(data);
			break;
		case 7:
			day7.push(data);
			break;
		default: 
			console.log("bummer");
	}
}

function makeEdges(number, day) {
	for(var i = 0; i < number; i++) {	
		var edg = {};
		if(i + 1 != number) {
			edg = {source: i, target:i+1};		
		} else {
			edg = {source: i, target:i-2};		
		}

		switch(day) {
			case 1:
				edges1.push(edg);
				break;
			case 2:
				edges2.push(edg);
				break;
			case 3:
				edges3.push(edg);
				break;
			case 4:
				edges4.push(edg);
				break;
			case 5:
				edges5.push(edg);
				break;
			case 6:
				edges6.push(edg);
				break;
			case 7:
				edges7.push(edg);
				break;
			default:
				console.log("bummer");
		}
	}
}

function makeGraph(day) {
	var w = 100;
	var h = 100;
	switch(day) {
		case 1: 
			svg1 = d3.select("#graph").append("svg"); 
			svg1.attr("width", w);
			svg1.attr("height", h);
			graph(day1, edges1, svg1);
			break;
		case 2: 
			svg2 = d3.select("#graph").append("svg"); 
			svg2.attr("width", w);
			svg2.attr("height", h);
			graph(day2, edges2, svg2);
			break;
		case 3: 
			svg3 = d3.select("#graph").append("svg"); 
			svg3.attr("width", w);
			svg3.attr("height", h);
			graph(day3, edges3, svg3);
			break;
		case 4: 
			svg4 = d3.select("#graph").append("svg"); 
			svg4.attr("width", w);
			svg4.attr("height", h);
			graph(day4, edges4, svg4);
			break;
		case 5:  
			svg5 = d3.select("#graph").append("svg"); 
			svg5.attr("width", w);
			svg5.attr("height", h);
			graph(day5, edges5, svg5);
			break;
		case 6: 
			svg6 = d3.select("#graph").append("svg"); 
			svg6.attr("width", w);
			svg6.attr("height", h);
			graph(day6, edges6, svg6);
			break;
		case 7: 
			svg7 = d3.select("#graph").append("svg"); 
			svg7.attr("width", w);
			svg7.attr("height", h);
			graph(day7, edges7, svg7);
			break;
	}	
}

function graph(datasetDay, edges, svg) {
	console.log(datasetDay);	
	console.log(edges);	
	var force = d3.forceSimulation(datasetDay)
			.force("force", d3.forceManyBody())
			.force("link", d3.forceLink(edges))
			.force("center", d3.forceCenter().x(100/2).y(100/2));
				
	var edgess = svg.selectAll("line")
			.data(edges)
			.enter()
			.append("line")
			.style("stroke", "#ccc")
			.style("stroke-width", 5);

	var nodescale = d3.scaleLinear();
	nodescale.domain([0, d3.max(datasetDay, 
				function(d) {
					return d.size; 
				})])
			.range([5, 15]);
	var nodes = svg.selectAll("circle")
			.data(datasetDay)
			.enter()
			.append("circle")
			.attr("r", function(d)
				 {
					return nodescale(d.size);
				})
			.style("fill", function(d) 
				{
					if(d.type == "commit") {
						return "#FDB35F";
					} else {
						return "#EDEDED";
					}
				}) 
			.call(d3.drag()
				.on("start", dragStarted)
				.on("drag", dragging)
				.on("end", dragEnded))
			.on("mouseover", function(d) {
					d3.select("#tooltip").classed("hidden", false);
					//d3.select("#tooltip"),select("#newWork").text(dataset.
					d3.select("#tooltip").select("p#newWork").text(d.category);
				})
			.on("mouseout", function() {
					d3.select("#tooltip").classed("hidden", true);
				});

	force.on("tick", function() 
			{
				edgess.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.source.x; })
					.attr("y2", function(d) { return d.source.y; });
				nodes.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			});

	function dragStarted(d) {
		if(!d3.event.active) {
			force.alphaTarget(0.3).restart();
		}
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragging(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragEnded(d) {
		if(!d3.event.active) {
			force.alphaTarget(0);
		}	
		d3.fx = null;
		d3.fy = null;
	}
	return 0;
}
