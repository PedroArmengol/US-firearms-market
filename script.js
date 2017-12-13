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
      d.lic_type = +d.Lic_Type_2017
      d.name = d.License_Name;
    });
    dataset = data;
    console.log(dataset);
    createChart(dataset);

  };
});


//Canvas
var svg = d3.select("body")
              .append("svg")
              .attr("height", height + margin.top + margin.bottom)
              .attr("width", width + margin.left + margin.right);


//Define map projection
      var projection = d3.geoAlbersUsa()
                 .translate([width/2, height/2])
                 .scale([900]);

      //Define path generator
      var path = d3.geoPath()
               .projection(projection);

//Load in GeoJSON data of US states
      d3.json("us-states.json", function(json) {
        
        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .attr("fill","lightblue");

         });


//Graph
function createChart(d) {

  //Create key
  var key = function(d) {

     return d.name;
  };

  //Y Scale (continuous)
    var yScale = d3.scaleLinear()
                   .domain([d3.min(dataset, function (d){return projection([d.lon2014, d.lat2014])[1];}), d3.max(dataset, function (d){return projection([d.lon2014, d.lat2014])[1];})])
                   .range([height,0]); 

    //X scale (categorical)
    var xScale = d3.scaleLinear()
                   .domain([d3.min(dataset, function (d){return projection([d.lon2014, d.lat2014])[0];}), d3.max(dataset, function (d){return projection([d.lon2014, d.lat2014])[0];})])
                   .range([0, width]);

        //Draw the scatter plot
                  allcircles = svg.selectAll("circle")
                      .data(dataset, key)
                      .enter()
                      .append("circle")
                      .attr("cx", function(d,i) {
                            return projection([d.lon2014, d.lat2014])[0];
                                })
                      .attr("cy", function(d,i) {
                            return projection([d.lon2014, d.lat2014])[1];
                                })
                      .attr("r", 5)
                      .style("fill", "gray")
                      .style("stroke", "gray")
                      .style("stroke-width", 0.25)
                      .style("opacity", 0.75);

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
        .text("Projected latitude")
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
        .text("Projected longitude")
        .attr("transform", "translate("+ (margin.left + width/2) +"," + (margin.top+height+barPadding*5) + ")")
        .attr("text-anchor", "middle");

    //Title & Subtitle
    svg.append("text")
        .attr("id", "title")
        .attr("x", margin.left)
        .attr("y", margin.top/3)
        .text("Armories that have change of state address");

    svg.append("text")
        .attr("id", "subtitle")
        .attr("x", margin.left)
        .attr("y", margin.top/1.5)
        .text("Time window: 2014-2017 (considering June as the benchmark)");

    //Caption
    svg.append("text")
       .attr("id", "caption")
       .attr("x", width/2)
       .attr("y", margin.top+height+margin.bottom - 10)
       .text("Source:Federal Firearms Licensees (FFLs) published by the ATF")
       .attr("text-anchor", "middle");

    //Initial Text of year
    svg.append("text")      
      .attr("x", margin.left + width - 200)
      .attr("y", margin.top + height - 200)
      .text("2014")
      .attr("class","text1");
  

    d3.selectAll("input")
        .on("click", function() {

          var view = d3.select(this).node().value;

          //Reset all to black
          allcircles.attr("r", 5);


          switch (view) {

            case "dealer":

                    allcircles.filter(function(d,i) {
                                return d.lic_type == 1;
                              })
                              .attr("r", 20);
                                        

              break;


            case "pawnbroker":

              allcircles.filter(function(d,i) {
                                return d.lic_type == 2;
                              })
                        .attr("r", 20);
                        
                        


              break;

            case "manufacturer_firearms":

              allcircles.filter(function(d,i) {
                                return d.lic_type == 7;
                              })
                        .attr("r", 20);
                        
                        


              break;

            case "manufacturer_ammunition":

              console.log("hello")
              allcircles.filter(function(d,i) {
                                return d.lic_type == 6;
                              })
                        .attr("r", 20);

              break;

            case "All":
            default:
 
          }

        });
    };
  






