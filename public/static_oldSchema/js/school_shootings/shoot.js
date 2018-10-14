//https://www.dashingd3js.com/lessons/making-dynamic-scales-and-axes
function dashboard(data){

    function barchartR(data){

        d3.select(window).on('resize.two', resizeBar);
        function resizeBar(){
            fullHeight = 500;
            margin = {top: 40, right: 0, bottom: 100, left: 60},
            width = parseInt(d3.select("#chartA").style("width"), 10) - margin.left - margin.right;
            height = fullHeight - margin.top - margin.bottom;

            x_bar.rangeRoundBands([0, width], .1, 1);;
            y_bar.range([height, 0]);

            y_bar.domain([0, d3.max(data_bar, function(d) { return d.values; })]);

            xAxis_bar.scale(x_bar);
            yAxis_bar.scale(y_bar);

            d3.select("#barRSVG").selectAll("*").remove();

            d3.select("#barRSVG")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g").attr("id", "barRSVGg")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.select("#barRSVGg")
                .append("text")
                .attr("class", "title")
                .attr("x", width/2)
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .text("Demographics");

            d3.select("#barRSVGg")
                .append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width/2)
                .attr("y", height + margin.bottom)
                .attr("text-anchor", "middle")
                .text("Race");

            d3.select("#barRSVGg")
                .append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", width + margin.right/2)
                .attr("x", -1*( height -margin.top - margin.bottom)/2)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("Victim Count");


/**/
            d3.select("#barRSVGg")
                .append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis_bar)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)" );

            d3.select("#barRSVGg")
                .append("g")
                .attr("class", "y axis")
                .call(yAxis_bar)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("values");

             d3.select("#barRSVGg")
                .selectAll(".bar")
                .data(data_bar)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x_bar(d.key); })
                .attr("width", x_bar.rangeBand())
                .attr("y", function(d) { return y_bar(d.values); })
                .attr("height", function(d) { return height - y_bar(d.values); });

            d3.select("#barRSVGg")
                .selectAll("text.bar")
                .data(data_bar)
                .enter().append("text")
                .attr("class", "bar")
                .attr("text-anchor", "middle")
                .attr("x", function(d) { return x_bar(d.key) + x_bar.rangeBand()/2; })
                .attr("y", function(d) { return y_bar(d.values) - 10; })
                .text(function(d) { return "(" + d.count + ", " + formatPercent_bar(d.values) + ")"; })

d3.select("input").on("change", change_bar);

        var sortTimeout = setTimeout(function() {
        d3.select("input").property("checked", true).each(change_bar);
        }, 2000);

        function change_bar() {
            clearTimeout(sortTimeout);

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x_bar.domain(data_bar.sort(this.checked
                ? function(a, b) { return b.values - a.values; }
                : function(a, b) { return d3.ascending(a.key, b.key); })
                .map(function(d) { return d.key; }))
                .copy();

            svg_bar.selectAll(".bar")
                .sort(function(a, b) { return x0(a.key) - x0(b.key); });

            var transition_bar = svg_bar.transition().duration(750),
                delay_bar = function(d, i) { return i * 50; };

            transition_bar.selectAll(".bar")
                .delay(delay_bar)
                .attr("x", function(d) { return x0(d.key); });

            transition_bar.select(".x.axis")
                .call(xAxis_bar)
              .selectAll("g") .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)" )
                .delay(delay_bar);

             transition_bar.selectAll("text.bar")
              .attr("x", function(d) { return x_bar(d.key) + x_bar.rangeBand()/2; })
              .attr("y", function(d) { return y_bar(d.values) - 10; })


            }
