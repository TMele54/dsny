//https://www.sessions.edu/color-calculator/

angular.module('companyLogo', []).
   //camel cased directive name
   //in your HTML, this will be named as bars-chart
   directive('nebulaLogo', function ($parse) {
     var directive = {
         restrict: 'E',
         replace: false,
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {

            function drawLogo(nodes, links){
                //Dimensions
                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                        width = 556 - margin.left - margin.right,
                        height = 250 - margin.top - margin.bottom;

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
                var xPosition = function (d){return d["x"]}
                var yPosition = function (d){return d["y"]}
                var radius =    function(d){ return d["r"]}

                //Events
                function mouseoverC() {

                    function add(a, b) {
                        return a + b;

                    }
                    function contains(a, obj) {
                        var i = a.length;
                        while (i--) {
                           if (a[i] === obj) {
                               return true;
                           }
                        }
                        return false;
                    }

                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .style("stroke", function (d){ return "#f85a48"})
                        .style("stroke-width", function (d){ return 4});

                    var point = [d3.select(this)[0][0]["__data__"].index]
                    var touched = [point];
                    function spasm(ind,i,delta){

                            ind = "#circle"+ind.toString()


                            d3.select(ind)
                                .transition()
                                .delay(1000 + delta*i)
                                .duration(1000)
                                .style("stroke", function (d){ return "#f85a48"})
                                .style("stroke-width", function (d){ return 4});

                            d3.select(ind)
                                .transition()
                                .delay(2000 + delta*i)
                                .duration(1000)
                                .style("stroke", function (d){ return "#48B3F8"})
                                .style("stroke-width", function (d){ return 0})
                    }
                    function next(ind){

                        ind.forEach(function(d){
                            t = nodes[d].touches

                            t.forEach(function(e,i){
                                    if (contains(t, touched ) != true){
                                        spasm(e,i,50)
                                    }
                            })


                            touched.push(t)
                        })

                        while(touched.reduce(add, 0) < 36){
                            next(t)
                        }


                    }

                    next(point)


                }
                function mouseoutC() {
                   d3.selectAll("circle").transition().duration(1000)
                        .style("stroke", function (d){ return "#48B3F8"})
                        .style("stroke-width", function (d){ return 0})

                }

                //Links
                var links = svg.selectAll(".line")
                        .data(links)
                        .enter()
                        .append("line")
                        .attr("id", function(d){ var begin = d.a;var end = d.b; return "line"+ begin.toString() + end.toString()} )
                        .attr("x1", function(d) { return width / 2; })
                        .attr("y1", function(d) { return height / 2; })
                        .attr("x2", function(d) { return width / 2; })
                        .attr("y2", function(d) { return height / 2; })
                        .attr("stroke-width", 12)
                        .style("stroke", function (d){ return "#48B3F8"})

                //Nodes
                var circles = svg.selectAll(".dot")
                        .data(nodes)
                        .enter()
                        .append("circle")
                        .attr("id", function(d){ var id = d.index; return "circle"+ id.toString()} )
                        .attr("class", "dot")
                        .attr("cx", function (d) { return width / 2; })
                        .attr("cy", function (d) { return height / 2; })
                        .attr("r",  function (d) { return 0; })
                        .style("fill", function (d){ return "#48B3F8"})
                        .style("stroke", function (d){ return "#48B3F8"})
                        .on("mouseover", mouseoverC)
                        .on("mouseout", mouseoutC)

                //Text
                var msg = "DATA NEBULA";

                var text = svg.append("text")
                            .attr("x", -width)
                            .attr("y", height)
                            .attr("font-family", "Melee Cloud")
                            .attr("textLength", width)
                           // .attr("textHeight", 40)
                            .attr("font-size", "66px")
                            .text(msg)
                            .style('font', "Melee Cloud");

                //Text Animation
                text.transition()
                        .delay(1000)
                        .duration(2500)
                        .attr("x", 0)
                        .attr("y", height)

                //Node Animation
                circles.transition()
                        .delay(1000)
                        .duration(2500)
                        .attr("cx", function (d) { return xPosition(d); })
                        .attr("cy", function (d) { return yPosition(d); })
                        .attr("r", function (d) { return radius(d); })
                        .style("fill", function (d){ return "#48B3F8"})
                        .style("stroke", function (d){ return "#48B3F8"})

                //Link Animation
                links.transition()
                      .delay(1000)
                      .duration(2500)
                        .attr("x1", function(d) { return d["x1"] })
                        .attr("y1", function(d) { return d["y1"] })
                        .attr("x2", function(d) { return d["x2"] })
                        .attr("y2", function(d) { return d["y2"] })
                        .attr("stroke-width", 12)
                        .style("stroke", function (d){ return "#48B3F8"})
            }

            //Data Elements
            var nodes = scope.data[0].nodes
            var links = scope.data[0].links

            drawLogo(nodes,links)

         }
      };
      return directive;
   });

function Ctrl($scope) {
    //Data Elements
    var nodes = [
        {"r":20, "x":135, "y":153, "index": 0, "touches":[1,2,3,4,5,6,7,8]},
        {"r":40, "x":199, "y":97,  "index": 1, "touches":[0,2,3,4,5,6,7,8]},
        {"r":19, "x":157, "y":30,  "index": 2, "touches":[1,0,3,4,5,6,7,8]},
        {"r":30, "x":282, "y":29,  "index": 3, "touches":[1,5,6,0,2,4,7,8]},
        {"r":17, "x":235, "y":153, "index": 4, "touches":[1,0,2,3,5,6,7,8]},
        {"r":23, "x":269, "y":108, "index": 5, "touches":[3,0,1,2,4,6,7,8]},
        {"r":15, "x":337, "y":44,  "index": 6, "touches":[3,7,1,0,2,4,5,8]},
        {"r":28, "x":335, "y":100, "index": 7, "touches":[6,8,5,4,3,2,1,0]},
        {"r":23, "x":408, "y":95,  "index": 8, "touches":[7,6,4,3,5,1,0,2]}
    ];
    var links =[
        {"x1": nodes[0].x,"y1": nodes[0].y,"x2": nodes[1].x,"y2": nodes[1].y, "a": nodes[0].index, "b": nodes[1].index},
        {"x1": nodes[2].x,"y1": nodes[2].y,"x2": nodes[1].x,"y2": nodes[1].y, "a": nodes[1].index, "b": nodes[2].index},
        {"x1": nodes[3].x,"y1": nodes[3].y,"x2": nodes[1].x,"y2": nodes[1].y, "a": nodes[1].index, "b": nodes[3].index},
        {"x1": nodes[4].x,"y1": nodes[4].y,"x2": nodes[1].x,"y2": nodes[1].y, "a": nodes[1].index, "b": nodes[4].index},
        {"x1": nodes[3].x,"y1": nodes[3].y,"x2": nodes[5].x,"y2": nodes[5].y, "a": nodes[3].index, "b": nodes[5].index},
        {"x1": nodes[3].x,"y1": nodes[3].y,"x2": nodes[6].x,"y2": nodes[6].y, "a": nodes[3].index, "b": nodes[6].index},
        {"x1": nodes[7].x,"y1": nodes[7].y,"x2": nodes[6].x,"y2": nodes[6].y, "a": nodes[6].index, "b": nodes[7].index},
        {"x1": nodes[7].x,"y1": nodes[7].y,"x2": nodes[8].x,"y2": nodes[8].y, "a": nodes[7].index, "b": nodes[8].index}
    ];
    $scope.nodeLink = [{"nodes": nodes, "links": links}];
}