d3_4.request("/portfolio/crypto").response(function (xhr) {return xhr.responseText}).get(function(data) {

    return draw(JSON.parse(data))
});


function draw(data){
    var data = data.rows;
    function average(item){
        var total = 0;
        var total2 = 0;
        for(var i = 0; i < item.length; i++) {
            total += parseInt(item[i]);
            total2+=1
        }
        val = total / total2;

        if (isNaN(val)){
            return "No Data"
        }else{
            return Math.floor(val)
        }
        //return total / total2;
    }
    function numberOf(item, del){
        if (item.length < 3){
            return parseInt(1)
        }else{
            return parseInt(item.split(del).length)
        }
    }
    function wordFreq(string) {
        var words = string.replace(/[.,:]/g, ' ').split(/\s/);
        var freqMap = {};
        words.forEach(function(w) {
            if (!freqMap[w]) {
                freqMap[w] = 0;
            }
            freqMap[w] += 1;
        });
        var props = Object.keys(freqMap).map(function(key) {
          return [ key ];
        }, freqMap);
        props.sort(function(p1, p2) { return p2.value - p1.value; });
        var topFive = props.slice(0, 5);
        return topFive;
    }

    //Setup Data
    function formatsData(data){
        String.prototype.toHHMMSS = function () {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
    };
        data.forEach(function(d,i){
            d["coin"] = d["symbol"];
            d["date"] = d["trade_date"];
            d["id_vis"] = i;
        });
        return data
    };

    format_data = formatsData(data);
    var ref_data = format_data;

    // Make xf object
    xf = crossfilter(format_data);
    dataDIM = xf.dimension(function(d){return d["id_vis"]}); // I let you filter format_data from the xf obj

    function langChart(xf, selector){

        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Languages")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Count of Languages");

        width = parseInt(d3.select(selector).style("width"), 10)
        //Bar Chart for Published Date

        langs = function(d){return parseInt(d["num_invests"])};
        langsChart = dc.barChart(selector);
        langsDim = xf.dimension(function(d){return parseInt(d["num_invests"])})
        langsGroup = langsDim.group().reduceCount(function(d){return parseInt(d["num_invests"])})

        langsChart
            .width(width)
            .height(200)
            .x(d3.scale.linear().domain([parseInt(d3.min(ref_data, langs)), parseInt(d3.max(ref_data, langs))]))
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(langsDim)
            .group(langsGroup)
            .transitionDuration(500)
            .centerBar(true)
            .gap(65)
            //.filter([3, 5])
            .elasticY(true)
            .xAxis().ticks(5)
            .tickFormat();
        //.on("renderlet.b", function (chart) {
        // rotate x-axis labels
        //  chart.selectAll('g.x text').attr('transform', 'translate(-10,10) rotate(315)')
        //});

        langsChart.render();
    }; /*Bar Chart - Count Data*/
    function pubChart(xf, selector){

        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Publication Date")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Count of Publications");
        //Bar Chart for Published Date

        pubDate = function(d){return d["published_date"]};
        pubDateChart = dc.lineChart(selector);
        pubDateDim = xf.dimension(function(d){return d["published_date"]});
        pubDateGroup = pubDateDim.group().reduceCount(function(d){return d["published_date"]});

        pubDateChart
            .width(parseInt(d3.select(selector).style("width"), 10))
            .height(200)
            .x(d3.time.scale().domain([d3.min(ref_data, pubDate), d3.max(ref_data, pubDate)]))
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(pubDateDim)
            .group(pubDateGroup)
            .transitionDuration(500).interpolate("basis")
            //.centerBar(true)
            //.gap(65)
            //.filter([3, 5])
            .elasticY(true)
            .xAxis().ticks(6)
            .tickFormat();

        pubDateChart.render();
    }; /*Line Chart - Count Data*/
    function speakChart(xf, selector){

        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Number of Speakers")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Count of Speakers");
        //Bar Chart for Number of Speakers

        numSpeak = function(d){return d["num_speaker"]}
        numSpeakChart = dc.pieChart(selector);
        numSpeakDim = xf.dimension(function(d){return +d["num_speaker"]})
        numSpeakGroup = numSpeakDim.group().reduceCount(function(d){return +d["num_speaker"]})

        numSpeakChart
            .width(parseInt(d3.select(selector).style("width"), 10))
            .height(200)
            //.x(d3.scale.linear().domain([d3.min(ref_data, numSpeak)-1, d3.max(ref_data, numSpeak)+1]))
           // .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(numSpeakDim)
            .group(numSpeakGroup).slicesCap(1)
            .innerRadius(40)
            .legend(dc.legend())
            .transitionDuration(500)
            .on('pretransition', function(chart) {
                chart.selectAll('text.pie-slice').text(function(d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                })
            });

        numSpeakChart.render();

    }; /*Pie Chart - Count Number*/
    function selectOc(xf, selector){
        //Speaker Occupation Select box

        selectOccu = dc.selectMenu(selector);
        selectOccuDim = xf.dimension(function(d){return d["speaker_occupation"]});
        //selectOccuGroup = selectOccuDim.group();
        selectOccu.width(150)
            .dimension(selectOccuDim)
            .group(selectOccuDim.group())
            .multiple(true)
            .numberVisible(5)
            //.numberItems(10)
            .order(function (a,b) {
            return b.value > a.value ? 1 : a.value > b.value ? -1 : 0;
        });

        selectOccu.render().controlsUseVisibility(true)
    }; /*Select Box - Values*/
    function tableChart(xf, selector){

        bigNum = d3.format(",")
        tableChar = dc.dataTable(selector);
        tableChartDim = xf.dimension(function(d){return d["name"]});
        tableChartGroup = tableChartDim.group();

        tableChar
            .dimension(tableChartDim)
            .group(function(d){
                return +d.value;
            }).sortBy(function(d){return d["published_date"]})
            //.size(17)
            .order(d3.ascending).showGroups(false)
            .columns([
                        "Title",        {label: "",format: function (d) { return d["title"];}},
                       // "Description",  {label: "",format: function (d) { return d["description"];}},
                       // "Speaker",      {label: "",format: function (d) { return d["main_speaker"];}},
                       // "Occupation",   {label: "",format: function (d) { return d["speaker_occupation"];}},
                       // "Published",    {label: "",format: function (d) { return d["published_date"];}},
                        "Duration",     {label: "",format: function (d) { return d["durationFormatted"];}},
                        "URL",          {label: "",format: function (d) { return d["url"];}},
                        "User Views",        {label: "",format: function (d) { return bigNum(d["views"]);}}


                        // "Comments", {label: "1",format: function (d) { return d["comments"]; }},
                        // "Event",{label: "4",format: function (d) { return d["event"]; }},
                        // "Film Date",{label: "5",format: function (d) { return d["film_date"]; }},
                        // "Languages",{label: "6",format: function (d) { return d["languages"]; }},
                        // "Name",{label: "8",format: function (d) { return d["name"]; }},
                        // "Speakers",{label: "9",format: function (d) { return d["num_speaker"]; }},
                        // "Ratings",{label: "11",format: function (d) { return d["ratings"]; }},
                        // "Related",{label: "12",format: function (d) { return d["related_talks"]; }  },
                        // "Tags",{label: "14",format: function (d) { return d["tags"]; }},

                ]);

        tableChar.render();
    };/*Table Chart - */
    function numChart(xf, selector, field, title, tag){
        if(selector != "#chartF"){
            d3.select(selector).selectAll("*").remove();
            $(selector).empty();
            d3.select(selector)
                .append("h3")
                .attr("class", "widget-title")
                .attr("align", "left")
                .style("vertical-align", "center")
                .text(title)
                .append("h5")
                .attr("align", "left")
                .style("vertical-align", "center")
                .text(tag);

            width = parseInt(d3.select(selector).style("width"), 10);
            $(selector).height(parseInt(width*0.750));

            //Bar Chart for Published Date
            items = function(d){return +d["name"]};
            viewCommRat = dc.numberDisplay(selector);
            viewCommRatDim = xf.dimension(items);
            viewCommRatGroup = viewCommRatDim.groupAll().reduceSum(function(d){return d[field]});
            average = function(d) {return d.n ? d.tot / d.n : 0;};

            viewCommRat
                .group(viewCommRatGroup)
                .formatNumber(d3.format(".3s"))
                .valueAccessor(function(d){return d})

                //.on("filtered", table(xf, format_data, "#tableID"));


            viewCommRat.render();
        }
        else{
            field1 = field.split(",")[0]
            field2 = field.split(",")[1]

            d3.select(selector).selectAll("*").remove();
            $(selector).empty();
            d3.select(selector)
                .append("h3")
                .attr("class", "widget-title")
                .attr("align", "left")
                .style("vertical-align", "center")
                .style("margin-left", "10px")
                .style("margin-top", "5px")
                .text(title)
                .append("h5")
                .attr("align", "left")
                .style("vertical-align", "center")
                .text(tag);

            width = parseInt(d3.select(selector).style("width"), 10);
            //$(selector).height(width);

            //Bar Chart for Published Date
            items = function(d){return ["url"]};
            viewCommRat = dc.numberDisplay(selector);
            viewCommRatDim = xf.dimension(items);
            viewCommRatGroup = viewCommRatDim.groupAll().reduceSum(function(d){return +d[field2]/+d[field1]});
            average = function(d) {return d.n ? d.tot / d.n : 0;};

            viewCommRat
                .group(viewCommRatGroup)
                .formatNumber(d3.format(".1%"))
                .valueAccessor(function(d){return d})

            viewCommRat.render();

        }
    }; /*Number Box - Count Data*/
    function viewsCommsChart(xf, selector){


        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("User Views (L) & Comments (R)")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Over Time");
        //Bar Chart for Published Date

        viewCommDate = function(d){return d["published_date"]};
        //viewCommDateChart = dc.lineChart(selector);
        viewCommDateChart = dc.compositeChart(selector);
        viewCommDateDim = xf.dimension(viewCommDate)
        viewDateGroup = viewCommDateDim.group().reduceSum(function(d){return +d["views"]});
        commDateGroup = viewCommDateDim.group().reduceSum(function(d){return +d["comments"]});

        viewCommDateChart
            .width(parseInt(d3.select(selector).style("width"), 10))
            .height(270)
            .margins({top: 10, right: 75, bottom: 50, left: 90})
            .x(d3.time.scale().domain([d3.min(ref_data, viewCommDate), d3.max(ref_data, viewCommDate)]))
            .legend(dc.legend().x(200).y(20).itemHeight(13).gap(5))
            .yAxisLabel("Sum of User Views")
            .mouseZoomable(true)
            .shareTitle(false)
            .xUnits(d3.time.months)
            .elasticY(true)//.yAxis().tickFormat(d3.format('.3s'))
            .compose([
                dc.lineChart(viewCommDateChart).dimension(viewCommDateDim).colors('#5bf3f5')
                    .group(viewDateGroup, "Views").dashStyle([2,2]),
                dc.lineChart(viewCommDateChart).dimension(viewCommDateDim).colors('#d26b6c')
                    .group(commDateGroup, "Comments").dashStyle([5,5]).useRightYAxis(true)
            ])
            .brushOn(false)
            .rightYAxisLabel("Sum of User Comments")
            .renderHorizontalGridLines(true)
            .render();
        //viewCommDateChart.render();
        
    } /*Composite Line - Average Monthly*/
    function mapchart(mapData, selector){

    function reformat(array) {
        var data = [];
        array.map(function (d, i) {

            data.push({
                id: i,
                type: "Feature",
                geometry: {
                    coordinates: [+d["LONGITUDE"], +d["LATITUDE"]],
                    type: "Point"
                }


            });
        });
        return data;
    }
    var geoData = { type: "FeatureCollection", features: reformat(mapData) };

    var qtree = d3.geom.quadtree(geoData.features.map(function (data, i) {
        return {
            x: data.geometry.coordinates[0],
            y: data.geometry.coordinates[1],
            all: data
        };
    } ));

    // Find the nodes within the specified rectangle.
    function search(quadtree, x0, y0, x3, y3) {
        var pts = [];
        var subPixel = false;
        var subPts = [];
        var scale = getZoomScale();

        var counter = 0;
        quadtree.visit(function (node, x1, y1, x2, y2) {
            var p = node.point;
            var pwidth = node.width * scale;
            var pheight = node.height * scale;

            // -- if this is too small rectangle only count the branch and set opacity
            if ((pwidth * pheight) <= 1) {
                // start collecting sub Pixel points
                subPixel = true;
            }
            // -- jumped to super node large than 1 pixel
            else {
                // end collecting sub Pixel points
                if (subPixel && subPts && subPts.length > 0) {

                    subPts[0].group = subPts.length;
                    pts.push(subPts[0]); // add only one todo calculate intensity
                    counter += subPts.length - 1;
                    subPts = [];
                }
                subPixel = false;
            }

            if ((p) && (p.x >= x0) && (p.x < x3) && (p.y >= y0) && (p.y < y3)) {

                if (subPixel) {
                    subPts.push(p.all);
                }
                else {
                    if (p.all.group) {
                        delete (p.all.group);
                    }
                    pts.push(p.all);
                }

            }
            // if quad rect is outside of the search rect do nto search in sub nodes (returns true)
            return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
        });

        return pts;

    }

    function updateNodes(quadtree) {
        var nodes = [];
        quadtree.depth = 0; // root

        quadtree.visit(function (node, x1, y1, x2, y2) {
            var nodeRect = {
                left: MercatorXofLongitude(x1),
                right: MercatorXofLongitude(x2),
                bottom: MercatorYofLatitude(y1),
                top: MercatorYofLatitude(y2),
            }
            node.width = (nodeRect.right - nodeRect.left);
            node.height = (nodeRect.top - nodeRect.bottom);

            if (node.depth == 0) {
                //console.log(" width: " + node.width + "height: " + node.height);
            }
            nodes.push(node);
            for (var i = 0; i < 4; i++) {
                if (node.nodes[i]) node.nodes[i].depth = node.depth + 1;
            }
        });
        return nodes;
    }

    //-------------------------------------------------------------------------------------
    MercatorXofLongitude = function (lon) {
        return lon * 20037508.34 / 180;
    };
    MercatorYofLatitude = function (lat) {
        return (Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)) * 20037508.34 / 180;
    };

    var cscale = d3.scale.linear().domain([1, 3]).range(["#ff0000", "#ff6a00", "#ffd800", "#b6ff00", "#00ffff", "#0094ff"]);//"#00FF00","#FFA500"

    var leafletMap = L.map(selector).setView([37,-97.380979], 3);

    L.tileLayer("http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png").addTo(leafletMap);


    var svg = d3.select(leafletMap.getPanes().overlayPane).append("svg");
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");


    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = leafletMap.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    var transform = d3.geo.transform({ point: projectPoint });
    var path = d3.geo.path().projection(transform);


    updateNodes(qtree);

    leafletMap.on('moveend', mapmove);

    mapmove();

    function getZoomScale() {
        var mapWidth = leafletMap.getSize().x;
        var bounds = leafletMap.getBounds();
        var planarWidth = MercatorXofLongitude(bounds.getEast()) - MercatorXofLongitude(bounds.getWest());
        var zoomScale = mapWidth / planarWidth;
        return zoomScale;

    }
    function redrawSubset(subset) {
        path.pointRadius(3);// * scale);
        var bounds = path.bounds({ type: "FeatureCollection", features: subset });
        var topLeft = bounds[0];
        var bottomRight = bounds[1];


        svg.attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");


        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        var start = new Date();


        var points = g.selectAll("path")
            .data(subset, function (d) {
                return d.id;
            })
        points.enter().append("path").attr("pointer-events","visible")

            .on("mouseover", function(d){
                alert(JSON.stringify(d))
            });
        points.exit().remove();
        points.attr("d", path)
            .on("mouseover", function(d){
                alert(JSON.stringify(d))
            });;

        points.style("fill-opacity", function (d) {
            if (d.group) {
                return (d.group * 0.3) + 0.2;
            }
        }).style("z-index", function (d) {
            return 10
        })
            .on("mouseover", function(d){
                alert(JSON.stringify(d))
            });


        //  console.log("updated at  " + new Date().setTime(new Date().getTime() - start.getTime()) + " ms ");

    }
    function mapmove(e) {
        var mapBounds = leafletMap.getBounds();
        var subset = search(qtree, mapBounds.getWest(), mapBounds.getSouth(), mapBounds.getEast(), mapBounds.getNorth());

        //console.log("subset: " + subset.length);

        redrawSubset(subset);

    }

};
    function scatterChart(data, selector, home, resize, scatterSvgID){
            salaryHigh = "#d50000"
            salaryLow = "#27fe1a"
            var moneyFormat = d3.format(",.2f");
            var _data = []
            data.forEach(function(d){
                if(d["TUITIONFEE_IN"] < 55000 && d["TUITIONFEE_OUT"] < 55000 && d["TUITFTE"] < 200000){
                    if(d["TUITIONFEE_IN"] != d["TUITIONFEE_OUT"]){
                        if(d["TUITFTE"] != "Data not reported"){
                            if(d["TUITFTE"] != "") {
                                _data.push(d)
                            }
                        }
                    }
                }
            });

            // setup x
            if(home === "in"){
                var scatter_xValue = function(d) { return d["TUITIONFEE_IN"];};

                scatterKey_margin = {right: 10,left: 10}
                scatterKey_width = 300 - scatterKey_margin.right - scatterKey_margin.left;

                scatterKey = d3.select("#scatterGradient").append("svg")
                    .attr("width", scatterKey_width + scatterKey_margin.right + scatterKey_margin.left)
                    .attr("height", 65);

                scatterLegend = scatterKey.append("defs")
                    .append("linearGradient")
                    .attr("tranform", "translate("+scatterKey_margin.left+",5)")
                    .attr("id", "gradient")
                    .attr("x1", "0").attr("y1", "0")
                    .attr("x2", "100%").attr("y2", "0")
                    .attr("spreadMethod", "pad");

                scatterLegend.append("stop").attr("offset", "0%").attr("stop-color", salaryHigh).attr("stop-opacity", 1);
                scatterLegend.append("stop").attr("offset", "100%").attr("stop-color", salaryLow).attr("stop-opacity", 1);

                scatterKey.append("rect")
                    .attr("transform", "translate("+scatterKey_margin.left+",0)")
                    .attr("width", scatterKey_width)
                    .attr("height", 25)
                    .style("fill", "url(#gradient)");
                gradientX = d3.scale.linear().range([0, scatterKey_width])
                    .domain([0,d3.max(_data, function(d){return d["AVGFACSAL"]})+1]);

                gradientXAxis = d3.svg.axis().scale(gradientX).orient("bottom").tickFormat(function(d){return moneyFormat(d)}).ticks(5);

                scatterKey.append("g").attr("class", "x axis")
                    .attr("transform", "translate("+scatterKey_margin.left+",30)")
                    .call(gradientXAxis)
                    .append("text")
                    //.attr("transform", "rotate(-90)")
                    .attr("x", 85)
                    .attr("y", 32)
                    //.attr("dy", "1em")
                    .style("text-anchor", "end")
                    .text("Faculty Salary");
            }
            else{
                var scatter_xValue = function(d) { return d["TUITIONFEE_OUT"];};
            }

            scatter_margin = {top: 20, right: 20, bottom: 30, left: 80}
            scatter_width = parseInt(d3.select(selector).style("width"), 10) - scatter_margin.left - scatter_margin.right;
            scatter_height = 300 - scatter_margin.top - scatter_margin.bottom;

            scatter_xScale = d3.scale.linear().range([0, scatter_width]);
            scatter_xMap = function(d) { return scatter_xScale(scatter_xValue(d));}; // data -> display
            scatter_numberOfXTicks = parseInt(Math.max(scatter_width / 100, 2));
            scatter_xAxis = d3.svg.axis().scale(scatter_xScale)//.tickSize(-scatter_height)
                .tickSubdivide(false).ticks(scatter_numberOfXTicks)
                .tickFormat(function(d){return "$"+moneyFormat(d)})
                .orient("bottom");

            scatter_xScale.domain([d3.min(_data, scatter_xValue)-1, d3.max(_data, scatter_xValue)+1]);


            scatter_yValue = function(d) { return d["TUITFTE"];}; // data -> value
            scatter_yScale = d3.scale.linear().range([scatter_height, 0]); // value -> display
            scatter_yMap = function(d) { return scatter_yScale(scatter_yValue(d));}; // data -> display
            scatter_yAxis = d3.svg.axis().scale(scatter_yScale).tickFormat(function(d){return "$"+moneyFormat(d)}).orient("left");

            scatter_yScale.domain([d3.min(_data, scatter_yValue)-1, d3.max(_data, scatter_yValue)+1]);

            scatter_cValue = function(d) { return d["AVGFACSAL"];};
            scatter_color =  d3.scale.pow().domain(
                [
                    d3.min(data, function(d) { return d["AVGFACSAL"]; }),
                    d3.max(data, function(d) { return d["AVGFACSAL"]; })
                ]
            ).range([salaryHigh, salaryLow]);

            scatter_svg = d3.select(selector).append("svg").attr("id", scatterSvgID)
                .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
                .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
                .append("g")
                .attr("transform", "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");

            scatter_svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + scatter_height + ")")
                .call(scatter_xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", scatter_width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("$ Tuition");

            scatter_svg.append("g")
                .attr("class", "y axis")
                .call(scatter_yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Average Revenue");

            tipBox = d3.tip().attr('class', 'd3-tip').offset([-10, 0])
                .html(function(d)
                {
                    return "<strong>Institution:</strong> <span style='color:red'>" +" "+ d["INSTNM"]  + "</span><br>" +
                        "<strong>Faculty Salary:</strong> <span style='color:red'>" +" $"+ moneyFormat(scatter_cValue(d))  + "</span><br>" +
                        "<strong>Tuition FTE:</strong> <span style='color:red'>" +" $"+ moneyFormat(scatter_xValue(d))  + "</span><br>" +
                        "<strong>Revenue:</strong> <span style='color:red'>" +" $"+ moneyFormat(scatter_yValue(d))  + "</span>"

                })
            scatter_svg.call(tipBox);

            scatter_svg.selectAll(".dot")
                .data(_data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 5)
                .attr("cx", scatter_xMap)
                .attr("cy", scatter_yMap)
                .style("fill", function(d) { return scatter_color(scatter_cValue(d));})
                .style("stroke", function(d) { return "black";})
                .style("stroke-width", 1)
                .style("opacity", .5)
                .on("mouseover", tipBox.show)
                .on("mouseout", tipBox.hide);

            function resizeScatter(){
                scatter_fullHeight = 300;

                // setup x
                if(home == "in"){
                    var scatter_xValue = function(d) { return d["TUITIONFEE_IN"];};
                }
                else{
                    var scatter_xValue = function(d) { return d["TUITIONFEE_OUT"];};
                }

                // add the graph canvas to the body of the webpage
                d3.select("#"+scatterSvgID).selectAll("*").remove();

                scatter_margin = {top: 20, right: 20, bottom: 30, left: 80};
                scatter_width = parseInt(d3.select(selector).style("width"), 10) - scatter_margin.left - scatter_margin.right;
                scatter_height = scatter_fullHeight - scatter_margin.top - scatter_margin.bottom;


                //var xScale = d3.scale.linear().rangeRoundBands([0, width], .1, 1);
                scatter_xScale.range([0, scatter_width]);
                scatter_numberOfXTicks = parseInt(Math.max(scatter_width / 100, 2));

                scatter_xAxis.scale(scatter_xScale)//.tickSize()
                    .ticks(scatter_numberOfXTicks)
                    .tickFormat(function(d){return "$"+moneyFormat(d)})
                    .orient("bottom");

                scatter_xMap = function(d) { return scatter_xScale(scatter_xValue(d));}; // data -> display
                //scatter_xAxis = d3.svg.axis().scale(scatter_xScale).orient("bottom");

                // setup y
                scatter_yValue = function(d) { return d["TUITFTE"];}; // data -> value
                scatter_yScale = d3.scale.linear().range([scatter_height, 0]); // value -> display
                scatter_yMap = function(d) { return scatter_yScale(scatter_yValue(d));}; // data -> display
                scatter_yAxis = d3.svg.axis().scale(scatter_yScale).tickFormat(function(d){return "$"+moneyFormat(d)}).orient("left");


                //domains
                scatter_xScale.domain([d3.min(_data, scatter_xValue)-1, d3.max(_data, scatter_xValue)+1]);
                scatter_yScale.domain([d3.min(_data, scatter_yValue)-1, d3.max(_data, scatter_yValue)+1]);


                // setup fill color
                scatter_cValue = function(d) { return d["AVGFACSAL"];};
                scatter_color =  d3.scale.pow().domain(
                    [
                        d3.min(data, function(d) { return d["AVGFACSAL"]; }),
                        d3.max(data, function(d) { return d["AVGFACSAL"]; })
                    ]
                ).range([salaryHigh, salaryLow]);


                scatter_svg = d3.select("#"+scatterSvgID)
                    .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
                    .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");

                scatter_svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + scatter_height + ")")
                    .call(scatter_xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", scatter_width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("Tuition");

                scatter_svg.append("g")
                    .attr("class", "y axis")
                    .call(scatter_yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Average Revenue");


                tipBox = d3.tip().attr('class', 'd3-tip').offset([-10, 0])
                    .html(function(d)
                    {
                        return "<strong>Institution:</strong> <span style='color:red'>" +" "+ d["INSTNM"]  + "</span><br>" +
                            "<strong>Faculty Salary:</strong> <span style='color:red'>" +" $"+ moneyFormat(scatter_cValue(d))  + "</span><br>" +
                            "<strong>Tuition FTE:</strong> <span style='color:red'>" +" $"+ moneyFormat(scatter_xValue(d))  + "</span><br>" +
                            "<strong>Revenue:</strong> <span style='color:red'>" +" $"+ moneyFormat(scatter_yValue(d))  + "</span>"
                    })
                scatter_svg.call(tipBox)
                scatter_svg.selectAll(".dot")
                    .data(_data)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 5)
                    .attr("cx", scatter_xMap)
                    .attr("cy", scatter_yMap)
                    .style("fill", function(d) { return scatter_color(scatter_cValue(d));})
                    .style("stroke", function(d) { return "black";})
                    .style("stroke-width", 1)
                    .style("opacity", .5)
                    .on("mouseover", tipBox.show)
                    .on("mouseout", tipBox.hide)

            }
            //window.onresize = function(svgID) {        resizeScatter()    };

            d3.select(window).on(resize, resizeScatter);

            /*
                // draw legend
                var legend = svg.selectAll(".legend")
                    .data(color.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                // draw legend colored rectangles
                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                // draw legend text
                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d;})
            */
};
    function piechart(data, selector, resize){

    pie_data = d3.nest().key(function(d) { return d["Gender"]; }).sortKeys(d3.ascending)
        .rollup(function(leaves) { return leaves.length; })
        .entries(data);

    var counter = 0;
    pie_data.forEach(function(d){counter = counter + d.values});
    pie_data.forEach(function(d) {
        d.count = d.values;
        d.values = d.values / counter
    }  );

    pie_margin = {top: 20, right: 0, bottom: 20, left: 0};

    pie_width = parseInt(d3.select(selector).style("width"), 10) - pie_margin.left - pie_margin.right;
    pie_height = 300 - pie_margin.top - pie_margin.bottom,
        pie_radius = Math.min(pie_width, pie_height) / 2;

    pie_svg = d3.select(selector).append("svg")
        .attr('width', pie_width)
        .attr('height', pie_height)
        .append("g")
        .attr("transform",
            "translate(" + pie_width / 2 + "," + pie_height / 2 + ")"
        );

    pie_svg.append("g").attr("class", "slices");
    pie_svg.append("g").attr("class", "labels");
    pie_svg.append("g").attr("class", "lines");

    pie_pie = d3.layout.pie().sort(null).value(function(d) {return d.count;});
    pie_arc = d3.svg.arc().outerRadius(pie_radius * 0.8).innerRadius(pie_radius * 0.4);
    pie_outerArc = d3.svg.arc().innerRadius(pie_radius * 0.9).outerRadius(pie_radius * 0.9);
    var pie_key = function(d){ return d.data.key; };

    pie_color = d3.scale.ordinal()
        .domain(["Male or Female", "Coed"])
        .range(["#0059b3", "#3399ff", "#99ccff"]);

    change_pie(pie_data);
    function change_pie(pie_data) {
        var pie_pie = d3.layout.pie().sort(null).value(function(d) {return d.count;});
        /* ------- PIE SLICES -------*/
        pie_slice = pie_svg.select(".slices").selectAll("path.slice").data(pie_pie(pie_data), pie_key);

        pie_slice.enter()
            .insert("path").style("fill", function(d) { return pie_color(d.data.key); }).attr("class", "slice");

        pie_slice
            .transition()
            .duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return pie_arc(interpolate(t));
                };
            })

        pie_slice.exit().remove();

        /* ------- TEXT LABELS -------*/

        pie_text = pie_svg.select(".labels").selectAll("text").data(pie_pie(pie_data), pie_key);

        pie_text.enter().append("text").attr("dy", ".35em").text(function(d) {return d.data.key;});

        function midAngle(d){ return d.startAngle + (d.endAngle - d.startAngle);}

        pie_text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = pie_outerArc.centroid(d2);
                    pos[0] = pie_radius * 0.5 * (midAngle(d2) < Math.PI ? 1 : -1);
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

        pie_text.exit().remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        pie_polyline = pie_svg.select(".lines").selectAll("polyline").data(pie_pie(pie_data), pie_key);

        pie_polyline.enter().append("polyline");

        pie_polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = pie_outerArc.centroid(d2);
                    pos[0] = pie_radius * 0.5 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [pie_arc.centroid(d2), pie_outerArc.centroid(d2), pos];
                };
            });

        pie_polyline.exit().remove();
    };


    function resizePie(pie_data){
        pie_data = d3.nest().key(function(d) { return d["Gender"]; }).sortKeys(d3.ascending)
            .rollup(function(leaves) { return leaves.length; })
            .entries(data);

        var counter = 0;
        pie_data.forEach(function(d){counter = counter + d.values});
        pie_data.forEach(function(d) {
            d.count = d.values;
            d.values = d.values / counter
        }  );

        d3.select(selector).selectAll("*").remove();

        pie_margin = {top: 20, right: 0, bottom: 20, left: 0};

        pie_width = parseInt(d3.select(selector).style("width"), 10) - pie_margin.left - pie_margin.right;
        pie_height = 300 - pie_margin.top - pie_margin.bottom,
            pie_radius = Math.min(pie_width, pie_height) / 2;

        pie_svg = d3.select(selector).append("svg")
            .attr('width', pie_width)
            .attr('height', pie_height)
            .append("g")
            .attr("transform",
                "translate(" + pie_width / 2 + "," + pie_height / 2 + ")"
            );

        pie_svg.append("g").attr("class", "slices");
        pie_svg.append("g").attr("class", "labels");
        pie_svg.append("g").attr("class", "lines");

        pie_pie = d3.layout.pie().sort(null).value(function(d) {return d.count;});
        pie_arc = d3.svg.arc().outerRadius(pie_radius * 0.8).innerRadius(pie_radius * 0.4);
        pie_outerArc = d3.svg.arc().innerRadius(pie_radius * 0.9).outerRadius(pie_radius * 0.9);
        var pie_key = function(d){ return d.data.key; };

        pie_color = d3.scale.ordinal()
            .domain(["Male or Female", "Coed"])
            .range(["#0059b3", "#3399ff", "#99ccff"]);

        change_pie(pie_data);

    }
    d3.select(window).on(resize, resizePie);
};
    function timeSeries(data, selector){
        console.log(data)
        d3.select(selector).selectAll("*").remove();
        d3.select(".spec").style("visibility", "visible");
        d3.select(".spoc").style("visibility", "visible");

        // example data
        var metricName  = "views";

        function vals(data){
            vec = []
            data.forEach(function(d){
                vec.push(d["open"])
            });
            console.log("OPEN VECTOR:",vec);
            return vec
        }
        function months(data){
            vec = []
            data.forEach(function(d){
                vec.push(d["date"])
            })
            console.log("DATE VECTOR:",vec)
            return vec
        }

        var metricCount = vals(data);
        var metricMonths = months(data);

        var optwidth        = 1000;
        var optheight       = 370;

        /*
        * ========================================================================
        *  Prepare data
        * ========================================================================
        */

        var dataset = [];
        metricCount.forEach(function(d,i ){
            var obj = {count: metricCount[i], month: metricMonths[i]};
            dataset.push(obj);
        });

        // format date to month
        dataset.forEach(function(d) {

            var string = d["month"];
            var format = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");
            var date = format.parse(string);
            var format1 = d3.time.format("%Y-%m");
            d["month"] = format1(date)

        });

        console.log(dataset)
        // sort dataset by month
        dataset.sort(function(x, y){
           return d3.ascending(x.month, y.month);
        });

        /*
        * ========================================================================
        *  sizing
        * ========================================================================
        */

        /* === Focus chart === */

        var margin	= {top: 20, right: 100, bottom: 100, left: 20},
            width	= optwidth - margin.left - margin.right,
            height	= optheight - margin.top - margin.bottom;

        /* === Context chart === */

        var margin_context = {top: 320, right: 30, bottom: 20, left: 20},
            height_context = optheight - margin_context.top - margin_context.bottom;

        /*
        * ========================================================================
        *  x and y coordinates
        * ========================================================================
        */

        // the date range of available data:
        var dataXrange = d3.extent(dataset, function(d) { return d.month; });
        var dataYrange = [0, d3.max(dataset, function(d) { return d.count; })];

        // maximum date range allowed to display
        var mindate = dataXrange[0],  // use the range of the data
            maxdate = dataXrange[1];

        var DateFormat =  d3.time.format("%b %Y");

        var dynamicDateFormat = timeFormat([
            [
                d3.time.format("%Y"),
                function() { return true; }
            ],
            [
                d3.time.format("%b %Y"),
                function(d) { return d.getMonth(); }
            ],
            [
                function(){ return ""; },
                function(d) { return d.getDate() != 1; }
            ]
        ]);

        // var dynamicDateFormat =  timeFormat([
        //     [d3.time.format("%Y"), function() { return true; }],
        //     [d3.time.format("%b"), function(d) { return d.getMonth(); }],
        //     [function(){return "";}, function(d) { return d.getDate() != 1; }]
        // ]);

        /* === Focus Chart === */

        var x = d3.time.scale()
            .range([0, (width)])
            .domain(dataXrange);

        var y = d3.scale.linear()
            .range([height, 0])
            .domain(dataYrange);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
                .tickSize(-(height))
            .ticks(customTickFunction)
            .tickFormat(dynamicDateFormat);

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(4)
            .tickSize(-(width))
            .orient("right");

        /* === Context Chart === */

        var x2 = d3.time.scale()
            .range([0, width])
            .domain([mindate, maxdate]);

        var y2 = d3.scale.linear()
            .range([height_context, 0])
            .domain(y.domain());

        var xAxis_context = d3.svg.axis()
            .scale(x2)
            .orient("bottom")
            .ticks(customTickFunction)
            .tickFormat(dynamicDateFormat);

        /*
        * ========================================================================
        *  Plotted line and area variables
        * ========================================================================
        */

        /* === Focus Chart === */

        var line = d3.svg.line()
            .x(function(d) { return x(d.month); })
            .y(function(d) { return y(d.count); });

        var area = d3.svg.area()
          .x(function(d) { return x(d.month); })
          .y0((height))
          .y1(function(d) { return y(d.count); });

        /* === Context Chart === */

        var area_context = d3.svg.area()
            .x(function(d) { return x2(d.month); })
            .y0((height_context))
            .y1(function(d) { return y2(d.count); });

        var line_context = d3.svg.line()
            .x(function(d) { return x2(d.month); })
            .y(function(d) { return y2(d.count); });

        /*
        * ========================================================================
        *  Variables for brushing and zooming behaviour
        * ========================================================================
        */

        var brush = d3.svg.brush()
            .x(x2)
            .on("brush", brushed)
            .on("brushend", brushend);

        var zoom = d3.behavior.zoom()
            .on("zoom", draw)
            .on("zoomend", brushend);

        /*
        * ========================================================================
        *  Define the SVG area ("vis") and append all the layers
        * ========================================================================
        */

        // === the main components === //

        var vis = d3.select("#metric-modal").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "metric-chart"); // CB -- "line-chart" -- CB //

        vis.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);
            // clipPath is used to keep line and area from moving outside of plot area when user zooms/scrolls/brushes

        var context = vis.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin_context.left + "," + margin_context.top + ")");

        var focus = vis.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var rect = vis.append("svg:rect")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom)
            .call(draw);

        // === current date range text & zoom buttons === //

        var display_range_group = vis.append("g")
            .attr("id", "buttons_group")
            .attr("transform", "translate(" + 0 + ","+ 0 +")");

        var expl_text = display_range_group.append("text")
            .text("Showing data from: ")
            .style("text-anchor", "start")
            .style("font-size", "14px")
            .attr("transform", "translate(" + 0 + ","+ 10 +")");

        display_range_group.append("text")
            .attr("id", "displayDates")
            .text(DateFormat(dataXrange[0]) + " - " + DateFormat(dataXrange[1]))
            .style("text-anchor", "start")
            .style("font-size", "14px")
            .attr("transform", "translate(" + 125 + ","+ 10 +")");

        var expl_text = display_range_group.append("text")
            .text("Zoom to: ")
            .style("text-anchor", "start")
            .style("font-size", "14px")
            .attr("transform", "translate(" + 350 + ","+ 10 +")");

        // === the zooming/scaling buttons === //

        var button_width = 100;
        var button_height = 20;

        // don't show year button if < 1 year of data
        var dateRange  = dataXrange[1] - dataXrange[0],
            ms_in_year = 31540000000;

        if (dateRange < ms_in_year)   {
            var button_data =["Six Month","Data"];
        } else {
            var button_data =["Year","Six Month","Data"];
            var button_data =["Year","Six Month","Data"];
        };

        var button = display_range_group.selectAll("g")
            .data(button_data)
            .enter().append("g")
            .attr("class", "scale_button")
            .attr("transform", function(d, i) { return "translate(" + (430 + i*button_width + i*10) + ",0)"; })
            .on("click", scaleDate);

        button.append("rect")
            .attr("width", button_width)
            .attr("height", button_height)
            .attr("rx", 1)
            .attr("ry", 1);

        button.append("text")
            .attr("dy", (button_height/2 + 3))
            .attr("dx", button_width/2)
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .text(function(d) { return d; });

        /* === focus chart === */

        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .attr("transform", "translate(" + (width) + ", 0)");

        focus.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", area);

        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line);

        /* === context chart === */

        context.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", area_context);

        context.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line_context);

        context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height_context + ")")
            .call(xAxis_context);

        /* === brush (part of context chart)  === */

        var brushg = context.append("g")
            .attr("class", "x brush")
            .call(brush);

        brushg.selectAll(".extent")
           .attr("y", -6)
           .attr("height", height_context + 8);
           // .extent is the actual window/rectangle showing what's in focus

        brushg.selectAll(".resize")
            .append("rect")
            .attr("class", "handle")
            .attr("transform", "translate(0," +  -3 + ")")
            .attr('rx', 2)
            .attr('ry', 2)
            .attr("height", height_context + 6)
            .attr("width", 3);

        brushg.selectAll(".resize")
            .append("rect")
            .attr("class", "handle-mini")
            .attr("transform", "translate(-2,8)")
            .attr('rx', 3)
            .attr('ry', 3)
            .attr("height", (height_context/2))
            .attr("width", 7);
            // .resize are the handles on either size
            // of the 'window' (each is made of a set of rectangles)

        /* === y axis title === */

        vis.append("text")
            .attr("class", "y axis title")
            .text("Monthly Investment ($)")
            .attr("x", (-(height/2)))
            .attr("y", 0)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .style("font-size", "12px");

        // allows zooming before any brush action
        zoom.x(x);

        /*
        * ========================================================================
        *  Functions
        * ========================================================================
        */

        // === tick/date formatting functions ===
        // from: https://stackoverflow.com/questions/20010864/d3-axis-labels-become-too-fine-grained-when-zoomed-in

        function timeFormat(formats) {
          return function(date) {
            var i = formats.length - 1, f = formats[i];
            while (!f[1](date)) f = formats[--i];
            return f[0](date);
          };
        };

        function customTickFunction(t0, t1, dt)  {
            var labelSize = 42; //
            var maxTotalLabels = Math.floor(width / labelSize);

            function step(date, offset)
            {
                date.setMonth(date.getMonth() + offset);
            }

            var time = d3.time.month.ceil(t0), times = [], monthFactors = [1,3,4,12];

            while (time < t1) times.push(new Date(+time)), step(time, 1);
            var timesCopy = times;
            var i;
            for(i=0 ; times.length > maxTotalLabels ; i++)
                times = _.filter(timesCopy, function(d){
                    return (d.getMonth()) % monthFactors[i] == 0;
                });

            return times;
        };

        // === brush and zoom functions ===
        function brushed() {

            x.domain(brush.empty() ? x2.domain() : brush.extent());
            focus.select(".area").attr("d", area);
            focus.select(".line").attr("d", line);
            focus.select(".x.axis").call(xAxis);
            // Reset zoom scale's domain
            zoom.x(x);
            updateDisplayDates();
            setYdomain();

        };
        function draw() {
            setYdomain();
            focus.select(".area").attr("d", area);
            focus.select(".line").attr("d", line);
            focus.select(".x.axis").call(xAxis);
            //focus.select(".y.axis").call(yAxis);
            // Force changing brush range
            brush.extent(x.domain());
            vis.select(".brush").call(brush);
            // and update the text showing range of dates.
            updateDisplayDates();
        };
        function brushend() {
        // when brush stops moving:

            // check whether chart was scrolled out of bounds and fix,
            var b = brush.extent();
            var out_of_bounds = brush.extent().some(function(e) { return e < mindate | e > maxdate; });
            if (out_of_bounds){ b = moveInBounds(b) };

        };
        function updateDisplayDates() {

            var b = brush.extent();
            // update the text that shows the range of displayed dates
            var localBrushDateStart = (brush.empty()) ? DateFormat(dataXrange[0]) : DateFormat(b[0]),
                localBrushDateEnd   = (brush.empty()) ? DateFormat(dataXrange[1]) : DateFormat(b[1]);

            // Update start and end dates in upper right-hand corner
            d3.select("#displayDates")
                .text(localBrushDateStart == localBrushDateEnd ? localBrushDateStart : localBrushDateStart + " - " + localBrushDateEnd);
        };
        function moveInBounds(b) {
        // move back to boundaries if user pans outside min and max date.

            var ms_in_year = 31536000000,
                brush_start_new,
                brush_end_new;

            if       (b[0] < mindate)   { brush_start_new = mindate; }
            else if  (b[0] > maxdate)   { brush_start_new = new Date(maxdate.getTime() - ms_in_year); }
            else                        { brush_start_new = b[0]; };

            if       (b[1] > maxdate)   { brush_end_new = maxdate; }
            else if  (b[1] < mindate)   { brush_end_new = new Date(mindate.getTime() + ms_in_year); }
            else                        { brush_end_new = b[1]; };

            brush.extent([brush_start_new, brush_end_new]);

            brush(d3.select(".brush").transition());
            brushed();
            draw();

            return(brush.extent())
        };
        function setYdomain(){
        // this function dynamically changes the y-axis to fit the data in focus

            // get the min and max date in focus
            var xleft = new Date(x.domain()[0]);
            var xright = new Date(x.domain()[1]);

            // a function that finds the nearest point to the right of a point
            var bisectDate = d3.bisector(function(d) { return d.month; }).right;

            // get the y value of the line at the left edge of view port:
            var iL = bisectDate(dataset, xleft);

            if (dataset[iL] !== undefined && dataset[iL-1] !== undefined) {

                var left_dateBefore = dataset[iL-1].month,
                    left_dateAfter = dataset[iL].month;

                var intfun = d3.interpolateNumber(dataset[iL-1].count, dataset[iL].count);
                var yleft = intfun((xleft-left_dateBefore)/(left_dateAfter-left_dateBefore));
            } else {
                var yleft = 0;
            }

            // get the x value of the line at the right edge of view port:
            var iR = bisectDate(dataset, xright);

            if (dataset[iR] !== undefined && dataset[iR-1] !== undefined) {

                var right_dateBefore = dataset[iR-1].month,
                    right_dateAfter = dataset[iR].month;

                var intfun = d3.interpolateNumber(dataset[iR-1].count, dataset[iR].count);
                var yright = intfun((xright-right_dateBefore)/(right_dateAfter-right_dateBefore));
            } else {
                var yright = 0;
            }

            // get the y values of all the actual data points that are in view
            var dataSubset = dataset.filter(function(d){ return d.month >= xleft && d.month <= xright; });
            var countSubset = [];
            dataSubset.map(function(d) {countSubset.push(d.count);});

            // add the edge values of the line to the array of counts in view, get the max y;
            countSubset.push(yleft);
            countSubset.push(yright);
            var ymax_new = d3.max(countSubset);

            if(ymax_new == 0){
                ymax_new = dataYrange[1];
            }

            // reset and redraw the yaxis
            y.domain([0, ymax_new*1.05]);
            focus.select(".y.axis").call(yAxis);

        };
        function scaleDate(d,i) {
        // action for buttons that scale focus to certain time interval

            var b = brush.extent(),
                interval_ms,
                brush_end_new,
                brush_start_new;

            if      (d == "Year")   { interval_ms =    31536000000}
            else if (d == "Six Month")  { interval_ms = 15768000000};

            if ( d == "Year" | d == "Six Month" )  {

                if((maxdate.getTime() - b[1].getTime()) < interval_ms){
                // if brush is too far to the right that increasing the right-hand brush boundary would make the chart go out of bounds....
                    brush_start_new = new Date(maxdate.getTime() - interval_ms); // ...then decrease the left-hand brush boundary...
                    brush_end_new = maxdate; //...and set the right-hand brush boundary to the maxiumum limit.
                } else {
                // otherwise, increase the right-hand brush boundary.
                    brush_start_new = b[0];
                    brush_end_new = new Date(b[0].getTime() + interval_ms);
                };

            } else if ( d == "Data")  {
                brush_start_new = dataXrange[0];
                brush_end_new = dataXrange[1]
            } else {
                brush_start_new = b[0];
                brush_end_new = b[1];
            };

            brush.extent([brush_start_new, brush_end_new]);

            // now draw the brush to match our extent
            brush(d3.select(".brush").transition());
            // now fire the brushstart, brushmove, and brushend events
            brush.event(d3.select(".brush").transition());
        };

            }
    function table(xf, data, selector){

        d3.select(selector).selectAll("*").remove();
        var good = [];
        for(var item in dataDIM.top(Infinity)){
            good.push(item)
        }

        tableData = [];
        data.forEach(function(d){
            if(d["id_vis"] in good){
                tableData.push(d)
            }
        })
        
        var columnsData = [
            // "FILTER",
            "coin",
            "open",
            "high",
            "low",
            "close",
            "trade_date",
            "volume_btc",
            "volume_usd"
        ]
        var columnsHead = [
            // "Filter Dashboard",
            "coin",
            "open",
            "high",
            "low",
            "close",
            "trade_date",
            "volume_btc",
            "volume_usd"
        ]

        function tabulate(data, columnsHead, columnsData) {

            var table = d3.select(selector)
                .append("table")
                .attr("id",'tableID')
                .attr("class", 'tableClass table table-striped table-bordered dt-responsive nowrap')
                .attr("callspacing", "0")
                .attr("width", "100%");

            var thead = table.append('thead');
            var	tbody = table.append('tbody');

            // append the header row
            thead.append('tr')
                .selectAll('th')
                .data(columnsHead)
                .enter()
                .append('th')
                .text(function (column) { return column; });

            // create a row for each object in the data
            var rows = tbody.selectAll('tr')
                .data(data)
                .enter()
                .append('tr');

            // create a cell in each row for each column
            var cells = rows.selectAll('td')
                .data(function (row) {
                    return columnsData.map(function (column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append('td')
                .html(function (d) {
                    if(d.value === ""){
                        return "Data not reported"
                    }else{
                        var item = d["value"]
                        var tststr = d["value"].toString().substring(0,4)
                        if(tststr === "http"){
                            return "<a target='_blank' href="+ d.value+'">'+d.value+"</a>"
                        }else{
                            return item
                        }

                    }

                });
        }
        tabulate(tableData, columnsHead, columnsData);

        var table = $(".tableClass").DataTable();

        };

    //selectOc(xf, "#chartSelect");
    //langChart(xf, "#chartA");
    //pubChart(xf, "#chartB");
    //speakChart(xf, "#chartC");
    //tableChart(xf, "#chartTable");
    //numChart(xf, "#chartD", "views", "User Views", "View Count");
    //numChart(xf, "#chartE", "comments", "User Comments", "Comment Count");
    //viewsCommsChart(xf, "#chartF");
    dc.chartRegistry.list().forEach(function(chart) {
        chart.on('filtered', function() {setTimeout(function(){
                table(xf, format_data, "#new");
            }, 1500);
        });
    });

    table(xf, format_data, "#new");

    d3.select(window).on("resize.one",function(){
                    //langsChart.width(parseInt(d3.select("#chartA").style("width"), 10)).redraw();
                    //pubDateChart.width(parseInt(d3.select("#chartB").style("width"), 10)).redraw();
                    //numSpeakChart.width(parseInt(d3.select("#chartC").style("width"), 10)).redraw();
                    //viewCommDateChart.width(parseInt(d3.select("#chartF").style("width"), 10)).redraw();
                    //selectOccu.width(parseInt(d3.select("#chartSelect").style("width"), 10)).redraw();
                });
    $('#new tbody').on('click','tr',function(){
        draw2(this)
    });

    function draw2(data){
        timeSeries(data, "#metric-modal")
    }

    draw2(format_data)

}