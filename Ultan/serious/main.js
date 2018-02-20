var svg = d3.select("body").append("svg"); 
var w = 500;
var h = 500;
svg.attr("width", w);
svg.attr("height", h);

var dataset = 
	{
		nodes: [
			{ name: "Commit 1", size: 100, type: "merge"},
			{ name: "Commit 2", size: 50, type: "commit"},
			{ name: "Commit 3", size: 20, type: "commit"},
			{ name: "Commit 4", size: 10, type: "merge"}
			],
		edges: [
			{ source: 0, target: 1 },	
			{ source: 1, target: 2 },	
			{ source: 2, target: 3 },	
			{ source: 3, target: 1 }	
		]
	};
		
	var force = d3.forceSimulation(dataset.nodes)
			.force("force", d3.forceManyBody())
			.force("link", d3.forceLink(dataset.edges))
			.force("center", d3.forceCenter().x(w/2).y(h/2));
				
	var edges = svg.selectAll("line")
			.data(dataset.edges)
			.enter()
			.append("line")
			.style("stroke", "#ccc")
			.style("stroke-width", 5);

	var nodescale = d3.scaleLinear();
	nodescale.domain([0, d3.max(dataset.nodes, 
				function(d) {
					return d.size; 
				})])
			.range([5, 15]);
	var nodes = svg.selectAll("circle")
			.data(dataset.nodes)
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
				.on("end", dragEnded));

	force.on("tick", function() 
			{
				edges.attr("x1", function(d) { return d.source.x; })
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
