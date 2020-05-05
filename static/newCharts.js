var margin = {
    top: 16,
    bottom: 16,
    left: 32,
    right: 16
};

var height = 360 - margin.left - margin.right,
    width = 720 - margin.top - margin.bottom;

var dataGlobal;

let svg = d3.select('#chart-1')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left +","+ margin.top + ")");

var jumpScareData = d3.json('static/jumpscares.json').then(function(data) {
    dataGlobal = data;
    var x = d3.scaleLinear().domain(
        [ d3.min(data, function(d) {
            return d["Year"];
        }), d3.max(data, function(d) {
            return d["Year"];
        })]
    ).range([0, width]);

    let xAxis = d3.axisBottom().scale(x).tickFormat(d3.format("d"));
    
    let y = d3.scaleLinear().domain(
        [d3.max(data, function(d) {return d["Jump Count"];}),
        d3.min(data, function(d) {return d["Jump Count"];})])
        .range([10, height-10]
    );

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
let correlationChart = d3.select('#chart-2')
    .append('svg')
        .attr('width', width+margin.left+margin.right)
        .attr('height', height+margin.top+margin.bottom)
    .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

// scatterplot comparing IMDB ratings to number of jump scares
let jumpScareDataCorr = d3.json('static/jumpscares.json').then(function(data) {
    let xCorr = d3.scaleLinear().domain(
        [ d3.min(data, function(d) {
            return d["Imdb"];
        }), d3.max(data, function(d) {
            return d["Imdb"];
        })]
    ).range([0, width]);

    let yCorr = d3.scaleLinear().domain(
        [d3.max(data, function(d) {
            return d["Jump Count"];
        }), d3.min(data, function(d) {
            return d["Jump Count"];
        })
    ]).range([0, height]);

    let xAxisCorr = d3.axisBottom().scale(xCorr).tickFormat(d3.format("d"));
    let yAxisCorr = d3.axisLeft().scale(yCorr);

    correlationChart.append('g')
        .attr('transform', 'translate(0,'+height+')')
        .call(xAxisCorr);

    correlationChart.append('g')
        .attr('transform', 'translate(0,'+0+')')
        .call(yAxisCorr);

    correlationChart.append('g').selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', function(d) { return xCorr(d['Imdb'])})
        .attr("cy", function(d) { return yCorr(d["Jump Count"]); })
        .attr("r", function(d) { return 5; })
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
})

// simple correlation using simple-statistics





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
                