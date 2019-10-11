const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"  
];

// Define margins
var margins = {
    top: 30, right: 20, bottom: 30, left: 50
}, width = 720 - margins.left - margins.right,
   height = 480 - margins.top - margins.bottom;

var parseTime = d3.timeParse("%Y-%m");

// Scales for axes
var x = d3.scaleLinear().domain([0,11])
            .range([0, width]);//.tickFormat(d3.timeFormat("%B"))
            
var y = d3.scaleLinear().range([height, 0]);

// Line function
var weather_line = d3.line()
                        .x(function(d) { return x(d.date.getMonth());})
                        .y(function(d) { return y(d.tavg);});

var color = d3.scaleLinear()
				.domain([1939, 2018]).range(["yellow", "red"]);
				
				
// Svg object
console.log(d3.select("#chart-container"));
var svg = d3.select("#chart-container").append("svg")
            .attr("width", width + margins.left + margins.right)
            .attr("height", height + margins.top + margins.bottom)
            .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");
            
            
// Get data
// debuging variable
var debug;
var debug2;
var parseMonth = d3.timeFormat("%b");
d3.csv("weather_data.csv",
    function(d) {
        return {
            date : parseTime(d.DATE),
            tavg : +d.TAVG
        };
    }).then(function(data){
        
        x.domain([0, 11]);
        
        y.domain([0, d3.max(data, function(d) { return d.tavg; })]);
        
        var years = d3.nest()
                      .key(function(d) { return d.date.getFullYear(); })
                      .entries(data);
        debug = data;
        debug2 = years;
        
        years.forEach(function(d, i) {
            svg.append("path")
                .attr("id", "y" + d.key) // so we can get them on number input
                .attr("class", "line")
                .attr("d", weather_line(d.values))
                .style("stroke", function() {return color(parseInt(d.key));})
                .style("opacity", function() {return 0.066;});
        });
        
        // Add our axes
        svg.append("g")
            .attr("transform", "translate(0,"+height+")")
            .call(d3.axisBottom(x).tickFormat(d => months[d])); //.ticks(12)); // .tickFormat(d3.timeFormat("%b"))
            
        svg.append("g")
            .call(d3.axisLeft(y).ticks(4));
        
    });
	
svg.append("g")
	.attr("class", "legendLinear")
	.attr("transform", "translate(20, 350)");
	
var legendLinear = d3.legendColor()
					.shapeWidth(60)
					.orient('horizontal')
					.scale(color)
					.labelFormat(d3.format('d')); //don't show decimals
	svg.select(".legendLinear").call(legendLinear);
	
	
	
	
	
	
	
d3.select("#year-input").on("input", function() {
    var year = document.getElementById("year-input").value;
    var year_line = d3.select("path#y" + year)
                        .style("opacity", 1.0)
                        .style("filter", "drop-shadow( 0 0 1px black )" );
    d3.select("svg").selectAll("path.line:not(#y" + year+ ")").style("opacity", function() { return 0.066; }).style("filter", null);                     
});;
