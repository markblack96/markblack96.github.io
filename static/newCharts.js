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

// chart 2!
let correlationChart = d3.select('#chart-2')
    .append('svg')
        .attr('width', width+margin.left+margin.right)
        .attr('height', height+margin.top+margin.bottom)
    .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

var jumpScareData = d3.json('static/jumpscares.json').then(function(data) {
    dataGlobal = data;
    drawTrendChart(data);
    drawCorrelationChart(data);
});


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
                
// todo: encapsulate visualizations into a function
function drawTrendChart(data) {
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
}
function drawCorrelationChart(data) {
    // todo: make xCorr about Jump Count and yCorr about IMDB rating, so X is the independent variable and Y is the dependent variable
    /* let xCorr = d3.scaleLinear().domain(
        [ 0, 10]
    ).range([0, width]); // maybe make this just be 1, 10?

    let yCorr = d3.scaleLinear().domain(
        [d3.max(data, function(d) {
            return d["Jump Count"];
        }), d3.min(data, function(d) {
            return d["Jump Count"];
        })
    ]).range([0, height]); */

    let yCorr = d3.scaleLinear().domain( // Imdb rating
        [ 10, 0 ]
    ).range([0, height]); // maybe make this just be 1, 10?

    let xCorr = d3.scaleLinear().domain( // Jump scare count
        [d3.min(data, function(d) {
            return d["Jump Count"];
        }), d3.max(data, function(d) {
            return d["Jump Count"];
        })
    ]).range([0, width]);

    let xAxisCorr = d3.axisBottom().scale(xCorr);
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
        .attr('cx', function(d) { return xCorr(d['Jump Count'])})
        .attr("cy", function(d) { return yCorr(d["Imdb"]); })
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

    // regression line
    let xyData = [];
    data.forEach((d)=>{xyData.push([d['Jump Count'], d['Imdb']])});

    let regressionLine = linearRegressionLine(linearRegression(xyData));
    let line = d3.line()
                .x(d => xCorr(d.x))
                .y(d => yCorr(d.y));
    
    correlationChart.append('path')
        .datum([{x: 0, y: regressionLine(0)}, {x: 32, y: regressionLine(32)}])
        .attr('d', line)
        .style('stroke', '#222');
        // todo: add a hover and press effect to show y-intercept and slope for regression

        // summary statistics
        document.querySelector('#stats-summary').innerHTML = generateSummaryTable(data, regressionLine);
}

function generateSummaryTable(data, regressionLine) {
    // spit out correlation, rsquared, and standard error.
    let xyData = [];
    data.forEach((d)=>{xyData.push([d['Jump Count'], d['Imdb']])});
    let xData = []; let yData = [];
    xyData.forEach((d) => { xData.push(d[0]); yData.push(d[1]) })
    let correlation = sampleCorrelation(xData, yData);
    let rsquared = rSquared(xyData, regressionLine);
    let s = standardError(xyData, regressionLine);
    let template = `
        <p>The sample has a correlation of ${round(correlation, 4)}, an R^2 value of ${round(rsquared, 4)}, and a standard error of ${round(s, 4)}. These statistics were generated with the simple-statistics javascript library. The sample standard error function was implemented by myself.</p>
    `
    return template;
}