
function chart(data){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var ratio = width/height;

    var x = d3.scaleBand()
        .rangeRound([0, width], .1)
        .paddingInner(0.1);

    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom().scale(x);

    var yAxis = d3.axisLeft().scale(y).ticks(11);

    var svg = d3.select("#barchart").append("svg").attr('id', 'barChartSVG')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })




      function resize() {
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        var width = parseInt(d3.select("#barChartSVG").style("width" - margin.left - margin.right);
        height = parseInt(d3.select("#barChartSVG").style("height")) - margin*2;

        //x.range([0, width]).nice(d3.time.year);
        y.range([height, 0]).nice();

        yAxis.ticks(Math.max(height/50, 2));
        xAxis.ticks(Math.max(width/50, 2));

        alert('in3')
        svg.select('.x.axis')
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
        alert('in4')

        svg.select('.y.axis')
          .call(yAxis);
        alert('in5')

       svg.selectAll('rect')
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })
        alert('out')
      }
      d3.select(window).on('resize', resize);
      resize();






     /*   .attr("rx", function(){return "15px"})
        .attr("ry", function(){return "15px"});

    function brushmove() {
        y.domain(x.range()).range(x.domain());
        b = brush.extent();

        var localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
            localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.ceil(y(b[1]));

        // Snap to rect edge
        d3.select("g.brush").call((brush.empty()) ? brush.clear() : brush.extent([y.invert(localBrushYearStart), y.invert(localBrushYearEnd)]));

        // Fade all years in the histogram not within the brush
        d3.selectAll("rect.bar").style("opacity", function(d, i) {
          return d.x >= localBrushYearStart && d.x < localBrushYearEnd || brush.empty() ? "1" : ".4";
        });
    }
    function brushend() {

      var localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
          localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.floor(y(b[1]));

        d3.selectAll("rect.bar").style("opacity", function(d, i) {
          return d.x >= localBrushYearStart && d.x <= localBrushYearEnd || brush.empty() ? "1" : ".4";
        });

      // Additional calculations happen here...
      // filterPoints();
      // colorPoints();
      // styleOpacity();

      // Update start and end years in upper right-hand corner of the map
      d3.select("#brushYears").text(localBrushYearStart == localBrushYearEnd ? localBrushYearStart : localBrushYearStart + " - " + localBrushYearEnd);

    }
    function resetBrush() {
      brush
        .clear()
        .event(d3.select(".brush"));
    }

     // Draw the brush
    brush = d3.svg.brush()
        .x(x)
        .on("brush", brushmove)
        .on("brushend", brushend);

    var arc = d3.svg.arc()
      .outerRadius(height / 15)
      .startAngle(0)
      .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });

    brushg = barchart.append("g")
      .attr("class", "brush")
      .call(brush);

    brushg.selectAll(".resize").append("path")
        .attr("transform", "translate(0," +  height / 2 + ")")
        .attr("d", arc);

    brushg.selectAll("rect")
        .attr("height", height);*/

      }