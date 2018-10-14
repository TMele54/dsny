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

            function drawLogo(squares){

                //Dimensions
                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                        width = 600 - margin.left - margin.right,
                        height = 400 - margin.top - margin.bottom;

                //Vector Graphics
                var widthR =  width + margin.left + margin.right;
                var heightR = height + margin.top + margin.bottom;

                var svg = d3.select(element[0])
                            .append("svg").attr("id", "logoSVG")
                            .attr("viewBox", "0 0" + " " + widthR.toString() + " " + heightR.toString())
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .append("g").attr("id", "logoSVGg")
                           // .attr("transform", "translate(-25,-50)");

                //Node Functions
                var xPosition =   function(d){ return d["dx"]}
                var yPosition =   function(d){ return d["dy"]}
                var innerRadius = function(d){ return d["ir"]}
                var outerRadius = function(d){ return d["or"]}
                var startAngle =  function(d){ return d["sa"]}
                var endAngle =    function(d){ return d["ea"]}
                var color =       function(d){ return d["color"]}
                var identity =    function(d){ return "rect" + d["index"].toString()}
                var stroke =      function(d){ return d["stroke"]}
                var x =           function(d){ return d["x"]}
                var y =           function(d){ return d["y"]}
                var width =       function(d){ return d["width"]}
                var height =       function(d){ return d["height"]}
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

                svg.selectAll('.rect')
                    .data(squares)
                    .enter()
                    .append("rect")
                    .attr("id", function(d){ return identity(d)})
                    .attr("class", "rect")
                    .attr("x",      function(d){ return xPosition(d)})
                    .attr("y",      function(d){ return yPosition(d)})
                    .attr("width",  function(d){ return width(d)})
                    .attr("height", function(d){ return height(d)})
                    .attr("fill",   function(d){ return color(d)})
                    .style("cursor", "pointer")

                //Text
                var msg = "Mural Painter NYC";

                svg.append("text").attr("class", "customfont").attr("id", "mstext")
                            .attr("x", 164)
                            .attr("y", 165)
                            .attr("textLength", 375)
                            .attr("font-size", "48px")
                            .text(msg)
                            .style("font-family", "Museo Sans")
                            .attr("fill", "#737373");

                var indexes = [0,1,2,3]

                function red(speed,wait,i){
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(59,0)")

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(59,59)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,59)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)");
                }
                function green(speed,wait,i){
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,59)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(-59,59)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(-59,0)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)");
                }
                function yellow(speed,wait,i){
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(-59,0)");

                    wait = wait + 1000;
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(-59,-59)");

                    wait = wait + 1000;
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,-59)");

                    wait = wait + 1000;
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)");
                }
                function blue(speed,wait,i){
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,-59)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(59,-59)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(59,0)");

                    wait = wait + 1000
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)");
                }
                function swap(speed,wait){
                    scale = 2;
                    dilate = 1.1;

                    d3.select("#mstext")
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(1000,0)");

                    // New params
                    rPosition = {"x":"300", "y":"-25"}
                    gPosition = {"x":"230", "y":"28"}
                    yPosition = {"x":"190", "y":"-65"}
                    bPosition = {"x":"230", "y":"-50"}

                    // Old params
                    /*xoffset = 200;
                    movh = 88;
                    movv = -28;

                    lr = xoffset+movh
                    rl = xoffset-movh

                    lr = lr.toString()
                    rl = rl.toString()

                    up = movv.toString()
                    down = up*-1
                    down = down.toString()*/

                    function mouseoverC() {
                        alert('hi')
                        d3.select(this).attr("width", "100px")
                         //   .select(".rect")
                         //   .transition()
                         //   .duration(750)
                         //   .attr("width", function(d){return d.width*2})
                         //   .attr("height", function(d){return d.height*2})
                        alert('bye')
                    }

                    //hover opposite, to bring back to its original state
                    function mouseoutC() {
                        d3.select(this).select("circle").transition()
                            .duration(750)
                        .attr("r", function(d){return d.radius});
                    }

                    // RED
                    i = indexes[0]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+rPosition["x"]+","+rPosition["y"]+")")
                        .attr("width",  function(d){ return width(d)*scale})
                        .attr("height", function(d){ return height(d)*scale})


                    d3.select(move).on("mouseover", function (d){
                                                        sizeW = d3.select(this)[0][0].__data__.width*scale
                                                        sizeH = d3.select(this)[0][0].__data__.height*scale
                                                        d3.select(this).transition().delay(100)
                                                                            .attr("width", sizeW*dilate)
                                                                            .attr("height", sizeH*dilate)})
                                    .on("mouseout", function (d){
                                                        d3.select(this).transition().delay(100)
                                                                                    .attr("width", sizeW)
                                                                                    .attr("height", sizeH)
                                                        })

                    // GREEN
                    i = indexes[1]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+gPosition["x"]+","+gPosition["y"]+")")
                    .attr("width",  function(d){ return width(d)*scale})
                    .attr("height", function(d){ return height(d)*scale})

                    d3.select(move).on("mouseover", function (d){
                                                        sizeW = d3.select(this)[0][0].__data__.width*scale
                                                        sizeH = d3.select(this)[0][0].__data__.height*scale
                                                        d3.select(this).transition().delay(100)
                                                                            .attr("width", sizeW*dilate)
                                                                            .attr("height", sizeH*dilate)})
                                    .on("mouseout", function (d){
                                                        d3.select(this).transition().delay(100)
                                                                                    .attr("width", sizeW)
                                                                                    .attr("height", sizeH)
                                                        })


                    // YELLOW
                    i = indexes[2]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+yPosition["x"]+","+yPosition["y"]+")")
                    .attr("width",  function(d){ return width(d)*scale})
                    .attr("height", function(d){ return height(d)*scale})

                    d3.select(move).on("mouseover", function (d){
                                                        sizeW = d3.select(this)[0][0].__data__.width*scale
                                                        sizeH = d3.select(this)[0][0].__data__.height*scale
                                                        d3.select(this).transition().delay(100)
                                                                            .attr("width", sizeW*dilate)
                                                                            .attr("height", sizeH*dilate)})
                                    .on("mouseout", function (d){
                                                        d3.select(this).transition().delay(100)
                                                                                    .attr("width", sizeW)
                                                                                    .attr("height", sizeH)
                                                        })

                    // BLUE
                    i = indexes[3]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+bPosition["x"]+","+bPosition["y"]+")")
                    .attr("width",  function(d){ return width(d)*scale})
                    .attr("height", function(d){ return height(d)*scale})


                    d3.select(move).on("mouseover", function (d){
                                                        sizeW = d3.select(this)[0][0].__data__.width*scale
                                                        sizeH = d3.select(this)[0][0].__data__.height*scale
                                                        d3.select(this).transition().delay(100)
                                                                            .attr("width", sizeW*dilate)
                                                                            .attr("height", sizeH*dilate)})
                                    .on("mouseout", function (d){
                                                        d3.select(this).transition().delay(100)
                                                                                    .attr("width", sizeW)
                                                                                    .attr("height", sizeH)
                                                        })
                }
                function gameover(speed,wait){

                    i = indexes[0]
                    move = "#rect"+i.toString()
                    d3.select(move)
                            .transition()
                            .delay(wait)
                            .duration(speed)
                            .attr("transform", "translate(0,0)")
                            .attr("width",  function(d){ return width(d)})
                            .attr("height", function(d){ return height(d)})

                    i = indexes[1]
                    move = "#rect"+i.toString()
                    d3.select(move)
                            .transition()
                            .delay(wait)
                            .duration(speed)
                            .attr("transform", "translate(0,0)")
                            .attr("width",  function(d){ return width(d)})
                            .attr("height", function(d){ return height(d)})

                    i = indexes[2]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)")
                    .attr("width",  function(d){ return width(d)})
                    .attr("height", function(d){ return height(d)})

                    i = indexes[3]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)")
                        .attr("width",  function(d){ return width(d)})
                        .attr("height", function(d){ return height(d)})

                    d3.select("#mstext")
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)");


                   d3.select("#simon")
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("fill", "white")
                }
                speed = 500;
                wait = 1000;

                red(speed,wait,0)
                green(speed,wait,1)
                yellow(speed,wait,2)
                blue(speed,wait,3)

                setTimeout(function(){
                    swap(speed+1000,wait)
                }, 6000);

                //var tooltip = d3.select("body")
                //                    .append("div")
                //                    .style("position", "absolute")
                //                    .style("z-index", "10")
                //                    .style("visibility", "hidden")
                //                    .text("a simple tooltip");

                //.on("mouseover", function(){return tooltip.style("visibility", "visible");})
                //.on("mousemove", function(){return tooltip.style("top",
                //    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
                //.on("mouseout", function(){return tooltip.style("visibility", "hidden");});


            }

            //Data Elements
            var squares = scope.data[0].squares

            drawLogo(squares)

         }
      };
      return directive;
   });

function Ctrl($scope) {
    //Data Elements

    var colors = ["#f25022","#7fba00","#ffb900","#00a4ef"];

    var squares = [
        {"dx": 85, "dy": 94, "height":36, "width": 33, "index": 1, "color": colors[1]},  //green  1
        {"dx": 85, "dy": 153, "height":46, "width": 46, "index": 2, "color": colors[2]}, //yellow  2
        {"dx": 26, "dy": 153, "height":26, "width": 21, "index": 3, "color": colors[3]},  //blue  3
        {"dx": 26, "dy": 94, "height":24, "width": 24, "index": 0, "color": colors[0]}  //red  4
    ];

    $scope.mural = [{"squares":squares}];
}