/*
         d3.select("#barRSVGg").append("g")
            .attr("class","legend")
            .attr("transform","translate("+width - 100+",25)")
            .style("font-size","12px")
            .call(d3.legend)

*/
            }

        data_bar = d3.nest().key(function(d) { return d["Race"]; }).sortKeys(d3.ascending)
                            .rollup(function(leaves) { return leaves.length; })
                            .entries(data);
        var counter = 0;
        data_bar.forEach(function(d){counter = counter + d.values})
        data_bar.forEach(function(d){
            d.count = d.values;
            d.values = d.values / counter}
            )

        var margin_bar = {top: 40, right: 0, bottom: 100, left: 60},
            width_bar = parseInt(d3.select("#chartA").style("width"), 10) - margin_bar.left - margin_bar.right,
            height_bar = 500 - margin_bar.top - margin_bar.bottom;

        var formatPercent_bar = d3.format(".0%");
        var x_bar = d3.scale.ordinal().rangeRoundBands([0, width_bar], .1, 1);
        var y_bar = d3.scale.linear().range([height_bar, 0]);
        var xAxis_bar = d3.svg.axis().scale(x_bar).orient("bottom");
        var yAxis_bar = d3.svg.axis().scale(y_bar).orient("left").tickFormat(formatPercent_bar);
        var svg_bar = d3.select("#chartA")
                .append("svg").attr("id", "barRSVG")
                .attr("width", width_bar + margin_bar.left + margin_bar.right)
                .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
                .append("g").attr("id", "barRSVGg")
                .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

        x_bar.domain(data_bar.map(function(d) { return d.key; }));
        y_bar.domain([0, d3.max(data_bar, function(d) { return d.values; })]);

        d3.select("#barRSVGg")
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height_bar + ")")
            .call(xAxis_bar)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

        d3.select("#barRSVGg")
            .append("g")
            .attr("class", "y axis")
            .call(yAxis_bar)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("values");

         d3.select("#barRSVGg")
            .selectAll(".bar")
            .data(data_bar)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x_bar(d.key); })
            .attr("width", x_bar.rangeBand())
            .attr("y", function(d) { return y_bar(d.values); })
            .attr("height", function(d) { return height_bar - y_bar(d.values); });

        d3.select("#barRSVGg")
            .selectAll("text.bar")
            .data(data_bar)
            .enter().append("text")
            .attr("class", "bar")
            .attr("text-anchor", "middle")
            .attr("x", function(d) { return x_bar(d.key) + x_bar.rangeBand()/2; })
            .attr("y", function(d) { return y_bar(d.values) - 10; })
            .text(function(d) { return "(" + d.count + ", " + formatPercent_bar(d.values) + ")"; })

        d3.select("input").on("change", change_bar);

        var sortTimeout = setTimeout(function() {
        d3.select("input").property("checked", true).each(change_bar);
        }, 2000);

        function change_bar() {
            clearTimeout(sortTimeout);

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x_bar.domain(data_bar.sort(this.checked
                ? function(a, b) { return b.values - a.values; }
                : function(a, b) { return d3.ascending(a.key, b.key); })
                .map(function(d) { return d.key; }))
                .copy();

            svg_bar.selectAll(".bar")
                .sort(function(a, b) { return x0(a.key) - x0(b.key); });

            var transition_bar = svg_bar.transition().duration(750),
                delay_bar = function(d, i) { return i * 50; };

            transition_bar.selectAll(".bar")
                .delay(delay_bar)
                .attr("x", function(d) { return x0(d.key); });

            transition_bar.select(".x.axis")
                .call(xAxis_bar)
              .selectAll("g") .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)" )
                .delay(delay_bar);

             transition_bar.selectAll("text.bar")
              .attr("x", function(d) { return x_bar(d.key) + x_bar.rangeBand()/2; })
              .attr("y", function(d) { return y_bar(d.values) - 10; })


            }

}

    function piechart(data){
        data_pie = d3.nest().key(function(d) { return d["Gender"]; }).sortKeys(d3.ascending)
                            .rollup(function(leaves) { return leaves.length; })
                            .entries(data);
        var counter = 0;
        data_pie.forEach(function(d){counter = counter + d.values})
        data_pie.forEach(function(d)
        {
            d.count = d.values;
            d.values = d.values / counter
            }
            )


        var width_pie = 500, height_pie = 300, radius_pie = Math.min(width_pie, height_pie) / 2;

        var svg_pie = d3.select("#chartB").append("svg")
                                          .attr('width',width_pie).attr('height', height_pie).append("g")
                                          .attr("transform", "translate(" + width_pie / 2 + "," + height_pie / 2 + ")");

        svg_pie.append("g").attr("class", "slices");
        svg_pie.append("g").attr("class", "labels");
        svg_pie.append("g").attr("class", "lines");

        var pie_pie = d3.layout.pie().sort(null).value(function(d) {return d.count;});
        var arc_pie = d3.svg.arc().outerRadius(radius_pie * 0.8).innerRadius(radius_pie * 0.4);
        var outerArc_pie = d3.svg.arc().innerRadius(radius_pie * 0.9).outerRadius(radius_pie * 0.9);
        var key_pie = function(d){ return d.data.key; };

        var color_pie = d3.scale.ordinal()
                            .domain(["Male", "Female", "Male & Female"])
                            .range(["#0059b3", "#3399ff", "#99ccff"]);

        change_pie(data_pie);
        function change_pie(data_pie) {

            /* ------- PIE SLICES -------*/
            var slice_pie = svg_pie.select(".slices").selectAll("path.slice").data(pie_pie(data_pie), key_pie);

            slice_pie.enter().insert("path")
                .style("fill", function(d) { return color_pie(d.data.key); }).attr("class", "slice");

            slice_pie
                .transition().duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc_pie(interpolate(t));
                    };
                })

            slice_pie.exit().remove();

            /* ------- TEXT LABELS -------*/

            var text_pie = svg_pie.select(".labels").selectAll("text").data(pie_pie(data_pie), key_pie);

            text_pie.enter().append("text").attr("dy", ".35em").text(function(d) {return d.data.key;});

            function midAngle(d){ return d.startAngle + (d.endAngle - d.startAngle)/2;}

            text_pie.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc_pie.centroid(d2);
                        pos[0] = radius_pie * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
                })
                .styleTween("text-anchor", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start":"end";
                    };
                });

            text_pie.exit().remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline_pie = svg_pie.select(".lines").selectAll("polyline").data(pie_pie(data_pie), key_pie);

            polyline_pie.enter().append("polyline");

            polyline_pie.transition().duration(1000)
                .attrTween("points", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc_pie.centroid(d2);
                        pos[0] = radius_pie * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc_pie.centroid(d2), outerArc_pie.centroid(d2), pos];
                    };
                });

            polyline_pie.exit().remove();
        };

}

    function cloudChart(data) {

        //d3.select(window).on('resize.three', resizeCloud);
/*
        function resizeCloud(){

            width = parseInt(d3.select("#chartR").style("width"), 10);
            height = 500;

            wordScale=d3.scale.linear().domain([0,100]).range([10,160]).clamp(true);
            randomRotate=d3.scale.linear().domain([0,1]).range([-20,20]);

            d3.select("#cloudRSVG").selectAll("*").remove();
            d3.layout.cloud().size([width, height])
                    .words(data_cloud)
                    .rotate(0)
                    .fontSize(function(d) { return wordScale(d.frequency); })
                    .on("end", draw)
                    .start();

            function draw(words) {

                d3.select("#cloudRSVG")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("id", "cloudRSVGg")
                        .attr("transform","translate(250,250)");

                d3.select("#cloudRSVG").selectAll("text")
                    .data(words)
                    .enter()
                    .append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("opacity", .75)
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; })
                    .style('font', "Melee Cloud");
                }
            }
*/
        var data_cloud = data[0]["cloud"]

        data_cloud = JSON.parse(data_cloud)
        var keys = Object.keys(data_cloud);
        var lst=[];
        for (i = 0; i < keys.length; i++) {
            lst.push({'text':keys[i],'frequency':data_cloud[keys[i]]})
        }
        data_cloud = lst

        wordScale=d3.scale.linear().domain([0,100]).range([10,160]).clamp(true);
        randomRotate=d3.scale.linear().domain([0,1]).range([-20,20]);

        width = parseInt(d3.select("#chartC").style("width"), 10);
        height = 500;

        d3.layout.cloud().size([width, height])
            .words(data_cloud)
            .rotate(0)
            .fontSize(function(d) { return wordScale(d.frequency); })
            .on("end", draw)
            .start();

        function draw(words) {

            var svg_cloud = d3.select("#chartC")
                    .append("svg").attr("id","cloudRSVG")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("id", "cloudRSVGg")
                    .attr("transform","translate(250,250)");

            svg_cloud.selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("opacity", .75)
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; })
                .style('font', "Melee Cloud");
            }


    }

    function lineChart(data){


        var margin = {top: 10, right: 100, bottom: 130, left: 50},
            width = 800 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#chartD")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseDate = d3.time.format("%m/%d/%Y").parse;

        data.forEach(function(d) {
            d.date = parseDate(d.Date);
            d.close = +d.Injured;
            d.open = +d.Fatalities;
            d.conviction = +d.conviction;
        });


        var x = d3.time.scale().range([0, width]);
        var y0 = d3.scale.linear().range([height, 0]);
        var y1 = d3.scale.linear().range([height, 0]);
        var y2 = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true).tickFormat(d3.time.format("%m-%Y"));
        var yAxisLeft = d3.svg.axis().scale(y0).orient("left").ticks(5);
        var yAxisRight = d3.svg.axis().scale(y1).orient("right").ticks(5);
        var yAxisRight2 = d3.svg.axis().scale(y2).orient("right").ticks(5);

        var valueline = d3.svg.line().x(function(d) { return x(d.date); }).y(function(d) { return y0(d.close);}).interpolate("basis");
        var valueline2 = d3.svg.line().x(function(d) { return x(d.date); }).y(function(d) { return y1(d.open);}).interpolate("basis");
        var valueline3 = d3.svg.line().x(function(d) { return x(d.date); }).y(function(d) { return y2(d.conviction);}).interpolate("basis");

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y0.domain([0, d3.max(data, function(d) { return Math.max(d.close);})]);
        y1.domain([0, d3.max(data, function(d) { return Math.max(d.open);})]);
        y2.domain([0, d3.max(data, function(d) { return Math.max(d.conviction);})]);


        svg.append("path").attr("d", valueline(data)).attr('class', 'data1');
        svg.append("path").attr("d", valueline2(data)).attr('class', 'data2');;
        svg.append("path").attr("d", valueline3(data)).attr('class', 'data3');;

        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
        svg.append("g").attr("class", "y axis axisLeft").style("fill", "steelblue").call(yAxisLeft);
        svg.append("g").attr("class", "y axis axisRight").attr("transform", "translate(" + width + " ,0)")
                                                                                .style("fill", "red").call(yAxisRight);
        width = width+30
        svg.append("g").attr("class", "y axis axisRight2").attr("transform", "translate(" + width + " ,0)")
                                                                                .style("fill", "red").call(yAxisRight2);

    };

    function piechart_place(data){
        data_pie = d3.nest().key(function(d) { return d["Venue"]; }).sortKeys(d3.ascending)
                            .rollup(function(leaves) { return leaves.length; })
                            .entries(data);
        var counter = 0;
        data_pie.forEach(function(d){counter = counter + d.values})
        data_pie.forEach(function(d)
        {
            d.count = d.values;
            d.values = d.values / counter
            }
            )


        var width_pie = 500, height_pie = 300, radius_pie = Math.min(width_pie, height_pie) / 2;

        var svg_pie = d3.select("#chartE").append("svg").attr('width',width_pie).attr('height', height_pie).append("g");

        svg_pie.append("g").attr("class", "slices");
        svg_pie.append("g").attr("class", "labels");
        svg_pie.append("g").attr("class", "lines");

        var pie_pie = d3.layout.pie().sort(null).value(function(d) {return d.count;});
        var arc_pie = d3.svg.arc().outerRadius(radius_pie * 0.8).innerRadius(radius_pie * 0.4);
        var outerArc_pie = d3.svg.arc().innerRadius(radius_pie * 0.9).outerRadius(radius_pie * 0.9);
        svg_pie.attr("transform", "translate(" + width_pie / 2 + "," + height_pie / 2 + ")");
        var key_pie = function(d){ return d.data.key; };

        var color_pie = d3.scale.ordinal()
            .domain(["Other, Workplace, School, Military, Religious,"]).range(["#0059b3", "#3399ff", "#99ccff", "#C0C0C0", "#FF0000"]);

        change_pie(data_pie);
        function change_pie(data_pie) {

            /* ------- PIE SLICES -------*/
            var slice_pie = svg_pie.select(".slices").selectAll("path.slice").data(pie_pie(data_pie), key_pie);

            slice_pie.enter().insert("path")
                .style("fill", function(d) { return color_pie(d.data.key); }).attr("class", "slice");

            slice_pie
                .transition().duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc_pie(interpolate(t));
                    };
                })

            slice_pie.exit().remove();

            /* ------- TEXT LABELS -------*/

            var text_pie = svg_pie.select(".labels").selectAll("text").data(pie_pie(data_pie), key_pie);

            text_pie.enter().append("text").attr("dy", ".35em").text(function(d) {return d.data.key;});

            function midAngle(d){ return d.startAngle + (d.endAngle - d.startAngle)/2;}

            text_pie.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc_pie.centroid(d2);
                        pos[0] = radius_pie * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
                })
                .styleTween("text-anchor", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start":"end";
                    };
                });

            text_pie.exit().remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline_pie = svg_pie.select(".lines").selectAll("polyline").data(pie_pie(data_pie), key_pie);

            polyline_pie.enter().append("polyline");

            polyline_pie.transition().duration(1000)
                .attrTween("points", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc_pie.centroid(d2);
                        pos[0] = radius_pie * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc_pie.centroid(d2), outerArc_pie.centroid(d2), pos];
                    };
                });

            polyline_pie.exit().remove();
        };

}

    function lineChart_trend(data){

        function linearRegression(y,x){
            var lr = {};
            var n = y.length;
            var sum_x = 0;
            var sum_y = 0;
            var sum_xy = 0;
            var sum_xx = 0;
            var sum_yy = 0;

            for (var i = 0; i < y.length; i++) {

                sum_x += x[i];
                sum_y += y[i];
                sum_xy += (x[i]*y[i]);
                sum_xx += (x[i]*x[i]);
                sum_yy += (y[i]*y[i]);
            }

            lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
            lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
            lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

            return lr;
        }

        var parseDate = d3.time.format("%Y").parse;

        data.forEach(function(d) {
            d.year = d.Year //parseDate(d.Year);
            d.Injured = +d.Injured;
            d["Total victims"] = +d["Total victims"]
            d.Fatalities = +d.Fatalities;
        });

        var nest = d3.nest()
                    .key(function(d) { return d["year"]; })
                    .rollup(function(leaves) { return {
                        "total": d3.sum(leaves, function(d) {return +d["Total victims"];}),
                        "injured": d3.sum(leaves, function(d) {return +d["Injured"];}),
                        "fatal": d3.sum(leaves, function(d) {return +d["Fatalities"];})
                        }})
                    .entries(data)

        var margin = {top: 10, right: 100, bottom: 130, left: 50},
            width = 850 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#chartF")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.time.scale().range([0, width]);
        var y0 = d3.scale.linear().range([height, 0]);
        var y1 = d3.scale.linear().range([height, 0]);
        var y2 = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true).tickFormat(d3.time.format("%Y"));
        var yAxisLeft = d3.svg.axis().scale(y0).orient("right").ticks(5);
        //var yAxisRight = d3.svg.axis().scale(y1).orient("right").ticks(5);
        //var yAxisRight2 = d3.svg.axis().scale(y2).orient("right").ticks(5);

        var valueline = d3.svg.line().x(function(d,i)  { return x(parseDate(d.key)); }).y(function(d) { return y0(d.values.total);}).interpolate("basis");
        var valueline2 = d3.svg.line().x(function(d,i) { return x(parseDate(d.key)); }).y(function(d) { return y1(d.values.injured);}).interpolate("basis");
        var valueline3 = d3.svg.line().x(function(d,i) { return x(parseDate(d.key)); }).y(function(d) { return y2(d.values.fatal);}).interpolate("basis");
        var valueline4 = d3.svg.line().x(function(d) { return d.ex; }).y(function(d) { return d.why})

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return parseDate(d.year); }));
        y0.domain([0, d3.max(nest, function(d) { return Math.max(d.values.total);})]);
        y1.domain([0, d3.max(nest, function(d) { return Math.max(d.values.injured);})]);
        y2.domain([0, d3.max(nest, function(d) { return Math.max(d.values.fatal);})]);

        // linear regression
        tx=[];ty=[];
        nest.forEach(function(d){
            tx.push(x(parseDate(d.key)))
            ty.push(y0(d.values.total))
        })
        var reg = linearRegression(ty,tx)

        function why(reg){
            var tline=[];
            for (var i = 50; i < width; i += 50){
                m = reg.slope
                b = reg.intercept
                whyy = m*i + b;
                tline.push({"ex":i,"why":whyy})

            }
            return tline
        }

        tline = why(reg)
        //bau
        svg.append("path").attr("d", valueline(nest)).attr('class', 'data1');
        //svg.append("path").attr("d", valueline2(nest)).attr('class', 'data2');;
        //svg.append("path").attr("d", valueline3(nest)).attr('class', 'data3');;
        svg.append("path").attr("d", valueline4(tline)).attr('class', 'data3');;

        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
        svg.append("g").attr("class", "y axis axisLeft").attr("transform", "translate(" + width + " ,0)")
                                                                                .style("fill", "blue").call(yAxisLeft);
        //svg.append("g").attr("class", "y axis axisRight").attr("transform", "translate(" + width + " ,0)")
        //                                                                        .style("fill", "red").call(yAxisRight);
        //width = width+30
        //svg.append("g").attr("class", "y axis axisRight2").attr("transform", "translate(" + width + " ,0)")
        //                                                                        .style("fill", "red").call(yAxisRight2);



    };

    function lineChart_trendR(data){
        d3.select(window).on('resize.one', resize);

        function resize(){
            fullWidth = 850;
            fullHeight = 300;
            margin = {
                        top: 40,
                        right: 90,
                        bottom: 30,
                        left: 30
                      }

            width = parseInt(d3.select("#chartR").style("width"), 10) - margin.left - margin.right;
            height = fullHeight - margin.top - margin.bottom;
            widthRatio = width/fullWidth;
            heightRatio = height/fullHeight;

            x.range([0, width]);
            y0.range([height, 0]);

            numberOfXTicks = Math.max(width / 50, 2);
            xAxis.scale(x).tickSize(-height).tickSubdivide(true).ticks(numberOfXTicks)
            yAxisRight.scale(y0)


            d3.select("#lineTrendRSVG").selectAll("*").remove();

            d3.select("#lineTrendRSVG")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g").attr("id", "lineTrendRSVGg")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

           d3.select("#lineTrendRSVGg")
                    .append("text")
                    .attr("class", "title")
                    .attr("x", width/2)
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .text("Total Victims");

            d3.select("#lineTrendRSVGg")
                    .append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", width/2)
                    .attr("y", height + margin.bottom)
                    .attr("text-anchor", "middle")
                    .text("Year");

            d3.select("#lineTrendRSVGg")
                    .append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", width + margin.right/2)
                    .attr("x", -1*( height -margin.top - margin.bottom)/2)
                    .attr("dy", ".75em")
                    .attr("transform", "rotate(-90)")
                    .text("Victim Count");


             // linear regression
            tx=[];ty=[];
            nest.forEach(function(d){
                tx.push(x(parseDate(d.key)))
                ty.push(y0(d.values.total))
            })
            var reg = linearRegression(ty,tx)

            function why(reg){
                var tline=[];
                for (var i = 50; i < width; i += 50){
                    m = reg.slope
                    b = reg.intercept
                    whyy = m*i + b;
                    tline.push({"ex":i,"why":whyy})

                }
                return tline
            }

            tline = why(reg)

               d3.select("#lineTrendRSVGg").append("path").attr("id","line0").attr("d", valueline(nest))
                                    .attr("data-legend",function(d) { return "Injuries + Fatalities"}).attr('class', 'data1');

        r2 = reg.r2
        var trendR2 = "Trend, R2 = " + r2.toFixed(3).toString()

        d3.select("#lineTrendRSVGg").append("path").attr("id","trend").attr("d", valuelineR(tline))
                                    .attr("data-legend",function(d) { return trendR2}).attr('class', 'data3');;
        d3.select("#lineTrendRSVGg").append("g").attr("id","Xax").attr("class", "x axis")
                                    .attr("transform", "translate(0," + height + ")").call(xAxis);


        extraWidth = width + 10

        d3.select("#lineTrendRSVGg").append("g").attr("id","Yax").attr("class", "y axis axisRight")
                                    .attr("transform", "translate(" + extraWidth + " ,0)")
                                    .style("fill", "blue").call(yAxisRight);


        d3.select("#lineTrendRSVGg").append("g")
            .attr("class","legend")
            .attr("transform","translate(5,25)")
            .style("font-size","12px")
            .call(d3.legend)

            //
            //d3.select("#Xax").attr("transform", "translate(" +"0"+ " ,0)").attr("transform", "translate(0," + height + ")").call(xAxis);
            //d3.select("#Yax").attr("transform", "translate(" +"0"+ " ,0)").attr("transform", "translate(" + width + " ,0)").call(yAxisRight);
            //

            }

        function linearRegression(y,x){
            var lr = {};
            var n = y.length;
            var sum_x = 0;
            var sum_y = 0;
            var sum_xy = 0;
            var sum_xx = 0;
            var sum_yy = 0;

            for (var i = 0; i < y.length; i++) {

                sum_x += x[i];
                sum_y += y[i];
                sum_xy += (x[i]*y[i]);
                sum_xx += (x[i]*x[i]);
                sum_yy += (y[i]*y[i]);
            }

            lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
            lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
            lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

            return lr;
        }

        var parseDate = d3.time.format("%Y").parse;

        data.forEach(function(d) {
            d.year = d.Year //parseDate(d.Year);
            d.Injured = +d.Injured;
            d["Total victims"] = +d["Total victims"]
            d.Fatalities = +d.Fatalities;
        });

        var nest = d3.nest()
                    .key(function(d) { return d["year"]; })
                    .rollup(function(leaves) { return {
                        "total": d3.sum(leaves, function(d) {return +d["Total victims"];}),
                        "injured": d3.sum(leaves, function(d) {return +d["Injured"];}),
                        "fatal": d3.sum(leaves, function(d) {return +d["Fatalities"];})
                        }})
                    .entries(data)

        var margin = {
                        top: 40,
                        right: 90,
                        bottom: 30,
                        left: 30
                      }
        width = parseInt(d3.select("#chartR").style("width"), 10) - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#chartR")
                    .append("svg").attr("id", "lineTrendRSVG")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g").attr("id", "lineTrendRSVGg")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         d3.select("#lineTrendRSVGg")
                    .append("text")
                    .attr("class", "title")
                    .attr("x", width/2)
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .text("Total Victims");

        d3.select("#lineTrendRSVGg")
                    .append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", width/2)
                    .attr("y", height + margin.bottom)
                    .attr("text-anchor", "middle")
                    .text("Year");

        d3.select("#lineTrendRSVGg")
                    .append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", width + margin.right/2)
                    .attr("x", -1*( height -margin.top - margin.bottom)/2)
                    .attr("dy", ".75em")
                    .attr("transform", "rotate(-90)")
                    .text("Victim Count");



        var x = d3.time.scale().range([0, width]);
        var y0 = d3.scale.linear().range([height, 0]);

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return parseDate(d.year); }));
        y0.domain([0, d3.max(nest, function(d) { return Math.max(d.values.total);})]);

         // linear regression
        tx=[];ty=[];
        nest.forEach(function(d){
            tx.push(x(parseDate(d.key)))
            ty.push(y0(d.values.total))
        })
        var reg = linearRegression(ty,tx)

        function why(reg){
            var tline=[];
            for (var i = 50; i < width; i += 50){
                m = reg.slope
                b = reg.intercept
                whyy = m*i + b;
                tline.push({"ex":i,"why":whyy})

            }
            return tline
        }

        tline = why(reg)

        var valueline = d3.svg.line().x(function(d,i)  { return x(parseDate(d.key)); }).y(function(d) { return y0(d.values.total);}).interpolate("basis");
        var valuelineR = d3.svg.line().x(function(d) { return d.ex; }).y(function(d) { return d.why})
        var numberOfXTicks = Math.max(width / 50, 2);
        var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true).tickFormat(d3.time.format("%Y")).ticks(numberOfXTicks);
        var yAxisRight = d3.svg.axis().scale(y0).orient("right").ticks(5);


        d3.select("#lineTrendRSVGg").append("path").attr("id","line0").attr("d", valueline(nest))
                                    .attr("data-legend",function(d) { return "Injuries + Fatalities"}).attr('class', 'data1');

        r2 = reg.r2
        var trendR2 = "Trend, R2 = " + r2.toFixed(3).toString()

        d3.select("#lineTrendRSVGg").append("path").attr("id","trend").attr("d", valuelineR(tline))
                                    .attr("data-legend",function(d) { return trendR2}).attr('class', 'data3');;
        d3.select("#lineTrendRSVGg").append("g").attr("id","Xax").attr("class", "x axis")
                                    .attr("transform", "translate(0," + height + ")").call(xAxis);

        extraWidth = width + 10

        d3.select("#lineTrendRSVGg").append("g").attr("id","Yax").attr("class", "y axis axisRight")
                                    .attr("transform", "translate(" + extraWidth + " ,0)")
                                    .style("fill", "blue").call(yAxisRight);


        d3.select("#lineTrendRSVGg").append("g")
            .attr("class","legend")
            .attr("transform","translate(5,25)")
            .style("font-size","12px")
            .call(d3.legend)


    };

      barchartR(data)
      piechart(data)
      cloudChart(data)
      //lineChart(data)
      piechart_place(data)
      //lineChart_trend(data)
      lineChart_trendR(data)

}