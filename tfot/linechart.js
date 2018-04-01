/* Todo List: 
1) beautify the graph and change background color of graph(do last)
2) add functionality that will enable and disable certain graphs
3) Have it work with how I highlight part of the graph when I hover over it
--It is debatable on how number 12 should be implemented
since mobile functionality must be taken into account
4) Be able to zoom in to the graph
5)Submit to Git
*/
//returns a proportion of the width of the screen
function scaleWidth(num) {
    return +(num * document.documentElement.clientWidth);
}
//returns a proportion of the height of the screen
function scaleHeight(num) {
    return +(num * document.documentElement.clientHeight);
}
//returns the largest string width from an array of strings
function getMaxStringWidth(keys, fontSize) {
    var result = keys.map(function (d) {
        var div = document.createElement("div");
        div.innerHTML += d;
        div.style.position = "absolute";
        div.style.opacity = "0";
        div.style.fontSize = fontSize;
        document.getElementById("body").appendChild(div);
        let x = div.clientWidth;
        div.parentNode.removeChild(div);
        return x;
    });
    return Math.max(...result);
}
//Height of the entire graph
let height = scaleHeight(0.9);
//Width of the entire graph
let width = scaleWidth(1);
var axis_width;
//Value needs to be changed
let margin = 30;
let y_axis_height = height - margin;
let x_axis_width = scaleWidth(1);
let backgroundColor = "rgba(255,140,26, 0.5)";
let xScale;
let yScale;
let R = 10;
let y = R + 10;
//Maximum value on the y-axis
let yMax;
//Maximum value on the x-axis
let xMax;
//Set the margin around the screen to zero
d3.select("body")
    .attr("id", "body")
    .style("font-size", "16px")
    .style("margin-top", "0px")
    .style("margin-left", "0px")
    .style("margin-right", "0px")
    .style("margin-bottom", "0px");
//Graph Title
d3.select("body")
    .append("div")
    .text("Team Focus Over Time")
    .style("background-color", backgroundColor)
    .style("width", width)
    .style("font-family", "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif")
    .style("font-size", "9vw")
    .style("text-align", "left")
    .style("height", scaleHeight(0.12) + "px");
//apending the svg that will hold the graph
let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", backgroundColor);
//Parses a time string according to the specified string
let parser = d3.timeParse("%Y-%m-%d");
//moves a node to the front
d3.selection.prototype.moveToFront = function () {
    //Selects the node in question, and appends it to the
    // parent node.
    // When the node is appended to the child,
    // it's automatically appended to the top.
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
//Moves a node to the end of its list
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            // Note, this does not make a copy of the node
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

d3.csv("https://www.scss.tcd.ie/Stephen.Barrett/webhooks/software-analytics/tfot.php", function (error, data) {
    if (error)
        throw error;
    //Generating an object array that contains the values of each team and their respective dates
    var keys = data.columns;
    let teams = keys.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    date: parser(d[keys[0]]),
                    focus: d[id]
                };
            })
        };
    });
    //determining the scale for the x-axis
    let fontSize = "3.7vw";
    let textWidth = getMaxStringWidth(keys.slice(1), fontSize);
    xScale = d3.scaleTime()
        .domain(d3.extent(teams[0].values, function (d) {
            return d.date;
        }))
        .range([margin, x_axis_width - (textWidth * 1.2)]);

    yMax = Math.max(...[].concat(...teams.map((f) => f.values.map((d) => d.focus))));
    xMax = d3.max(teams[0].values, (d) => d.date);
    //determining the scale for the y-axis
    yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([y_axis_height, margin]);

    var x_axis = d3.axisBottom()
        .scale(xScale).ticks(5);

    var y_axis = d3.axisLeft()
        .scale(yScale).ticks(5);

    //appending the y-axis to the graph
    svg.append("g")
        .attr("transform", "translate(" + margin + ",0)")
        .call(y_axis);
    //appending the x-axis to the graph
    svg.append("g")
        .attr("transform", "translate(0," + (y_axis_height) + ")")
        .call(x_axis);
    //coloring in the graph 
    d3.selectAll("g")
        .select("path")
        .style("stroke", "red");
    //possible colors of the graph
    var colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    axis_width = xScale(xMax);

    for (let i = 1; i < keys.length; i++) {
        var valueLine = d3.line()
            .x(function (d) {
                return xScale(d.date);
            })
            .y(function (d) {
                return yScale(d.focus);
            })
            .curve(d3.curveBasis);

        svg.append("path")
            .datum(teams[i - 1].values)
            .attr("d", valueLine)
            .attr("id", keys[i].replace(/\s/g, ""))
            .style("shape-rendering", "geometric-precision")
            .style("fill", "none")
            .style("stroke", colors[(i - 1) % colors.length])
            .style("stroke-width", 3);

        svg.append("text")
            .attr("x", 4 + xScale(xMax))
            .attr("y", yScale(teams[i - 1].values[teams[i - 1].values.length - 1].focus))
            .attr("id", keys[i].replace(/\s/g, "") + "text")
            .text(keys[i])
            .style("fill", colors[(i - 1) % colors.length])
            .style("font-size", fontSize)
            .on("click." + keys[i].replace(/\s/g, ""), setOpacity);
        svg.on("mousemove", onCanvas)
            .on("touchmove", onCanvas);
    }
});

