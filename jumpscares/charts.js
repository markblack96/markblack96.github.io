var margin = {
    top: 16,
    bottom: 16,
    left: 32,
    right: 16
};

var height = 360 - margin.left - margin.right,
    width = 720 - margin.top - margin.bottom;

var svg = d3.select('#chart-1')
            .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left +","+ margin.top + ")");
var debgger;
var jump_scare_data = d3.json('jumpscares.json').then(function(data) {
    console.log(data[1]);
    debgger = data;

    // Movies plotted by year
    var x = d3.scaleLinear().domain(
        [ d3.min(data, function(d) {
            return d["Year"];
        }), d3.max(data, function(d) {
            return d["Year"];    
        })]).range([0, width]);
    
    var x_axis = d3.axisBottom().scale(x).tickFormat(d3.format("d"));
    
    var y = d3.scaleLinear().domain(
        [d3.max(data, function(d) {return d["Jump Count"];}),
        d3.min(data, function(d) {return d["Jump Count"];})])
        .range([10, height-10]) 
        
    var y_axis = d3.axisLeft().scale(y);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis); 
   
    svg.append("g").selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) { return x(d["Year"]); } )
        .attr("cy", function(d) { return y(d["Jump Count"]); })
        .attr("r", function(d) { return 10; })
        .on("click", function(d) {
            d3.select(this).moveToBack();
            console.log(d);
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
     
});

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
}

var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("opacity", "0")
                .style("visibility", "hidden")
                .style("background", "#00ff0")
                .style("pointer-events", "none");
                