function motion(dataset) { 
    //Motion
    d3.select("#start").on("click", function() {
          //Update scale domains
          yScale.domain([d3.min(dataset, function (d){return projection([d.lon2015, d.lat2015])[1];}), d3.max(dataset, function (d){return projection([d.lon2015, d.lat2015])[1];})]);
          xScale.domain([d3.min(dataset, function (d){return projection([d.lon2015, d.lat2015])[0];}), d3.max(dataset, function (d){return projection([d.lon2015, d.lat2015])[0];})]);

          //Update all circles
          svg.selectAll("circle")
             .data(dataset)
             .transition() //transition of place 
             .delay(800)
             .duration(4000)
                  .ease(d3.easeLinear)
                  .attr("cx", function(d,i) {
                    return projection([d.lon2015, d.lat2015])[0];
                        })
                  .attr("cy", function(d,i) {
                    return projection([d.lon2015, d.lat2015])[1];
                        })
                  .attr("r", 5)
                  .style("fill", "gray")
                  .style("stroke", "gray")
                  .style("stroke-width", 0.25)
                  .style("opacity", 0.75)
              .transition() //transition of place 
              .delay(800)
              .duration(4000)
                  .ease(d3.easeLinear)
                  .attr("cx", function(d,i) {
                    return projection([d.lon2016, d.lat2016])[0];
                        })
                  .attr("cy", function(d,i) {
                    return projection([d.lon2016, d.lat2016])[1];
                        })
                  .attr("r", 5)
                  .style("fill", "gray")
                  .style("stroke", "gray")
                  .style("stroke-width", 0.25)
                  .style("opacity", 0.75)
              .transition() //transition of place 
              .delay(800)
              .duration(4000)
                  .ease(d3.easeLinear)
                  .attr("cx", function(d,i) {
                    return projection([d.lon2017, d.lat2017])[0];
                      })
                  .attr("cy", function(d,i) {
                    return projection([d.lon2017, d.lat2017])[1];
                      })
                  .attr("r", 5)
                  .style("fill", "gray")
                  .style("stroke", "gray")
                  .style("stroke-width", 0.25)
                  .style("opacity", 0.75);
    
        //Update text
          svg.select("text.text1") 
                .transition() //transition of place 
                .delay(600)
                .duration(4000)
                  .attr("x", margin.left + width - 200)
                  .attr("y", margin.top + height - 200)
                  .text("2015")
                  .attr("class","text1")
                .transition() //transition of place 
                .delay(600)
                .duration(4000)
                  .attr("x", margin.left + width - 200)
                  .attr("y", margin.top + height - 200)
                  .text("2016")
                  .attr("class","text1")
                .transition() //transition of place 
                .delay(600)
                .duration(4000)
                  .attr("x", margin.left + width - 200)
                  .attr("y", margin.top + height - 200)
                  .text("2017")
                  .attr("class","text1");
      
      });

      //Reset circles
      d3.select("#reset").on("click", function() {
             svg.selectAll("circle")
              .data(dataset)
              .transition() //transition of place 
               .duration(500)
               .attr("cx", function(d,i) {
                            return projection([d.lon2014, d.lat2014])[0];
                                })
               .attr("cy", function(d,i) {
                            return projection([d.lon2014, d.lat2014])[1];
                                })
               .attr("r", 5)
               .style("fill", "gray")
               .style("stroke", "gray")
               .style("stroke-width", 0.25)
               .style("opacity", 0.75); 


            //Reset text
             svg.select("text.text1") 
             .transition() //transition of place 
              .duration(4000)           
              .attr("x", margin.left + width - 200)
              .attr("y", margin.top + height - 200)
              .text("2014")
              .attr("class","text1");
  
            
      }); 

    };
    
