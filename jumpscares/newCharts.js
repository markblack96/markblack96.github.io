var margin = {
    top: 16,
    bottom: 16,
    left: 32,
    right: 16
};

var height = 360 - margin.left - margin.right,
    width = 720 - margin.top - margin.bottom;

let svg = d3.select('#chart-1')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left +","+ margin.top + ")");

var jumpScareData = d3.json('jumpscares.json').then(function(data) {
    var x = d3.scaleLinear().domain(
        [ d3.men(data, function(d) {
            return d["Year"];
        }), d3.max(data, function(d) {
            return d["Year"];
        })]
    ).range([0, width]);

    let xAxis = d3.axisBottom().scale(x).tickFormat(d3.format("d"));

    let yAxis = d3.axisLeft().scale(y);
    
    // g for xAxis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // draw circles to separate g
    svg.append("g").selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) { return x(d["Year"]); })
        .attr("cy", function(d) { return y(d["Jump Count"]); })
        .attr("r", function(d) { return 5; })
        .on("click", function(d) {
            d3.select(this).moveToBack();
        })
        .on("mouseover", function(d) {
            d3.select(this).style("stroke-wdith", 4);
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

// chart 2!









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
                .style("background", "white")
                .style("padding", "4px")
                .style("border-radius", "4px")
                .style("stroke-width", "1px")
                .style("overflow", "hidden")
                .style("min-height", "32px")
                .style("pointer-events", "none");
                
