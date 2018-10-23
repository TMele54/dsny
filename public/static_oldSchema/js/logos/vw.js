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

            function drawLogo(ring,circle,lines,treads){

                //Dimensions
                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                        width = 400 - margin.left - margin.right,
                        height = 600 - margin.top - margin.bottom;

                //Vector Graphics
                var widthR =  width + margin.left + margin.right;
                var heightR = height + margin.top + margin.bottom;
                var svg = d3.select(element[0])
                            .append("svg").attr("id", "logoSVG")
                            .attr("viewBox", "0 0" + " " + widthR.toString() + " " + heightR.toString())
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .append("g").attr("id", "logoSVGg")
                            .append("g").attr("id", "logoSVGg2")
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
                var polyline =    function(points){
                                        those = " "
                                            points.forEach(function(d,i){
                                                i = i.toString()
                                                x = "p"+i+"y"
                                                y = "p"+i+"x"
                                                those = those + d[y].toString()+","+d[x].toString() + " "
                                            })
                                        return those
                                    }

                //arc
                var arcs =  d3.svg.arc()
                                        .innerRadius(function(d){return innerRadius(d)})
                                        .outerRadius(function(d){return outerRadius(d)})
                                        .startAngle(function(d){return startAngle(d)})
                                        .endAngle(function(d){return endAngle(d)})

                svg.selectAll('.dot')
                    .data(circle)
                    .enter()
                    .append("circle").attr("id", "circle0")       // attach a circle
                    .attr("cx", function(d){return xPosition(d)})           // position the x-centre
                    .attr("cy", function(d){return yPosition(d)})
                    .attr("r", function(d){return outerRadius(d)})
                    .style("stroke", function(d){return color(d)})
                    .style("fill", function(d){return color(d)})

                svg.selectAll('.poly')
                    .data(lines)
                    .enter()
                    .append("polyline").attr("id","lines0")
                    .style("stroke", "red")
                    .style("fill", "none")
                    .style("stroke-width", 19)
                    .style("stroke-linejoin", "bevel")  // shape the line join
                    .attr("points", function(d){return polyline(d)});

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
                    .attr("fill", function(d){
                            return color(d)
                            })
                    .attr("id", function(d){
                            return identity(d)
                            })
                    .attr("transform", function (d){
                            var x = xPosition(d);
                            var y = yPosition(d);
                            return "translate("+x.toString()+","+y.toString()+")"
                            })
                    .attr("d", arcs)



                function drive(){


                    svg.selectAll(".arc")
                        .data(treads)
                        .enter()
                        .append("svg:path").attr("id", "treads0")
                        .attr("stroke", function(d){
                                return color(d)
                                })
                        .attr("stroke-width", function(d){
                                return stroke(d)*10
                                })
                        .style("stroke-dasharray", ("4, 4"))
                        .attr("fill", function(d){
                                return color(d)
                                })
                        .attr("id", function(d){
                                return identity(d)
                                })
                        .attr("transform", function (d){
                                var x = xPosition(d);
                                var y = yPosition(d);
                                return "translate("+x.toString()+","+y.toString()+")"
                                })
                        .attr("d", arcs)
                       // d3.select("#logoSVGg")
                            .call(spin, 8000);

                        i = 1;
                        function spin(selection, duration) {

                            selection.transition()
                                .ease("linear")
                                .duration(duration)
                                .attrTween("transform", function() {
                                    i =  i +500;
                                    val = 100 + i
                                    //return d3.interpolateString("translate(100,100)rotate(0)", "translate("+val.toString()+",100)rotate(360)")
                                    return d3.interpolateString("translate(100,100)rotate(0)", "translate(100,100)rotate(360)")
                                });

                            setTimeout(function() { spin(selection, duration); }, duration);
                        }


                }

                setTimeout(function(d){
                    drive()
                }, 2000);

                setTimeout(function(){
                   /* d3.select("#logoSGVg")
                        .transition()
                        .duration(1000)
                        .delay(500)
                        .attr("transform", function(){return "translate(1000,0)"} )
*/
                },5000)

            }

            //Data Elements
            var ring = scope.data[0].ring;
            var circle = scope.data[0].circle;
            var lines = scope.data[0].lines;
            var treads = scope.data[0].treads;

            drawLogo(ring,circle,lines,treads)

         }
      };
      return directive;
   });

function Ctrl($scope) {
    //Data Elements

    var colors = ["#000000"];
    var pi = Math.PI;
    var thick = 1;
    function rads(angle){
        return angle * (pi/180)
    }

    var circle = [{"dx":100, "dy":100, "or":70, "color": colors[0]}];
    var ring = [
    {"or":97, "ir":89, "sa": rads(0), "ea": rads(360), "dx":100, "dy":100, "index": 0, "color": "black", "stroke": thick},
    {"or":88, "ir":69, "sa": rads(0), "ea": rads(360), "dx":100, "dy":100, "index": 1, "color": "red", "stroke": thick}
                 ]
    var lines = [
                    [
                        {"p0y": 34, "p0x": 70},
                        {"p1y": 97, "p1x": 100},
                        {"p2y": 34, "p2x": 130}
                    ],
                    [
                        {"p0y": 60, "p0x": 34},
                        {"p1y": 163, "p1x": 76},
                        {"p2y": 109, "p2x": 100},
                        {"p3y": 163, "p3x": 123},
                        {"p4y": 60, "p4x": 167}
                    ],

                 ];
    var treads = [{"or":102, "ir":97, "sa": rads(0), "ea": rads(360), "dx":100,
                 "dy":100, "index": 2, "color": "black", "stroke": thick}]

    $scope.vw = [{"circle": circle, "ring": ring, "lines": lines, "treads": treads}];
}