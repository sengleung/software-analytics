/* Todo List: 
Scalability of graph
beautify the graph
The text label needs to flip once it reaches a certain x-position
text labels at the end of the string?
colour under the curve?
I need to have titles on the graph
change the background colour of the graph
Change the fonts to something better
Add text labels to the graph
Submit to Git
Finish maths assignment
*/
function scaleWidth(percentage) {
    return percentage * window.outerWidth;
}

function scaleHeight(percentage) {
    return percentage * window.outerHeight;
}

var parser = d3.timeParse("%Y-%m-%d");
var height = scaleHeight(0.77);
var width = scaleWidth(0.75);

var axis_width;

var origin = 30;
var y_axis_height = height - origin;
var xScale;
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
d3.csv("data.csv", function (data) {
    var columns = Object.keys(data[0]);
    var list = [];
    var parsedTime = data.map(function (d) {
        return d[columns[0]];
    });

    for (i = 0; i < data.length; i++) {
        data[i][columns[0]] = parser(parsedTime[i]);
    }

    list.push(parsedTime.map(parser));

    for (i = 1; i < columns.length; i++) {
        list.push(
            data.map(function (d) {
                return +d[columns[i]];
            }));
    }

    var yMax = -1;
    for (i = 1; i < columns.length; i++) {
        yMax = yMax > d3.max(list[i]) ? yMax : d3.max(list[i]);
    }

    var x_axis_width = scaleWidth(0.75) - origin;


    xScale = d3.scaleTime()
        .domain(d3.extent(list[0], function (d) {
            return d;
        }))
        .range([origin, x_axis_width]);

    var yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([y_axis_height, origin]);

    var x_axis = d3.axisBottom()
        .scale(xScale).ticks(20);

    var y_axis = d3.axisLeft()
        .scale(yScale).ticks(5);

    var factor = 10;

    svg.append("g")
        .attr("id", "g_y")
        .attr("transform", "translate(" + origin + "," + scaleWidth(0.0074) + ")")
        .call(y_axis);

    svg.append("g")
        .attr("id", "g_x")
        .attr("transform", "translate(0," + (y_axis_height + factor) + ")")
        .call(x_axis);
    d3.selectAll("g").select("path").style("stroke", "red");

    var colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

    axis_width = xScale(list[0][list[0].length - 1]);
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
            // it's automatically appended to the top.
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
        var stroke_width = 10;

        svg.append("path")
            .data([data])
            .attr("d", valueLine)
            .attr("id", columns[i])
            .style("shape-rendering", "geometric-precision")
            .style("fill", "none")
            .style("stroke", colors[(i - 1) % colors.length])
            .style("opacity", 0)
            .style("stroke-width", stroke_width)
            .on("mouseover." + columns[i], handleMouseOver)
            .on("mouseout", handleMouseOut);

        svg.append("path")
            .data([data])
            .attr("d", valueLine)
            .style("shape-rendering", "geometric-precision")
            .style("fill", "none")
            .style("stroke", colors[(i - 1) % colors.length])
            .style("stroke-width", 1);

        svg.append("text")
            .attr("x", 4 + xScale(list[0][list[0].length - 1]))
            .attr("y", yScale(list[i][list[i].length - 1]))
            .attr("id", columns[i] + "text")
            .text(columns[i])
            .style("fill", colors[(i - 1) % colors.length])
            .style("font-size", "23px")
            .style("background-color", "red");
        svg.on("mousemove", onCanvas);
    }

    function handleMouseOver(d) {
        var x = d3.mouse(this)[0];
        var y = d3.mouse(this)[1];
        d3.select("#" + this.__on[0].name)
            .style("stroke-width", stroke_width)
            .style("opacity", 1)
            .moveToFront();
        d3.select("#" + this.__on[0].name + "text")
            .style("font-size", "2em");
    }
});

function handleMouseOut() {
    d3.select("#" + this.__on[0].name + "text")
        .style("font-size", "23px");

    d3.select("#" + this.__on[0].name)
        .style("opacity", 0)
        .moveToFront();
}
var bool = true;

function onCanvas() {
    var x = d3.mouse(this)[0];
    x = x > axis_width ? axis_width : x;
    var R = 10;
    var r = 5;
    if (bool) {
        //Drawing the dotted line
        d3.select(this)
            .append("line")
            .attr("id", "dotted-line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", origin)
            .attr("y2", y_axis_height + origin / 2)
            .style("stroke-width", 1)
            .style("stroke", "rgba(0,0,0,1)")
            .attr("stroke-dasharray", "2,2");

        //Drawing the circle
        d3.select(this)
            .append("circle")
            .attr("id", "outer-circle")
            .attr("cx", x)
            .attr("cy", origin - R)
            .attr("r", R)
            .attr("fill", "gray");

        d3.select(this)
            .append("circle")
            .attr("id", "inner-circle")
            .attr("cx", x)
            .attr("cy", d3.select("#outer-circle").attr("cy"))
            .attr("r", r)
            .attr("fill", "white");


        //Drawing the textbox
        var textbox = svg.append("g");
        textbox.attr("transform", "translate(" +
                (x + R) +
                "," + (d3.select("#outer-circle").attr("cy") - R - 10) + ")")
            .attr("id", "textbox");
        var y = R + 10;

        textbox.append("polygon")
            .attr("points", ((y) * 0.75) + "," + (y / 2) + " " + (y) * 0.75 + "," + y * 1.5 + " " + 0 + "," + y)
            .style("fill", "gray");

        textbox.append("rect")
            .attr("id", "text-rect")
            .attr("width", 4 * y)
            .attr("height", 2 * y)
            .attr("x", y * 0.75)
            .attr("y", 0)
            .style("fill", "none")
            .style("stroke", "gray")
            .style("stroke-width", 2);

        textbox.append("text")
            .attr("id", "textbox-text")
            .attr("x", y)
            .attr("y", R * 2)
            .attr("dy", ".35em")
            .text("hello")
            .style("fill", "red");
        bool = false;
    } else {
        //Moving the line
        d3.select("#dotted-line")
            .attr("x1", x)
            .attr("x2", x);
        //Moving the outer circle
        d3.select("#outer-circle")
            .attr("cx", x);
        //moving the inner circle
        d3.select("#inner-circle")
            .attr("cx", x);

        //move the textbox
        d3.select("#textbox")
            .attr("transform", "translate(" +
                (x + R) +
                "," +
                (d3.select("#outer-circle").attr("cy") - R - 10) + ")");
        //update the text
        var days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var date = new Date(xScale.invert(x));
        var string = days[date.getDay()] + " " + month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
        d3.select("#textbox-text")
            .text(string);
        //update size of text-box
        var textWidth;
        d3.select("#textbox-text")
            .each(function (d, i) {
                textWidth = this.getComputedTextLength();
            });
        d3.select("#text-rect")
            .attr("width", textWidth + 5);

    }
}