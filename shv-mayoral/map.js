var width = 640;
var height = 720;

var candidates = {
    1: 'Adrian Perkins',
    2: 'Ollie Tyler',
    3: 'Jim Taliaferro',
    4: 'Lee Savage',
    5: 'Steven Jackson'
}

var svg = d3.select("#round-one-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var g = svg.append("g");

var color = d3.scaleQuantile()
            .range(["#f0f0f0", "#193ABE", "#80a0ff", "#FF0010", "#FF8080", "#d0f0c0"])
            .domain([0,5]);

var albersProjection = d3.geoAlbers()
    .scale(100000)
    .rotate([93.750,0])
    .center([0,32.450])
    .translate([width/2, height/2]);

var geoPath = d3.geoPath()
    .projection(albersProjection);

// Round one
g.selectAll("path")
    .data(round1.features) // have to make sure *.json is formatted right
    .enter()
    .append("path")
    .attr("fill", "#ccc")
    .attr( "stroke", "#333")
    .attr("d", geoPath)
    .style("fill", function(d) {
        return color(d.properties.Winner)
    })
    .attr("d", geoPath)
    .on("mouseover", function(d) {
			var x = d3.event.pageX;
			var y = d3.event.pageY;
			console.log(d.properties.Winner);
			d3.select("#tooltip")
				.style("left", x + "px")
				.style("top", y + "px")
				.select("#value")
				.text(candidates[d.properties.Winner]);
			d3.select("#tooltip")
				.classed("hidden", false);
	})
	.on("mouseout", function(d) {
		d3.select("#tooltip")
			.classed("hidden", true);
	});

// Round two:
var svg = d3.select("#round-two-container")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
			
var g = svg.append("g");


g.selectAll("path")
    .data(round2.features) // have to make sure *.json is formatted right
    .enter()
    .append("path")
    .attr("fill", "#ccc")
    .attr( "stroke", "#333")
    .attr("d", geoPath)
    .style("fill", function(d) {
        return color(d.properties.Winner)
    })
    .attr("d", geoPath)
    .on("mouseover", function(d) {
			var x = d3.event.pageX;
			var y = d3.event.pageY;
			d3.select("#tooltip")
				.style("left", x + "px")
				.style("top", y + "px")
				.select("#value")
				.text(candidates[d.properties.Winner]);
			d3.select("#tooltip")
				.classed("hidden", false);
	})
	.on("mouseout", function(d) {
		d3.select("#tooltip")
			.classed("hidden", true);
	});
