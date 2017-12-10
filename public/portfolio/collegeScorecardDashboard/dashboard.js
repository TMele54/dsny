var example= {
"ADM_RATE": 0.6538,
"AGE_ENTRY": "20.277133825",
"ALIAS": "AAMU",
"AVGFACSAL": 7017.0,
"CITY": "Normal",
"COSTT4_A": 20809.0,
"COSTT4_P": "",
"CURROPER": 1,
"GRADS": 1123.0,
"INSTNM": "Alabama A & M University",
"INSTURL": "www.aamu.edu/",
"LATITUDE": 34.783367999999996,
"LOAN_EVER": "0.8963821567",
"LONGITUDE": -86.568502,
"MAIN": 1,
"MENONLY": 0.0,
"NUMBRANCH": 1,
"PELL_EVER": "0.8609062171",
"PFTFAC": 0.7096,
"REGION": 5,
"SAT_AVG": 850.0,
"SCH_DEG": 3.0,
"STABBR": "AL",
"TUITFTE": 9657.0,
"TUITIONFEE_IN": 9366.0,
"TUITIONFEE_OUT": 17136.0,
"UNITID": 100654,
"WOMENONLY": 0.0,
"ZIP": "35762"
};
var definitions = {
"ADM_RATE": "Admission rate",
"AGE_ENTRY": "Average age of entry",
"ALIAS": "Institution name aliases",
"AVGFACSAL": "Average faculty salary",
"CITY": "City",
"COSTT4_A": "Average cost of attendance (academic year institutions)",
"COSTT4_P": "Average cost of attendance (program-year institutions)",
"CURROPER": "Flag for currently operating institution, 0=closed, 1=operating",
"GRADS": "Number of graduate students",
"INSTNM": "Institution name",
"INSTURL": "URL for institution's homepage",
"LATITUDE": "Latitude",
"LOAN_EVER": "Share of students who received a federal loan while in school",
"LONGITUDE": "Longitude",
"MAIN": "Flag for main campus",
"MENONLY": "Flag for men-only college",
"NUMBRANCH": "Number of branch campuses",
"PELL_EVER": "Share of students who received a Pell Grant while in school",
"PFTFAC": "Proportion of faculty that is full-time",
"REGION": "Region (IPEDS)",
"SAT_AVG": "Average SAT equivalent score of students admitted",
"SCH_DEG": "Predominant degree awarded (recoded 0s and 4s)",
"STABBR": "State postcode",
"TUITFTE": "Net tuition revenue per full-time equivalent student",
"TUITIONFEE_IN": "In-state tuition and fees",
"TUITIONFEE_OUT": "Out-of-state tuition and fees",
"UNITID": "Unit ID for institution",
"WOMENONLY": "Flag for women-only college",
"ZIP": "ZIP code"
};


function formatData(data){
    data.forEach(function(d){

        //Gender
        if(d["MENONLY"] == 1.0)[
            d["Gender"] = "Male"
        ]
        else if(d["WOMENONLY"] == 1.0){
            d["Gender"] = "Female"

        }
        else{
            d["Gender"] = "Male & Female"
        }


    });
    return data

}
function piechart(data){

    data_pie = d3.nest().key(function(d) { return d["Gender"]; }).sortKeys(d3.ascending)
        .rollup(function(leaves) { return leaves.length; })
        .entries(data);
    var counter = 0;
    data_pie.forEach(function(d){counter = counter + d.values});
    data_pie.forEach(function(d) {
        d.count = d.values;
        d.values = d.values / counter
    }  );

    var width_pie = 500, height_pie = 300, radius_pie = Math.min(width_pie, height_pie) / 2;

    var svg_pie = d3.select("#chartPie").append("svg")
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
function piechart2(){
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
    drawD3PieChart("#chartPie", st.data);
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

}

function mapchart(mapData){


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
            console.log(" scale: " + scale);
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
            console.log(" Number of removed  points: " + counter);
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
                    console.log(" width: " + node.width + "height: " + node.height);
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

        var leafletMap = L.map('map').setView([25, 0], 1);

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


            console.log("updated at  " + new Date().setTime(new Date().getTime() - start.getTime()) + " ms ");

        }
        function mapmove(e) {
            var mapBounds = leafletMap.getBounds();
            var subset = search(qtree, mapBounds.getWest(), mapBounds.getSouth(), mapBounds.getEast(), mapBounds.getNorth());

            console.log("subset: " + subset.length);

            redrawSubset(subset);

        }

}













function draw(data){
    mapchart(data)
    var piechartData = formatData(data);
    piechart(piechartData)
}


d3_4.request("/college-scorecard-dashboard-data").response(function (xhr) {return xhr.responseText}).get(function(data) {
        return draw(JSON.parse(data))
    });
