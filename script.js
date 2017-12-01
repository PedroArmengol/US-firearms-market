var margin = {top: 100, bottom: 75, left: 100, right: 100}
var width = 1100 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;
var barPadding = 5;

//Import the data


d3.csv("merchants_state.csv", function(error, data){
  if (error) { 
    console.log(error);
  } else {
    data.forEach(function(d){
      d.lon = +d.lon,
      d.lat = +d.lat,
      d.year = +d.year,
      d.type = +d.type,
      d.name = d.license_name
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

  //Y Scale (continuous)
    var yScale = d3.scaleLinear()
                   .domain([d3.min(dataset, function (d){return d.lat;}), d3.max(dataset, function (d){return d.lat;})])
                   .range([height,0]); 

    //X scale (categorical)
    var xScale = d3.scaleLinear()
                   .domain([d3.min(dataset, function (d){return d.lon;}), d3.max(dataset, function (d){return d.lon;})])
                   .range([0, width])

 //Draw the scatter plot
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d.lon);
    })
    .attr("cy",function(d){
      return yScale(d.lat);
    })
    .attr("r", 5)
    .attr("class", function(d){

          if (d.year == 2014){

            return "point_2014";

           } else if (d.year == 2015) {

            return "point_2015"; 

          } else if (d.year == 2016) {

            return "point_2016";

          } else {

            return "point_2017";

            }
          
        });

    //Y axis
    var yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
        .call(yAxis);

    //Y axis label
    svg.append("text")
        .attr("class", "axis_label")
        .text("Latitude")
        .attr("transform", "translate("+ margin.left/3 +"," + (margin.top+height/2) + ") rotate(270)")
        .attr("text-anchor", "middle");

    //X axis
    var xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(10);
 
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top+height - 30) + ")")
        .call(xAxis);

    //X axis label
    svg.append("text")
        .attr("class", "axis_label")
        .text("Longitude")
        .attr("transform", "translate("+ (margin.left + width/2) +"," + (margin.top+height+barPadding*5) + ")")
        .attr("text-anchor", "middle");

    //Title & Subtitle
    svg.append("text")
        .attr("id", "title")
        .attr("x", margin.left)
        .attr("y", margin.top/3)
        .text("Armories that have change of state address")

    svg.append("text")
        .attr("id", "subtitle")
        .attr("x", margin.left)
        .attr("y", margin.top/1.5)
        .text("Time window: 2014-2017 (considering June as the benchmark)")

    //Add Legend
    colors = ["#e74c3c"," #2ecc71"," #bfc9ca"," #3498db"]
    texts = ["2014", "2015","2016","2017"]

    var legend = svg.selectAll("legend")
                    .data(colors)
                    .enter().append("g");
 
    legend.append("rect")
      .attr("x", margin.left + 100)
      .attr("y", function(d, i) { return height + margin.top + 40*(i-4) - 100; })
      .attr("width", 30)
      .attr("height", 30)
      .style("fill", function(d, i) {return colors[i];});

    legend.append("text")      
      .attr("x", margin.left + 140)
      .attr("y", function(d, i) { return height + margin.top + 20 + 40*(i-4) - 100; })
      .text(function(d, i) {return texts[i];})
      .attr("class", "legend_label");

    //Caption
    svg.append("text")
       .attr("id", "caption")
       .attr("x", width/2 + 100 )
       .attr("y", margin.top+height+margin.bottom - 10)
       .text("Source: Listing of Federal Firearms Licensees (FFLs) published by the ATF")
       .attr("text-anchor", "middle")

   
  };