
var margin = {
    top: 16,
    bottom: 16,
    left: 32,
    right: 16
};

var height = 360 - margin.left - margin.right,
    width = 720 - margin.top - margin.bottom;
    
var rad = 5;   
 
var svg1 = d3.select('#chart-2')
            .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left +","+ margin.top + ")");
                
// let's just do a fucking scatterplot comparing IMDB ratings to jump scares
var jump_scare_data1 = d3.json('jumpscares.json').then(function(data) {
	var x1 = d3.scaleLinear().domain(
        [ d3.min(data, function(d) {
            return d["Imdb"];
        }), d3.max(data, function(d) {
            return d["Imdb"];    
        })]).range([0, width]);

	var y1 = d3.scaleLinear().domain(
		[d3.max(data, function(d) {
				return d["Jump Count"]
			}), d3.min(data, function(d) {
			return d["Jump Count"];
			})
		]).range([0, height]);
	
		
	var x_axis1 = d3.axisBottom().scale(x1).tickFormat(d3.format("d"));
	var y_axis1 = d3.axisLeft().scale(y1);
	
	svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis1); 
        
    svg1.append("g")
		.attr("transform", "translate(0," + 0 + ")")
		.call(y_axis1);
   
    svg1.append("g").selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) { return x1(d["Imdb"]); } )
        .attr("cy", function(d) { return y1(d["Jump Count"]); })
        .attr("r", function(d) { return rad; })
        .on("click", function(d) {
            d3.select(this).moveToBack();
        })
        .on("mouseover", function(d) {
            d3.select(this).style("stroke-width", 4);
            tooltip.text( d["Movie Name"] + ", " + d["Jump Count"]);
            tooltip.transition()
                .duration(100)
                .style("opacity", 0.98)
                .style("visibility", "visible");
            tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 32) + "px");

        })
        .on("mouseout", function(d) {
            d3.select(this).style("stroke-width", 1);
            tooltip.transition()
                .duration(100)
                .style("opacity", 0)
                .style("visibility", "hidden");        
        });
		// I don't have to redefine my tooltip div element here, as it's
		// defined in charts.js.
		
});