function setOpacity() {
    var opacity = +d3.select("#" + this.__on[0].name).style("opacity");
    d3.select("#" + this.__on[0].name).style("opacity", opacity === 0 ? 1 : 0);
}

function drawDottedLine(svg, xPos) {
    svg.append("line")
        .attr("id", "dotted-line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", margin)
        .attr("y2", y_axis_height + margin / 2)
        .style("stroke-width", 1)
        .style("stroke", "rgba(0,0,0,1)")
        .attr("stroke-dasharray", "2,2");
}

function drawCircle(svg, xPos) {
    svg.append("circle")
        .attr("id", "outer-circle")
        .attr("cx", xPos)
        .attr("cy", margin - R)
        .attr("r", R)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 5);
}

function drawTextBox(svg, xPos) {
    let textBox = svg.append("g")
        .attr("transform", "translate(" +
            (xPos + R) +
            "," + (d3.select("#outer-circle").attr("cy") - R - 10) + ")")
        .attr("id", "textbox");
    //Draw the triangle that's appart of the textbox
    textBox.append("polygon")
        .attr("id", "polygon")
        .attr("points", ((y) * 0.75) + "," + (y / 2) + " " + (y) * 0.75 + "," + y * 1.5 + " " + 0 + "," + y)
        .style("fill", "gray")
        .attr("width", y);
    //Draw rectangle that contains the textBox
    textBox.append("rect")
        .attr("id", "text-rect")
        .attr("width", 4 * y)
        .attr("height", 2 * y)
        .attr("x", y * 0.75)
        .attr("y", 0)
        .style("fill", "none")
        .style("stroke", "gray")
        .style("stroke-width", 2);
    //The text itself
    textBox.append("text")
        .attr("id", "textbox-text")
        .attr("x", y)
        .attr("y", R * 2)
        .attr("dy", ".35em")
        .style("fill", "red");
}

function updateLine(xPos) {
    d3.select("#dotted-line")
        .attr("x1", xPos)
        .attr("x2", xPos);
}

function updateCircle(xPos) {
    d3.select("#outer-circle")
        .attr("cx", xPos);
}

function updateTextBoxPos(xPos) {
    d3.select("#textbox")
        .attr("transform", "translate(" + (xPos + R) + "," +
            (d3.select("#outer-circle").attr("cy") - R - 10) + ")")
        .attr("xPos", (xPos + R))
        .attr("yPos", (d3.select("#outer-circle").attr("cy") - R - 10));
}

function updateTextBoxSize() {
    let textWidth = 5;
    d3.select("#textbox-text")
        .each(function () {
            textWidth = this.getComputedTextLength();
        });
    d3.select("#text-rect")
        .attr("width", textWidth + 10);
}

function rotateTextBox() {
    let textBox = d3.select("#textbox-text");
    let text = textBox.text();
    let fontSize = textBox.style("font-size");
    let textWidth = getMaxStringWidth([text], fontSize);
    let graphWidth = scaleWidth(1) - textWidth - margin;
    let xPos = +d3.select("#textbox").attr("xPos");
    if (xPos > graphWidth) {
        let yPos = +d3.select("#textbox").attr("yPos");
        let width = d3.select("#outer-circle").attr("cx");
        width -= +d3.select("#polygon").attr("width");
        width -= +d3.select("#text-rect").attr("width");
        width -= +d3.select("#outer-circle").attr("r") * 2;
        d3.select("#textbox").attr("transform", "translate(" + width + "," + yPos + ")");
        let boxWidth = +d3.select("#polygon").attr("width");
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

function updateTextBoxText(xPos) {
    let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let date = new Date(xScale.invert(xPos));
    let string = days[date.getDay()] + " " + month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
    d3.select("#textbox-text")
        .text(string);
}

var bool = true;
function onCanvas() {
    let x = d3.mouse(this)[0];
    x = x > axis_width ? axis_width : x < margin ? margin : x;
    if (bool) {
        bool = false;
        drawDottedLine(svg, x);
        drawCircle(svg, x);
        drawTextBox(svg, x);
    }
    //Moving the line
    updateLine(x);
    //Moving the outer circle
    updateCircle(x);
    //move the textbox 
    updateTextBoxPos(x);
    //update the text
    updateTextBoxText(x);
    //update size of text-box
    updateTextBoxSize();
    //invert textbox once it has reachead a certain position
    rotateTextBox();
}