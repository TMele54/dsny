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

d3.request("/college-scorecard-dashboard-data").response(function (xhr) {return xhr.responseText}).get(function(data) {
        return draw(JSON.parse(data))
    });

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
    data_pie.forEach(function(d){counter = counter + d.values})
    data_pie.forEach(function(d){
            d.count = d.values;
            d.values = d.values / counter
        })

    var width_pie = 500, height_pie = 300, radius_pie = Math.min(width_pie, height_pie) / 2;

    var svg_pie = d3.select("#chartPie").append("svg")
                                            .attr('width',width_pie)
                                            .attr('height', height_pie).append("g")
                                            .attr("transform", "translate(" + width_pie / 2 + "," + height_pie / 2 + ")");

    svg_pie.append("g").attr("class", "slices");
    svg_pie.append("g").attr("class", "labels");
    svg_pie.append("g").attr("class", "lines");

    var pie_pie = d3.pie().sort(null).value(function(d) {return d.count;});
    var arc_pie = d3.arc().outerRadius(radius_pie * 0.8).innerRadius(radius_pie * 0.4);
    var outerArc_pie = d3.arc().innerRadius(radius_pie * 0.9).outerRadius(radius_pie * 0.9);

    var key_pie = function(d){ return d.data.key; };

    var color_pie = d3.scaleOrdinal().domain(["Male", "Female", "Male & Female"]).range(["#0059b3", "#3399ff", "#99ccff"]);

    change_pie(data_pie);

    function change_pie(data_pie) {

        /* ------- PIE SLICES -------*/
        var slice_pie = svg_pie.select(".slices").selectAll("path.slice").data(pie_pie(data_pie), key_pie);

        slice_pie.enter().insert("path").style("fill", function(d) { return color_pie(d.data.key); }).attr("class", "slice");

        slice_pie
            .transition()
            .duration(1000)
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
                var interpolate = d3.interpolate(this._current, d); ///this is the issue
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
//https://codepen.io/zakariachowdhury/pen/OWdyjq
function draw(data){
    var data = formatData(data);
    piechart(data)

}

