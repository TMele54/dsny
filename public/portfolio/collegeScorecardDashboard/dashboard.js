var dictionarySample = {
    "ADM_RATE": 0.6538,                   // "Admission rate"
    "AGE_ENTRY": "20.277133825",          // "Average age of entry"
    "ALIAS": "AAMU",                      // "Institution name aliases"
    "AVGFACSAL": 7017.0,                  // "Average faculty salary"
    "CITY": "Normal",                     // "City"
    "COSTT4_A": 20809.0,                  // "Average cost of attendance (academic year institutions)"
    "COSTT4_P": "",                       // "Average cost of attendance (program-year institutions)"
    "CURROPER": 1,                        // "Flag for currently operating institution, 0=closed, 1=operating"
    "GRADS": 1123.0,                      // "Number of graduate students"
    "INSTNM": "Alabama A & M University", // "Institution name"
    "INSTURL": "www.aamu.edu/",           // "URL for institution's homepage"
    "LATITUDE": 34.783367999999996,       // "Latitude"
    "LOAN_EVER": "0.8963821567",          // "Share of students who received a federal loan while in school"
    "LONGITUDE": -86.568502,              // "Longitude"
    "MAIN": 1,                            // "Flag for main campus"
    "MENONLY": 0.0,                       // "Flag for men-only college"
    "NUMBRANCH": 1,                       // "Number of branch campuses"
    "PELL_EVER": "0.8609062171",          // "Share of students who received a Pell Grant while in school"
    "PFTFAC": 0.7096,                     // "Proportion of faculty that is full-time"
    "REGION": 5,                          // "Region (IPEDS)"
    "SAT_AVG": 850.0,                     // "Average SAT equivalent score of students admitted"
    "SCH_DEG": 3.0,                       // "Predominant degree awarded (recoded 0s and 4s)"
    "STABBR": "AL",                       // "State postcode"
    "TUITFTE": 9657.0,                    // "Net tuition revenue per full-time equivalent student"
    "TUITIONFEE_IN": 9366.0,              // "In-state tuition and fees"
    "TUITIONFEE_OUT": 17136.0,            // "Out-of-state tuition and fees"
    "UNITID": 100654,                     // "Unit ID for institution"
    "WOMENONLY": 0.0,                     // "Flag for women-only college"
    "ZIP": "35762"                        // "ZIP code"
};

