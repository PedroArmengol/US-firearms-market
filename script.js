var margin = {top: 100, bottom: 75, left: 100, right: 100}
var width = 1100 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;
var barPadding = 5;

//Import the data


d3.csv("merchants_state_wide.csv", function(error, data){
  if (error) { 
    console.log(error);
  } else {
    data.forEach(function(d){
      d.lon2014 = +d.lon_2014
      d.lon2015 = +d.lon_2015
      d.lon2016 = +d.lon_2016
      d.lon2017 = +d.lon_2017
      d.lat2014 = +d.lat_2014
      d.lat2015 = +d.lat_2015
      d.lat2016 = +d.lat_2016
      d.lat2017 = +d.lat_2017
      d.name = d.License_Name
    });
    dataset = data;
    console.log(dataset);
    createChart(dataset);

  };
});

var svg = d3.select("body")
              .append("svg")
              .attr("height", height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right);

//Graph
function createChart(d){

  //Create key
  var key = function(d) {

     return d.name;
  };

  //Y Scale (continuous)
    var yScale = d3.scaleLinear()
                   .domain([d3.min(dataset, function (d){return d.lat2015;}), d3.max(dataset, function (d){return d.lat2015;})])
                   .range([height,0]); 

    //X scale (categorical)
    var xScale = d3.scaleLinear()
                   .domain([d3.min(dataset, function (d){return d.lon2015;}), d3.max(dataset, function (d){return d.lon2015;})])
                   .range([0, width]);

        //Draw the scatter plot
                    svg.selectAll("circle")
                      .data(dataset)
                      .enter()
                      .append("circle")
                      .attr("cx", function(d) {
                          return xScale(d.lon2014);
                            })
                      .attr("cy",function(d){
                          return yScale(d.lat2014);
                            })
                      .attr("r", 5);

    //Y axis
    var yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
        .call(yAxis);

    //X axis
    var xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(10);
 
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top+height - 30) + ")")
        .call(xAxis);
    
    
    //TRANSITION OF ARMORIES
    d3.select("#start").on("click", function() {
          //Update scale domains
          yScale.domain([d3.min(dataset, function (d){return d.lat2015;}), d3.max(dataset, function (d){return d.lat2015;})]);
          xScale.domain([d3.min(dataset, function (d){return d.lon2015;}), d3.max(dataset, function (d){return d.lon2015;})]);

          //Update all circles
          svg.selectAll("circle")
             .data(dataset)
             .transition() //transition of place 
               .duration(2000)
               .on("start",function() {
                  d3.select(this)
                    .attr("fill","black")
                    .attr("r",5);
                })
                .attr("cx", function(d) {
                    return xScale(d.lon2015);
                 })
                .attr("cy", function(d) {
                return yScale(d.lat2015);
                  })
              .transition() //transition of place 
              .duration(2000)
              .on("start",function() {
                  d3.select(this)
                    .attr("fill","black")
                    .attr("r",5);
                })
                .attr("cx", function(d) {
                    return xScale(d.lon2016);
                 })
                .attr("cy", function(d) {
                return yScale(d.lat2016);
                })
              .transition() //transition of place 
              .duration(2000)
              .on("start",function() {
                  d3.select(this)
                    .attr("fill","black")
                    .attr("r",5);
                })
                .attr("cx", function(d) {
                    return xScale(d.lon2017);
                 })
                .attr("cy", function(d) {
                return yScale(d.lat2017);
                });
             
          });

      d3.select("#reset").on("click", function() {
             svg.selectAll("circle")
              .data(dataset)
              .transition() //transition of place 
               .duration(1000)
               .on("start",function() {
                  d3.select(this)
                    .attr("fill","black")
                    .attr("r",5);
                })
                .attr("cx", function(d) {
                    return xScale(d.lon2014);
                 })
                .attr("cy", function(d) {
                return yScale(d.lat2014);
                 });
  
    });

};     
