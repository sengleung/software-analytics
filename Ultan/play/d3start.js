/* Comments like CSS */
// Also single line comments as well

// D3 Stuff Here -----------------------

// Simple chaining ..
d3.select("body").append("p").text("New paragraph!");
// Loading datas
// Step 1: Define the data types
// It functions as a converter by passing it as a parameter to d3 
// and then d3 does its magic
var converter = function(d) {
	return {
		MyCol1: d.Food,
		MyCol2: parseFloat(d.tasty)
	};
}
// Step 2: Run data through the converter, and save to data, finally do 
// something on the callback function (in this case console.log)
d3.csv("food.csv", converter, function(error, data) {
	if(error) {
		console.log("bummer");
	}
	else {
		console.log(data);
		// do other cool stuff
	}
});
// note: if data is tab separated - use tsv

// Simple data example
var dataset = [5, 10, 15, 20, 25, 21, 20, 18, 20, 25, 38, 3, 22];
d3.select("ul").selectAll("li").data(dataset).enter().append("li").text(function(d) { return d; })
	.style("color", function(d) {
			if(d > 15) {
				return "red";	
			} else {
				return "blue";
			}
			});
// thanks to the magic of data(), any function data passes this param 'd' and return 'd' is the data from data()
// now inspect data was bound to these elements using console and you will see data in memory
// for each element - data has been bound!

// Chapter 6
d3.select("body").selectAll("span")
	.data(dataset)
	.enter()
	.append("span")
	.attr("class", "bar")
	.style("height", function(d) {
			//var height = d * 5;
			var height = Math.floor(Math.random() * 100);
			return height + "px";
		});
var svg = d3.select("body").append("svg");
svg.attr("width", 900).attr("height", 50);

var mycircles = svg.selectAll(".circle").data(dataset).enter().append("circle");
mycircles.attr("cx", function(d, i) {
		// i is another d3 trick, pass it in and it works like an incrementer 
		return (i * 50) + 25;
	}).attr("cy", 50/2).attr("r", function(d) {
		// NOTE: not ideal to express data through r ... see book ... okay for this example
		return d;
	}).attr("fill", "purple");
// now to make a proper bar chart
var svg2 = d3.select("body").append("svg").attr("width", 500).attr("height", 400);
svg2.selectAll("foo")
	.data(dataset)
	.enter()
	.append("rect")
	// see chapter description on proportional width stuff!!!!!!
	.attr("x", function(d, i) {
		return i*(500 / dataset.length);
		})
	// need to invert as origin (0,0) is top left in an SVG
	.attr("y", function(d) {
		return 400 - d*4; // by 4 is for scaling .. later we will use scales
	})
	.attr("width", (500 / dataset.length) - 1)
	.attr("height", function(d) {
		return d*4;
	}).attr("fill", function(d) {
		return "rgb(0, 0, " + Math.round(d*10) + ")";
	});
svg2.selectAll("text")
	.data(dataset)
	.enter()
	.append("text")
	.text(function(d) {
			return d;
		}
	)
	.attr("x", function(d, i) {
			return i*(500 / dataset.length) + (500 / dataset.length - 2) / 2;
		})
	.attr("y", function(d) {
			return 400 - d*4 + 9;
		})
	.attr("font-family", "sans-serif")
	.attr("font-size", "11px")
	.attr("fill", "white")
	.attr("text-anchor", "middle");

// now make a scatterplot
var scatter = [[5,20], [480, 90], [250, 50], [100, 33], [330, 95], [410, 12], [475, 44]];
var svg3 = d3.select("body").append("svg").attr("width", 900).attr("height", 200);
svg3.selectAll("circle").data(scatter).enter().append("circle")
	.attr("cx", function(d) {
			return d[0];
		})
	.attr("cy", function(d) {
			return d[1];
		})
	.attr("r", function(d) {
			return Math.sqrt(900-d[0]);
		});
svg3.selectAll("text").data(scatter).enter().append("text")
	.attr("x", function(d) {
			return d[0];
		})
	.attr("y", function(d) {
			return d[1];
		})
	.text(function(d) {
		return d[0] + "," + d[1];
		})
	.attr("font-family", "sans-serif")
	.attr("fill", "red")
	.attr("font-size", "11px");
// JavaScript Basics Here ---------------
// Variables and arrays
var amount = 5;
console.log(amount);
var numbers = [1, 2, 3, 4, 5];
console.log(numbers);
console.log(numbers[1]);
var chief = "Ultan";
console.log(chief);

// Objects (seem to be like C structures)
var fruit = {
	// Objects are made of properties and values
	kind: "grape",
	color: "blue",
	quantity: 12,
	tasty: true,
};
console.log(fruit.kind);

// Array of Objects
var fruits = [
	{ 
		kind: "grape",
		color: "blue",
		quantity: 12,
		tasty: true,
	},

	{ 
		kind: "blueberry",
		color: "blue",
		quantity: 12,
		tasty: true,
	}
]

// Comparisons and Mathematical Operators
console.log(fruits[1].kind);
console.log(2 + 3);
console.log(2 - 3);
console.log(2 * 3);
console.log(2 / 3);
console.log(2 > 3);

// Control structures
for(var i = 0; i < numbers.length; i++) {
	console.log(numbers[i]);
}

// Functions
var calculateGratuity = function(bill) {
	return bill * 0.2;
};
console.log(calculateGratuity(38));
