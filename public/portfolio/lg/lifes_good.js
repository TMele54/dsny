//https://www.sessions.edu/color-calculator/

angular.module('companyLogo', []).
   //camel cased directive name
   //in your HTML, this will be named as bars-chart
   directive('logo', function ($parse) {
        var directive = {
         restrict: 'E',
         replace: false,
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {

            function drawLogo(ring,circle,eye,lines,pman){

                //Dimensions
                var margin = {top: 0, right: 10, bottom: 10, left: 10},
                        width = 400 - margin.left - margin.right,
                        height = 300 - margin.top - margin.bottom;

                //Vector Graphics
                var widthR =  width + margin.left + margin.right;
                var heightR = height + margin.top + margin.bottom;
                var svg = d3.select(element[0])
                            .append("svg").attr("id", "logoSVG")
                            .attr("viewBox", "0 0" + " " + widthR.toString() + " " + heightR.toString())
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .append("g").attr("id", "logoSVGg")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //Node Functions
                var xPosition =   function(d){ return d["dx"]}
                var yPosition =   function(d){ return d["dy"]}
                var innerRadius = function(d){ return d["ir"]}
                var outerRadius = function(d){ return d["or"]}
                var startAngle =  function(d){ return d["sa"]}
                var endAngle =    function(d){ return d["ea"]}
                var color =       function(d){ return d["color"]}
                var identity =    function(d){ return "arc" + d["index"].toString()}
                var stroke =      function(d){ return d["stroke"]}
                var x =           function(d){ return d["x"]}
                var y =           function(d){ return d["y"]}


                //background
                svg.selectAll(".dot")
                    .data(circle)
                    .enter()
                    .append("circle").attr("id","circle0")
                    .attr("cx", function(d){return  xPosition(d)})
                    .attr("cy", function(d){return yPosition(d)})
                    .attr("r",  function(d){return outerRadius(d)})
                    .style("fill", function(d){return color(d)});

                //eye
                 svg.selectAll(".dot")
                    .data(eye)
                    .enter()
                    .append("ellipse").attr("id","eye0")
                    .attr("cx", function(d){return  xPosition(d)})
                    .attr("cy", function(d){return yPosition(d)})
                    .attr("rx",  function(d){return outerRadius(d)})
                    .attr("ry",  function(d){return outerRadius(d)})
                    .style("fill", function(d){return color(d)});

                //arc
                var arcs =  d3.svg.arc()
                                        .innerRadius(function(d){return innerRadius(d)})
                                        .outerRadius(function(d){return outerRadius(d)})
                                        .startAngle(function(d){return startAngle(d)})
                                        .endAngle(function(d){return endAngle(d)})

                svg.selectAll(".arc")
                    .data(ring)
                    .enter()
                    .append("svg:path").attr("id", "arc0")
                    .attr("stroke", function(d){
                            return color(d)
                            })
                    .attr("stroke-width", function(d){
                            return stroke(d)
                            })
                    .attr("stroke-linecap", "butt")
                    .attr("stroke-linejoin", "miter")
                    .attr("fill", false)
                    .attr("id", function(d){
                            return identity(d)
                            })
                    .attr("transform", function (d){
                            var x = xPosition(d);
                            var y = yPosition(d);
                            return "translate("+x.toString()+","+y.toString()+")"
                            })
                    .attr("d", arcs)


                //Lines
                var line = d3.svg.line()
                                .x(function(d){return x(d);})
                                .y(function(d){return y(d);})
                                .interpolate("linear");

                lines.forEach(function(d,i){
                    svg.append("path").attr("id", "line" + i.toString() )
                                    .attr("d", line(d))
                                    .style("stroke-width", 6)
                                    .style("stroke", "white")
                                    .style("fill", "none");
                })


                //Animate
                d3.select("#line0")
                    .transition()
                    .delay(2000)
                    .duration(500)
                    .attr("transform", "translate(0 ,-30)")

                d3.select("#line1")
                    .transition()
                    .delay(2000)
                    .duration(500)
                    .attr("transform", "translate(0 ,-30)")

                 d3.select("#line0")
                    .transition()
                    .delay(3000)
                    .duration(500)
                    .style("stroke", "black")

                d3.select("#line1")
                    .transition()
                    .delay(3000)
                    .duration(500)
                    .style("stroke", "black")

                d3.select("#line2")
                    .transition()
                    .delay(3000)
                    .duration(500)
                    .style("stroke", "black")

                d3.select("#circle0")
                    .transition()
                    .delay(3000)
                    .duration(500)
                    .style("fill", "white").remove();

                d3.select("#eye0")
                    .transition()
                    .delay(3000)
                    .duration(500)
                    .style("fill", "black")
                    .attr("r", 6);

                d3.select("#arc0")
                    .transition()
                    .delay(3000)
                    .duration(500)
                    .style("stroke", "black");

                // Returns a tween for a transition’s "d" attribute, transitioning any selected
                // arcs from their current angle to the specified new angle.
                function chomp(newAngle) {
                    return function(d) {
                    var interpolate = d3.interpolate(d.endAngle, newAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                                return arcs(d);
                                };
                            };
                }
                function callChomp(){
                    var tau = 2 * Math.PI;
                    d3.select("#arc0")
                            .transition()
                            .duration(750)
                            .attrTween("d", chomp(67 * tau));
                }

                function newpath(){
                    svg.selectAll("path").remove("*")
                    svg.selectAll("ellipse").remove("*")

                    //arc
                    var arcs =  d3.svg.arc().innerRadius(function(d){return innerRadius(d)})
                                            .outerRadius(function(d){return outerRadius(d)})
                                            .startAngle(function(d){return startAngle(d)})
                                            .endAngle(function(d){return endAngle(d)})


                    svg.selectAll(".arc")
                        .data(pman)
                        .enter()
                        .append("svg:path").attr("id", "arc0")
                        .attr("stroke", function(d){
                                return color(d)
                                })
                        .attr("stroke-width", function(d){
                                return stroke(d)
                                })
                        .attr("stroke-linecap", "butt")
                        .attr("stroke-linejoin", "miter")
                        .attr("fill", "yellow")
                        .attr("id", function(d){
                                return identity(d)
                                })
                        .attr("transform", function (d){
                                var x = xPosition(d);
                                var y = yPosition(d);
                                return "translate("+x.toString()+","+y.toString()+")"
                                })
                        .attr("d", arcs)


                    //eye
                 svg.selectAll(".dot")
                        .data(eye)
                        .enter()
                        .append("ellipse").attr("id","eye1")
                        .attr("cx", function(d){return  xPosition(d)})
                        .attr("cy", function(d){return yPosition(d)})
                        .attr("rx",  6)
                        .attr("ry",  6)
                        .style("fill", "black");

                var pi = Math.PI;
                function rads(angle){
                    return angle * (pi/180)
                }

                var open = arcs.startAngle(rads(70)).endAngle(rads(390))

                d3.select("#arc0")
                    .transition()
                    .delay(1000)
                    .duration(500)
                        .attr("stroke-width", function(d){
                                return stroke(d) - 4
                                })
                    .attr("transform", function (d){
                                var x = xPosition(d);
                                var y = yPosition(d);
                                return "translate("+x.toString()+","+y.toString()+")"+" rotate(45)"})
                    .attr("d", open)

                d3.select("#eye1")
                    .transition()
                    .delay(1000)
                    .duration(500)
                    .attr("transform", "translate(40,-10)")
/*
                var closed = arcs.startAngle(rads(359.999)).endAngle(rads(0.111))


                d3.select("#arc0")
                    .transition()
                    .delay(2000)
                    .duration(1000)
                    .attr("d", closed)

                    .attr("transform", function (d){
                                var x = xPosition(d);
                                var y = yPosition(d);
                                return "translate("+x.toString()+","+y.toString()+")"+" rotate(90)"})
*/
                //var open = arcs.startAngle(rads(70)).endAngle(rads(390))

                //d3.select("#arc0")
                //    .transition()
                //    .delay(3000)
                //    .duration(1000)
                //    .attr("d", arcs)


                d3.select("#eye1")
                    .transition()
                    .delay(2000)
                    .duration(100)
                    .attr("rx", 7)
                    .attr("ry",  1)

                d3.select("#eye1")
                    .transition()
                    .delay(2100)
                    .duration(100)
                    .attr("rx", 6)
                    .attr("ry",  6)



                }

                setTimeout(newpath,4500)


            }

            //Data Elements
            var ring = scope.data[0].ring
            var circle = scope.data[0].circle
            var eye = scope.data[0].eye
            var lines = scope.data[0].lines
            var pman = scope.data[0].pman

            drawLogo(ring,circle,eye,lines,pman)

         }
      };
      return directive;
   });

function Ctrl($scope) {
    //Data Elements

    var colors = ["#c8135c"];
    var pi = Math.PI;
    var thick = 6;
    function rads(angle){
        return angle * (pi/180)
    }

    var circle = [{"dx":200, "dy":150, "or":75, "color": colors[0]}];

    var ring = [{"or":60, "ir":60, "sa": rads(90), "ea": rads(362), "dx":200,
                 "dy":150, "index": 0, "color": "white", "stroke": thick}]

    var eye = [{"dx":175, "dy":127, "or":10, "color": "white"}]

    var lines = [
                    [
                        {"x": 199, "y": 118},
                        {"x": 199, "y": 183}
                    ],
                    [
                        {"x": 199, "y": 180},
                        {"x": 216, "y": 180}
                    ],
                    [
                        {"x": 216, "y": 150},
                        {"x": 263, "y": 150}
                    ]
                 ];


    var pman = [{"or":60, "ir":0, "sa": rads(90), "ea": rads(360), "dx":200,
                 "dy":150, "index": 0, "color": "black", "stroke": thick}]

    $scope.rings = [{"circle": circle, "ring": ring, "eye": eye, "lines":lines, "pman": pman}];
}