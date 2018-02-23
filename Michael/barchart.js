/* Todo List: 
    1: Make the dimensions of the svg more scaleable i.e refrain from using any hard-coded values.
    2: Beautify the graph
    3: Add useful information to the graph
    4: Add mobile functionality 
    5: figure out what a rest api is
*/
function scaleWidth(percentage) {
    return percentage * window.outerWidth;
}

function scaleHeight(percentage) {
    return percentage * window.outerHeight;
}
var height = scaleHeight(0.77);
var width = scaleWidth(0.9);
var stroke_width = 5;
var origin = 30;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.csv("data.csv", function (data) {
    var columns = Object.keys(data[0]);
    var list = [];

    for (i = 0; i < columns.length; i++) {
        list.push(data.map(function (d) {
            return +d[columns[i]];
        }));
    }

    var yMax = -1;
    var xMax = d3.max(list[0]);
    for (i = 1; i < columns.length; i++) {
        yMax = yMax > d3.max(list[i]) ? yMax : d3.max(list[i]);
    }

    var x_axis_width = scaleWidth(0.75) - origin;
    var y_axis_height = height - origin;

    var xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([origin, x_axis_width]);

    var yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([y_axis_height, origin]);

    var x_axis = d3.axisBottom()
        .scale(xScale);

    var y_axis = d3.axisLeft()
        .scale(yScale).ticks(5);

    var factor = 10;

    svg.append("g")
        .attr("transform", "translate(" + origin + "," + scaleWidth(0.0074) + ")")
        .call(y_axis);

    svg.append("g")
        .attr("transform", "translate(0," + (y_axis_height + factor) + ")")
        .call(x_axis);

    var colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

    for (i = 1; i < columns.length; i++) {
        var valueLine = d3.line()
            .x(function (d) {
                return xScale(d[columns[0]]);
            })
            .y(function (d) {
                return yScale(d[columns[i]]);
            })
            .curve(d3.curveBasis);

        d3.selection.prototype.moveToFront = function () {
            //Selects the node in question, and appends it to the
            // parent node.
            // When the node is appended to the child,
            // it's automatically appended to the top
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };

        d3.selection.prototype.moveToBack = function () {
            return this.each(function () {
                var firstChild = this.parentNode.firstChild;
                if (firstChild) {
                    // Note, this does not make a copy of the node
                    this.parentNode.insertBefore(this, firstChild);
                }
            });
        };

        svg.append("path")
            .data([data])
            .attr("d", valueLine)
            .style("shape-rendering", "geometric-precision")
            .style("fill", "none")
            .style("stroke", "black")
            .style("opacity", 0)
            .style("stroke-width", stroke_width)
            .on("mouseover." + columns[i], handleMouseOver)
            .on("mouseout", handleMouseOut);

        svg.append("path")
            .data([data])
            .attr("d", valueLine)
            .attr("id", columns[i])
            .style("shape-rendering", "geometric-precision")
            .style("fill", "none")
            .style("stroke", colors[(i - 1) % colors.length])
            .style("stroke-width", 1)
            .on("mouseover." + columns[i], handleMouseOver)
            .on("mouseout", handleMouseOut);

        svg.append("text")
            .attr("x", xScale(list[i].length - 1))
            .attr("y", yScale(list[i][list[i].length - 1]))
            .text(columns[i])
            .style("fill", "black")
            .style("font-size", "23px");
    }

    function handleMouseOver() {
        var x = d3.mouse(this)[0];
        var y = d3.mouse(this)[1];
        svg.select("#" + this.__on[0].name)
            .style("stroke-width", stroke_width)
            .moveToFront();
        svg.append("text")
            .attr("id", "message")
            .attr("x", x - 5)
            .attr("y", y - 5)
            .style("text-align", "center")
            .style("fill", "black")
            .style("font-size", "23px")
            .text(this.__on[0].name);
    }
});

function handleMouseOut() {
    svg.select("#message")
        .remove();
    svg.selectAll("#" + this.__on[0].name)
        .style("stroke-width", 1)
        .moveToBack();
}