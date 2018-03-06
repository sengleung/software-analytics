/* Todo List: 
1.1)Fix the font sizes of the tags and the width of the graph
2) beautify the graph
3) text labels at the end of the curve?
4) colour under the curve?
5) I need to have titles on the graph
6) change the background colour of the graph
7_ Change the fonts to something better
Submit to Git
*/
function scaleWidth(percentage) {
    return percentage * document.documentElement.clientWidth;
}

function scaleHeight(percentage) {
    return percentage * document.documentElement.clientHeight;
}

var parser = d3.timeParse("%Y-%m-%d");
var height = scaleHeight(0.8);
var width = scaleWidth(1);

var axis_width;

var origin = 30;
var y_axis_height = height - origin;
var backgroundColor = "rgba(255,140,26, 0.5)";
var xScale;

 d3.select("body").style("margin-top", "0px")
    .style("margin-left", "0px")
    .style("margin-right", "0px")
    .style("margin-bottom", "0px");


var title = d3.select("body")
    .append("div")
    .text("Team focus over Time")
    .style("background-color", backgroundColor)
    .style("font-family", "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif")
    .style("font-size", "2em")
    .style("text-align", "center");

title.style("position", "relative")
    .style("height", scaleHeight(0.12) + "px");

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", backgroundColor);

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
            data.map((d) => {
                return +d[columns[i]];
            }));
    }

    var yMax = -1;
    for (i = 1; i < columns.length; i++) {
        yMax = yMax > d3.max(list[i]) ? yMax : d3.max(list[i]);
    }

    var x_axis_width = scaleWidth(1) - origin;


    xScale = d3.scaleTime()
        .domain(d3.extent(list[0], function (d) {
            return d;
        }))
        .range([origin, x_axis_width]);

    var yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([y_axis_height, origin]);

    var x_axis = d3.axisBottom()
        .scale(xScale).ticks(5);

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
            .on("mouseout", handleMouseOut)
            .on("touchenter." + columns[i], yeet)
            .on("touchleave", yeet);
            

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
        svg.on("mousemove", onCanvas)
            .on("touchmove", onCanvas);
    }

    function yeet() {
        console.log("yeet");
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
    var y = R + 10;
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
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 5);

        //Drawing the textbox
        var textbox = svg.append("g");
        textbox.attr("transform", "translate(" +
                (x + R) +
                "," + (d3.select("#outer-circle").attr("cy") - R - 10) + ")")
            .attr("id", "textbox");
        y = R + 10;

        textbox.append("polygon")
            .attr("id", "polygon")
            .attr("points", ((y) * 0.75) + "," + (y / 2) + " " + (y) * 0.75 + "," + y * 1.5 + " " + 0 + "," + y)
            .style("fill", "gray")
            .attr("width", y);

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
            .text("")
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

        //move the textbox
        d3.select("#textbox")
            .attr("transform", "translate(" +
                (x + R) +
                "," +
                (d3.select("#outer-circle").attr("cy") - R - 10) + ")")
            .attr("xPos", (x + R))
            .attr("yPos", (d3.select("#outer-circle").attr("cy") - R - 10));
        //update the text
        var days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var date = new Date(xScale.invert(x));
        var string = days[date.getDay()] + " " + month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
        d3.select("#textbox-text")
            .text(string);

        //update size of text-box
        var textWidth = 5;
        d3.select("#textbox-text")
            .each(function (d, i) {
                textWidth = this.getComputedTextLength();
            });
        d3.select("#text-rect")
            .attr("width", textWidth + 10);
        //invert textbox once it has reachead a certain position
        var graph_width = axis_width - textWidth;
        var xPos = +d3.select("#textbox").attr("xPos");

        if (xPos > graph_width) {
            var yPos = +d3.select("#textbox").attr("yPos");
            xPos = d3.select("#outer-circle").attr("cx");
            xPos -= +d3.select("#polygon").attr("width");
            xPos -= +d3.select("#text-rect").attr("width");
            xPos -= +d3.select("#outer-circle").attr("r") * 2;
            d3.select("#textbox").attr("transform", "translate(" + xPos + "," + yPos + ")");
            var boxWidth = +d3.select("#polygon").attr("width");
            boxWidth += +d3.select("#text-rect").attr("width");
            boxWidth += +d3.select("#outer-circle").attr("r") + 1;
            d3.select("#polygon").attr("points",
                (boxWidth - (y * 0.75)) + "," + (y / 2) + " " +
                (boxWidth - (y * 0.75)) + "," + (y * 1.5) + " " +
                (boxWidth) + "," + y);
        } else {
            d3.select("#polygon")
                .attr("points", ((y) * 0.75) + "," + (y / 2) + " " + (y) * 0.75 + "," + y * 1.5 + " " + 0 + "," + y);
        }
    }
}