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
                var squre =       function(d){ return d["width"]}
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
                    .attr("width",  function(d){ return squre(d)})
                    .attr("height", function(d){ return squre(d)})
                    .attr("fill",   function(d){ return color(d)})



                //Text
                var msg = "Microsoft";

                svg.append("text").attr("class", "customfont").attr("id", "mstext")
                            .attr("x", 164)
                            .attr("y", 180)
                            .attr("textLength", 375)
                            .attr("font-size", "96px")
                            .text(msg)
                            .style("font-family", "Segoe UI Semibold")
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

                    d3.select("#mstext")
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(1000,0)");

                    xoffset = 200;
                    movh = 88;
                    movv = -28;

                    lr = xoffset+movh
                    rl = xoffset-movh

                    up = movv.toString()
                    down = up*-1
                    down = down.toString()

                    lr = lr.toString()
                    rl = rl.toString()

                    i = indexes[0]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+lr+","+up+")")
                        .attr("width",  function(d){ return squre(d)*2})
                        .attr("height", function(d){ return squre(d)*2})

                    i = indexes[1]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+rl+","+up+")")
                    .attr("width",  function(d){ return squre(d)*2})
                    .attr("height", function(d){ return squre(d)*2})

                    i = indexes[2]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+rl+","+down+")")
                    .attr("width",  function(d){ return squre(d)*2})
                    .attr("height", function(d){ return squre(d)*2})

                    i = indexes[3]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate("+lr+","+down+")")
                    .attr("width",  function(d){ return squre(d)*2})
                    .attr("height", function(d){ return squre(d)*2})

                    //Text
                   var msg = "Simon Says";
                   svg.append("text").attr("class", "customfont").attr("id", "simon")
                            .attr("x", 100)
                            .attr("y", 375)
                            .attr("textLength", 400)
                            .attr("font-size", "96px")
                            .text(msg)
                            .style("font-family", "Segoe UI Semibold")
                            .attr("fill", "white");

                   d3.select("#simon")
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("fill", "#737373")

                        function play(){

                       svg.append("rect").attr("class", "rect").attr("id", "playbox")
                            .attr("x", 500)
                            .attr("y", 100)
                            .attr("width", 100)
                            .attr("height", 40)
                            .attr("fill", "white")
                            .style("cursor","pointer")
                            .on("click", function(){
                                game()
                            })


                        //Text
                       var msg = "Play";
                        svg.append("text").attr("class", "customfont").attr("id", "play")
                                .attr("x", 515)
                                .attr("y", 125)
                                .attr("textLength", 80)
                                .attr("font-size", "14px")
                                .text(msg)
                                .style("font-family", "Segoe UI Semibold")
                                .attr("fill", "white")
                                .style("cursor","pointer")
                                .on("click", function(){
                                    game()
                                });

                        d3.select("#play")
                            .transition()
                            .delay(wait)
                            .duration(speed)
                            .attr("fill", "white");

                        d3.select("#playbox")
                            .transition()
                            .delay(wait)
                            .duration(speed)
                            .attr("fill", "black");


                        }

                        setTimeout(function(){

                            play()
                        }, 2000);

                }
                function gameover(speed,wait){

                    i = indexes[0]
                    move = "#rect"+i.toString()
                    d3.select(move)
                            .transition()
                            .delay(wait)
                            .duration(speed)
                            .attr("transform", "translate(0,0)")
                            .attr("width",  function(d){ return squre(d)})
                            .attr("height", function(d){ return squre(d)})

                    i = indexes[1]
                    move = "#rect"+i.toString()
                    d3.select(move)
                            .transition()
                            .delay(wait)
                            .duration(speed)
                            .attr("transform", "translate(0,0)")
                            .attr("width",  function(d){ return squre(d)})
                            .attr("height", function(d){ return squre(d)})

                    i = indexes[2]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)")
                    .attr("width",  function(d){ return squre(d)})
                    .attr("height", function(d){ return squre(d)})

                    i = indexes[3]
                    move = "#rect"+i.toString()
                    d3.select(move)
                        .transition()
                        .delay(wait)
                        .duration(speed)
                        .attr("transform", "translate(0,0)")
                        .attr("width",  function(d){ return squre(d)})
                        .attr("height", function(d){ return squre(d)})

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

                function game(){
                    var status = false;
                    step = 1;
                    function pulse(id,scolor){

                        setTimeout(function(){
                            d3.select(id).attr("fill", "black")
                        }, 300);

                        setTimeout(function(){
                            d3.select(id).attr("fill", scolor)
                        }, 600);

                    }

                    while(status == false){

                        for( var i =0; i < step; i++){

                            var rand = indexes[Math.floor(Math.random() * indexes.length)];
                            id = "#rect"+i.toString()
                            scolor = d3.select(id).attr("fill")
                            setTimeout(function(){pulse(id,scolor)},1000)
                        }

                        step += 1;
                        if (step == 10){status = true}
                    }

                }

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
        {"dx": 26, "dy": 94, "width": 54, "index": 0, "color": colors[0]},
        {"dx": 85, "dy": 94, "width": 54, "index": 1, "color": colors[1]},
        {"dx": 85, "dy": 153, "width": 54, "index": 2, "color": colors[2]},
        {"dx": 26, "dy": 153, "width": 54, "index": 3, "color": colors[3]}
    ];

    $scope.ms = [{"squares":squares}];
}