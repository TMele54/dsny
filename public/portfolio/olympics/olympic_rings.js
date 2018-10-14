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

            function drawLogo(rings){

                //Dimensions
                var margin = {top: 0, right: 10, bottom: 10, left: 0},
                        width = 400 - margin.left - margin.right,
                        height = 400 - margin.top - margin.bottom;

                //Vector Graphics
                var widthR =  width + margin.left + margin.right;
                var heightR = height + margin.top + margin.bottom;
                var svg = d3.select(element[0])
                            .append("svg").attr("id", "logoSVG")
                            .attr("viewBox", "0 0" + " " + widthR.toString() + " " + heightR.toString())
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .append("g").attr("id", "logoSVGg")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var colors = ["#0085c7","#f4c300","000000","#5fc384","#df0024"]

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

                var arcs =  d3.svg.arc()
                                        .innerRadius(function(d){return innerRadius(d)})
                                        .outerRadius(function(d){return outerRadius(d)})
                                        .startAngle(function(d){return startAngle(d)})
                                        .endAngle(function(d){return endAngle(d)})

                svg.selectAll(".arc")
                    .data(rings)
                    .enter()
                    .append("svg:path")
                    .attr("stroke", function(d){
                            return color(d)
                            })
                    .attr("stroke-width", function(d){
                            return stroke(d)
                            })
                    .attr("stroke-linecap", "butt")
                    .attr("stroke-linejoin", "miter")
                    .attr("fill", false)
                     //function(d){
                       //     return color(d)
                         //   })
                    .attr("id", function(d){
                            return identity(d)
                            })
                    .attr("transform", function (d){
                            var x = xPosition(d);
                            var y = yPosition(d);
                            return "translate("+x.toString()+","+y.toString()+")"
                            })
                    .attr("d", arcs)


                //Text
                var msg = "USA";

                var text = svg.append("text").attr("class","customfont")
                            .attr("x", 40)
                            .attr("y", 150)
                            .attr("textLength", width)
                            .attr("font-size", "100px")
                            .text(msg)
                            .attr("fill","#e0232c");

            }

            //Data Elements
            var rings = scope.data[0].rings


            drawLogo(rings)

         }
      };
      return directive;
   });

function Ctrl($scope) {
    //Data Elements

    var colors = ["#006aaf","#ffd900","#000000","#2c9e5e","#e0232c"];
    var pi = Math.PI;
    var thick = 12;
    function rads(angle){

        return angle * (pi/180)
    }

    var rings = [
        {"or":49, "ir":49, "sa": rads(0), "ea": rads(360), "dx":81,  "dy":222, "index": 0, "color": colors[0], "stroke": thick},
        {"or":49, "ir":49, "sa": rads(0), "ea": rads(360), "dx":141, "dy":272, "index": 1, "color": colors[1], "stroke": thick},
        {"or":49, "ir":49, "sa": rads(0), "ea": rads(360), "dx":201, "dy":222, "index": 2, "color": colors[2], "stroke": thick},
        {"or":49, "ir":49, "sa": rads(0), "ea": rads(360), "dx":258, "dy":272, "index": 3, "color": colors[3], "stroke": thick},
        {"or":49, "ir":49, "sa": rads(0), "ea": rads(360), "dx":319, "dy":222, "index": 4, "color": colors[4], "stroke": thick},

        {"or":49, "ir":49, "sa": rads(45), "ea": rads(135), "dx":81,  "dy":222, "index": 5, "color": colors[0], "stroke": thick},
        {"or":49, "ir":49, "sa": rads(45), "ea": rads(135),  "dx":201, "dy":222, "index": 6, "color": colors[2], "stroke": thick},
        {"or":49, "ir":49, "sa": rads(0), "ea": rads(45), "dx":141, "dy":272, "index": 7, "color": colors[1], "stroke": thick},
        {"or":49, "ir":49, "sa": rads(0), "ea": rads(45), "dx":258, "dy":272, "index": 8, "color": colors[3], "stroke": thick}
    ];

    $scope.rings = [{"rings": rings}];
}