function formatData(data){
    data.forEach(function(d){

        //Gender
        if(d["MENONLY"] == 1.0) {
            d["Gender"] = "Male or Female";
            d["MENONLY"] = "True";
            d["WOMENONLY"] = "False";
        }
        else if(d["WOMENONLY"] == 1.0){
            d["Gender"] = "Male or Female"
            d["WOMENONLY"] = "True";
            d["MENONLY"] = "False";
        }
        else{
            d["Gender"] = "Coed";
            d["MENONLY"] = "False";
            d["WOMENONLY"] = "False";
        }
        d["FILTER"] = '<input type="checkbox"'+' data="'+ d["UNITID"]+ '" name="name1" />&nbsp;'

    });
    return data

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
function piechart2(data, selector){
    var st = {};
    st.data = [
        {
            "label": "less than a week",
            "value": 169,
            "pos": 0
        },
        {
            "label": "1 week - 30 days",
            "value": 1,
            "pos": 1
        },
        {
            "label": "30 - 90 days",
            "value": 22,
            "pos": 2
        },
        {
            "label": "90 - 180 days",
            "value": 35,
            "pos": 3
        },
        {
            "label": "180 days - 1 year",
            "value": 47,
            "pos": 4
        },
        {
            "label": "more than 1 year",
            "value": 783,
            "pos": 5
        }
    ];
    drawD3PieChart(selector, st.data);
    //http://jsfiddle.net/RodEsp/fdzbv6vg/4/
    function drawD3PieChart(sel, data) {
        // clear any previously rendered svg
        $(sel + " svg").remove();
        // compute total
        tot = 0;
        data.forEach(function(e){ tot += e.value; });
        var w = $(sel).width();
        var h = $(sel).height();
        var r = Math.min(w, h)/2;
        var color = d3.scale.category20c();
        var vis = d3.select(sel)
            .append("svg:svg")
            .attr("data-chart-context",sel)
            .data([data])
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(" + (w / 2) + "," + r + ")");

        var svgParent = d3.select("svg[data-chart-context='" + sel + "']");
        var pie = d3.layout.pie().value(function(d){return d.value;});
        var arc = d3.svg.arc().outerRadius(r);
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class","slice");
        arcs.append("svg:path")

            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", "0")
            .attr("d", function(d) {
                return arc(d);
            })
            .attr("data-legend",function(d) { return d.data.label; })
            .attr("data-legend-pos",function(d) { return d.data.pos; })
            .classed("slice",true)
            .attr("style","cursor:pointer;")
            .append("svg:title")
            .text(function(d) { return d.data.label; });

        arcs.append("svg:text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                return (data[i].value / tot ) * 100 > 10 ? ((data[i].value / tot ) * 100).toFixed(1) + "%" : "";
            }
        ).attr("fill","#fff")
            .classed("slice-label",true);

        vis.selectAll('g.slice')
            .on('mouseover',function(d,i){
                d3.select(this)
                    .attr("fill-opacity", ".8")
                    .transition()
                    .duration(500)
                    .attr("transform",function(d){
                        d.data._expanded = true;
                        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                        var x = Math.cos(a) * 20;
                        var y = Math.sin(a) * 20;
                        return 'translate(' + x + ',' + y + ')';
                    });
            })
            .on('mouseout',function(d,i){
                d3.select(this)
                    .attr("fill-opacity", "1")
                    .transition()
                    .duration(500)
                    .attr("transform",function(d){
                        d.data._expanded = false;
                        return 'translate(0,0)';
                    });
            });

        var legend = svgParent.append("g")
            .attr("class","legend")
            .style("font-size","12px")
            .call(d3.legend);
        legend.attr("transform", "translate(" + ((w / 2) - (legend.node().getBBox().width / 2.5)).toString()  + "," + (vis.node().getBBox().height + 40).toString() + ")");
        legend.selectAll('text').on("mouseover", function(d, i) {
            d3.select(vis.selectAll('g.slice')[0][i])
                .attr("fill-opacity", ".8")
                .transition()
                .duration(500)
                .attr("transform",function(d){
                    d.data._expanded = true;
                    var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
                    var x = Math.cos(a) * 20;
                    var y = Math.sin(a) * 20;
                    return 'translate(' + x + ',' + y + ')';
                });
        });
        legend.selectAll('text').on("mouseout", function(d, i) {
            d3.select(vis.selectAll('g.slice')[0][i])
                .attr("fill-opacity", "1")
                .transition()
                .duration(500)
                .attr("transform",function(d){
                    d.data._expanded = false;
                    return 'translate(0,0)';
                });
        });
    }

};
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
function table(data, selector){

    var columnsData = [
        // "FILTER",
        "INSTNM",
        "CURROPER",
        "MAIN",
        "NUMBRANCH",
        "TUITIONFEE_IN",
        "TUITIONFEE_OUT",
        "LOAN_EVER",
        "ADM_RATE",
        "SAT_AVG",
        "AGE_ENTRY",
        "MENONLY",
        "WOMENONLY",
        "INSTURL"
    ]
    var columnsHead = [
        // "Filter Dashboard",
        "Institution Name",
        "Operating",
        "Main Campus",
        "Brances",
        "In State Tuition",
        "Out of State Tuition",
        "% of Students w/ Loans",
        "Admission Rate",
        "Average Admitted SAT Score",
        "Average Age of Entry",
        "Men Only",
        "Women Only",
        "URL"
    ]

    function tabulate(data, columnsHead, columnsData) {
        var table = d3.select(selector)//.append('table').attr("class", 'tableClass');
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
            .text(function (d) {
                if(d.value == ""){
                    return "Data not reported"
                }else{
                    return d.value
                }

            });
        $('.tableClass').DataTable();
        return table;
    }
    tabulate(data, columnsHead, columnsData)
};
function histogramChart(data, selector, resize, histSvgID){
    var _data = [];
    data.forEach(function(d,i){
        if(d["SAT_AVG"] != ""){
            _data.push(parseFloat(d["SAT_AVG"])/1600.)
        }
    });
    var formatCount = d3_4.format(",.0f");

    sliderH = d3.select('#sliderHisto').call(d3.slider().axis(true).min(5).max(100).step(10).value(5)
        .on("slide", function(evt, value) {
            resizeHisto(parseInt(value))
        })
    )

    hist_svg = d3_4.select(selector).append("svg").attr("id", histSvgID).attr('width', "100%").attr('height', "250px");
    hist_margin = {top: 10, right: 15, bottom: 30, left: 15};
    hist_width = parseInt(d3.select(selector).style("width"), 10) - hist_margin.left - hist_margin.right;
    hist_height = 250 - hist_margin.top - hist_margin.bottom;
    hist_g = hist_svg.append("g").attr("transform", "translate(" + hist_margin.left + "," + hist_margin.top + ")");

    hist_x = d3_4.scaleLinear().rangeRound([0, hist_width]);
    hist_bins = d3_4.histogram().domain(hist_x.domain()).thresholds(hist_x.ticks(10))(_data);

    hist_y = d3_4.scaleLinear().domain([0, d3_4.max(hist_bins, function(d) { return d.length; })]).range([hist_height, 0]);


    hist_tipBox = d3.tip().attr('class', 'd3-tip').offset([-10, 0])
        .html(function(d)
        {
            return "<strong>Count:</strong> <span style='color:red'>" +" "+ ""  + "</span><br>"
        });
    //hist_svg.call(hist_g);

    hist_bar = hist_g.selectAll(".bar").data(hist_bins).enter().append("g").attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + hist_x(d.x0) + "," + hist_y(d.length) + ")"; })

    hist_bar.append("rect").attr("x", function(d,i){return 2})
        .attr("width", hist_x(hist_bins[0].x1) - hist_x(hist_bins[0].x0) - 2).style("margin-top", "10px")
        .attr("height", function(d) { return hist_height - hist_y(d.length); })
        .on("mouseover", function(d){
            d3.select(this).attr("fill-opacity", ".5").transition().duration(500)
        })
        .on("mouseout", function(d){
            d3.select(this).attr("fill-opacity", "1").transition().duration(500)
        })
    //d3.select(this).attr("fill-opacity", ".5").transition().duration(500);
    //d3.select(this).attr("fill-opacity", "1").transition().duration(500)
    //hist_bar.append("text").attr("dy", ".75em").attr("y", 6)
    //.attr("x", (hist_x(hist_bins[0].x1) - hist_x(hist_bins[0].x0)) / 2)
    //.attr("text-anchor", "middle").text(function(d) { return formatCount(d.length); }).style("color", "black");

    hist_g.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + hist_height + ")").call(d3_4.axisBottom(hist_x));

    function resizeHisto(bins) {
        if(bins === null){
            bins = 10;
        }
        d3_4.select("#"+histSvgID).selectAll("*").remove();

        hist_svg = d3_4.select("#"+histSvgID).attr("id", histSvgID).attr('width', "100%").attr('height', "250px");
        hist_margin = {top: 10, right: 15, bottom: 30, left: 15};
        hist_width = parseInt(d3.select(selector).style("width"), 10) - hist_margin.left - hist_margin.right;
        hist_height = 250 - hist_margin.top - hist_margin.bottom;
        hist_g = hist_svg.append("g").attr("transform", "translate(" + hist_margin.left + "," + hist_margin.top + ")");

        hist_x = d3_4.scaleLinear().rangeRound([0, hist_width]);
        hist_bins = d3_4.histogram().domain(hist_x.domain()).thresholds(hist_x.ticks(bins))(_data);

        hist_y = d3_4.scaleLinear().domain([0, d3_4.max(hist_bins, function(d) { return d.length; })]).range([hist_height, 0]);


        hist_tipBox = d3.tip().attr('class', 'd3-tip').offset([-10, 0])
            .html(function(d)
            {
                return "<strong>Count:</strong> <span style='color:red'>" +" "+ ""  + "</span><br>"
            });
        ///hist_svg.call(hist_g);

        hist_bar = hist_g.selectAll(".bar").data(hist_bins).enter().append("g").attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + hist_x(d.x0) + "," + hist_y(d.length) + ")"; })

        hist_bar.append("rect").attr("x", function(d,i){return 2})
            .attr("width", hist_x(hist_bins[0].x1) - hist_x(hist_bins[0].x0) - 2).style("margin-top", "10px")
            .attr("height", function(d) { return hist_height - hist_y(d.length); })
            .on("mouseover", function(d){
                d3.select(this).attr("fill-opacity", ".5").transition().duration(500)
            })
            .on("mouseout", function(d){
                d3.select(this).attr("fill-opacity", "1").transition().duration(500)
            });

        //hist_bar.append("text").attr("dy", ".75em").attr("y", 6)
        //.attr("x", (hist_x(hist_bins[0].x1) - hist_x(hist_bins[0].x0)) / 2)
        //.attr("text-anchor", "middle").text(function(d) { return formatCount(d.length); });

        hist_g.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + hist_height + ")").call(d3_4.axisBottom(hist_x));

    }
    d3.select(window).on(resize, resizeHisto);
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


function draw(data){
    var piechartData = formatData(data);
    table(data, "#tableID");
    mapchart(data, "mapID");
    histogramChart(data, "#chartHisto", "resize.one", "histSVG");
    scatterChart(data, "#scatterChartA", "in", "resize.two", "scatterSVGA");
    scatterChart(data, "#scatterChartB", "out", "resize.three", "scatterSVGB");
    piechart(piechartData, "#chartPie", "resize.four");
}


d3_4.request("/college-scorecard-dashboard-data").response(function (xhr) {return xhr.responseText}).get(function(data) {
    return draw(JSON.parse(data))
});
