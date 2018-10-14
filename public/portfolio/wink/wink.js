//https://www.sessions.edu/color-calculator/
//http://bl.ocks.org/mbostock/4583749
//http://bl.ocks.org/mbostock/1256572

angular.module('companyLogo', []).
   //camel cased directive name
   //in your HTML, this will be named as bars-chart
   directive('wink', function ($parse) {
     var directive = {
         restrict: 'E',
         replace: false,
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {

            function drawLogo(lines, circle, images, house, wink){

                //Dimensions
                var margin = {top: 0, right: 10, bottom: 10, left: 0},
                        width = 683 - margin.left - margin.right,
                        height = 689 - margin.top - margin.bottom;

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
                var color2 =      function(d){ return d["color2"]}
                var height =      function(d){ return d["height"]}
                var width =       function(d){ return d["width"]}
                var identity =    function(d){ return d["index"]}
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
                var image =        function(d){ return d["link"]}


                function whip(phaser,xq,yq,alt,clas){
                    //  setTimeout(function(){
                    cls = ".dots"+clas.toString()

                    //dots
                    svg.selectAll(cls)
                            .data(lines)
                            .enter()
                            .append("circle")
                            .attr("id", function(d){ var id = d.index;
                              return "circle"+"_"+phaser.toString()+"_"+id.toString()}
                            )
                            .attr("class", "dots")
                            .attr("cx", 330)
                            .attr("cy", 341)
                            .attr("r",  10)
                            .style("fill", function (d){ return color(d);})
                            .style("stroke-width", 0)
                            .style("stroke", function (d){ return color(d);})
                                .transition().ease("bounce")
                                .duration(1300)
                                .delay(1200*clas)
                                .attr("transform", function(d,i){
                                    tilty = Math.sin(rads(phaser))
                                    tiltx = Math.cos(rads(phaser))
                                    ex = xq*(95.5 + i*15.1)*tiltx;
                                    why = alt*yq*(95.5 + i*15.1)*tilty;
                                    return "translate("+ex.toString()+","+why.toString()+")"
                                    })
                            .style("fill", function (d){ return color2(d);})
                            .attr("r",  2.5)

                }

                //Center Circle

                function circleGen() {
                  //set defaults
                  var r = function(d) { return d.radius; },
                      x = function(d) { return d.x; },
                      y = function(d) { return d.y; };

                  //returned function to generate circle path
                  function circle(d) {
                    var cx = d3.functor(x).call(this, d),
                        cy = d3.functor(y).call(this, d),
                        myr = d3.functor(r).call(this, d);

                    return "M" + cx + "," + cy + " " +
                           "m" + -myr + ", 0 " +
                           "a" + myr + "," + myr + " 0 1,0 " + myr*2  + ",0 " +
                           "a" + myr + "," + myr + " 0 1,0 " + -myr*2 + ",0Z";
                  }

                  //getter-setter methods
                  circle.r = function(value) {
                    if (!arguments.length) return r; r = value; return circle;
                  };
                  circle.x = function(value) {
                    if (!arguments.length) return x; x = value; return circle;
                  };
                  circle.y = function(value) {
                    if (!arguments.length) return y; y = value; return circle;
                  };

                  return circle;
                }

                var myC = circleGen()
                   .x(function(d) { return d.x; })
                   .y(function(d) { return d.y; })
                   .r(function(d) { return d.r; });

                var cpath = [
                   {"r":58, "x":330, "y":341, "fill": "#1bb6eb"}
                ];

                svg.selectAll("path.circle")
                    .data(cpath)
                  .enter().append("path")
                    .attr("class", "circlePath")
                    .attr("d", myC)
                    .style("fill", function(d) { return d.fill; });

                svg.selectAll("image")
                        .data(images)
                        .enter()
                        .append("image").attr("class", "imgr")
                        .attr("id", function(d){ var id = d.index; return "image"+ id.toString()} )
                        .attr("xlink:href", function(d){ return image(d)})
                        .attr("x",  function(d){ return xPosition(d)-(width(d)/2)})
                        .attr("y",  function(d){ return yPosition(d)- (height(d)/2)})
                        .attr("width", function(d){return width(d)})
                        .attr("height", function(d){return height(d)})
                        .style("display", "none");



                function circleGen() {
                  //set defaults
                  var r = function(d) { return d.radius; },
                      x = function(d) { return d.x; },
                      y = function(d) { return d.y; };

                  //returned function to generate circle path
                  function circle(d) {
                    var cx = d3.functor(x).call(this, d),
                        cy = d3.functor(y).call(this, d),
                        myr = d3.functor(r).call(this, d);

                    return "M" + cx + "," + cy + " " +
                           "m" + -myr + ", 0 " +
                           "a" + myr + "," + myr + " 0 1,0 " + myr*2  + ",0 " +
                           "a" + myr + "," + myr + " 0 1,0 " + -myr*2 + ",0Z";
                  }

                  //getter-setter methods
                  circle.r = function(value) {
                    if (!arguments.length) return r; r = value; return circle;
                  };
                  circle.x = function(value) {
                    if (!arguments.length) return x; x = value; return circle;
                  };
                  circle.y = function(value) {
                    if (!arguments.length) return y; y = value; return circle;
                  };

                  return circle;
                }
                function fadedIn(i){

                    setTimeout(function(){

                        var id = i.toString();
                        var id = "#image"+id;
                        $(id).fadeIn(2300);

                    },(i+1)*1000)

                };
                function fadedOut(i){

                        var id = i.toString();
                        var id = "#image"+id;
                        $(id).fadeOut(2300);


                };
                function unify(){

                    phasers.forEach(function(phase,i){
                        lines.forEach(function(d,k){

                            pha = phase.phaser
                            pha = pha.toString()
                            id = k
                            id = "#circle"+"_"+pha+"_"+id.toString()

                            d3.select(id)
                               .transition()
                               .delay(300*i)
                               .duration(2500/(k+3))
                               .style("fill", "#1bb6eb")
                               .style("stroke","#1bb6eb")
                               .attr("r",10)
                               .transition()
                               .attr("transform", "translate(0,0)")
                               //.attr("cx", 330)
                               //.attr("cy", 341)



                        })

                    })

                }
                function rads(degrees){
                    radians = degrees * (Math.PI/180)

                    return radians
                };
                function drawHouse(){
                     svg.selectAll(".img")
                        .data(house)
                        .enter()
                        .append("image").attr("class", "imgr")
                        .attr("id", function(d){ var id = d.index; return "image"+ id.toString()} )
                        .attr("xlink:href", function(d){ return image(d)})
                        .attr("x",  function(d){ return xPosition(d)-(width(d)/2)+3})
                        .attr("y",  function(d){ return yPosition(d)- (height(d)/2)})
                        .attr("width", function(d){return width(d)})
                        .attr("height", function(d){return height(d)})
                        .style("display", "none");
                    fadedIn(8)
                };
                function signalOut(phase,base){

                    lines.forEach(function(d,i){
                        pha = phase.toString()
                        id = d.index
                        id = "#circle"+"_"+pha+"_"+id.toString()
                        d3.select(id).transition()
                           .delay(base+100*i)
                           .duration(500)
                            .style("stroke-width", 6)
                            .style("stroke", "#1bb6eb")
                            .attr("fill", "#1bb6eb")
                            .transition()
                            .delay(base+500+100*i)
                            .duration(500)
                            .style("stroke-width", 0)
                            .attr("fill", "#868686")
                    })
                    lines = lines.reverse()
                    signalIn(phase, base +=2000)

                    };
                function signalIn(phase,base){

                    lines.forEach(function(d,i){
                        pha = phase.toString()
                        id = d.index
                        id = "#circle"+"_"+pha+"_"+id.toString()

                        d3.select(id).transition()
                           .delay(base+100*i)
                           .duration(500)
                            .style("stroke-width", 6)
                            .style("stroke", "#868686")
                            .attr("fill", "#868686")
                            .transition()
                            .delay(base+500+100*i)
                            .duration(500)
                            .style("stroke-width", 0)
                            .attr("fill", "#868686")
                        //lines = lines.reverse()
                        //signalIn(phase, base +=2000)
                    })

                    };
                function remove(){

                    for (var i=0; i<=8; i++){

                        fadedOut(i)
                    }



                }

                // Fade In
                for (var i=0; i<8; i++){

                    fadedIn(i)
                }

                phasers = [
                            {"phaser":90,  "xq":1,  "yq":-1, "alt":1},
                            {"phaser":45,  "xq":1,  "yq":-1, "alt":1},
                            {"phaser":0,   "xq":1,  "yq":-1, "alt":1},
                            {"phaser":315, "xq":1,  "yq":-1, "alt":1},
                            {"phaser":270, "xq":1,  "yq":-1, "alt":1},
                            {"phaser":225, "xq":1, "yq":-1,"alt":1},
                            {"phaser":180, "xq":1, "yq":1,"alt":1},
                            {"phaser":135, "xq":1, "yq":-1,"alt":1}
                            ]
                token = 0;
                phasers.forEach(function(phase,i){

                    whip(phase.phaser,phase.xq,phase.yq,phase.alt,i)

                        signalOut(phase.phaser,10000)

                })

                drawHouse()
                setTimeout(function(){


                    remove()
                },12500)
                setTimeout(function(){

                    unify()
                },15000)
                setTimeout(function(){

                    d3.selectAll(".dots").remove("*")

                },19500)

                setTimeout(function(){

                    d3.selectAll(".imgr").remove("*")


                    d3.select(".circlePath")
                            .transition()
                            .delay(0)
                            .duration(1000)
                            .attr("transform", "translate(270,1925),rotate(-180),scale(-3,3)")

                    setTimeout(function(){


                        d3.select(".circlePath").remove("*")
                        var myC = circleGen()
                                   .x(function(d) { return d.x; })
                                   .y(function(d) { return d.y; })
                                   .r(function(d) { return d.r; });

                        var cpath = [
                           {"r":50*3, "x":1260, "y":900, "fill": "#1bb6eb"}
                        ];

                        svg.selectAll("path.circle")
                                .data(cpath)
                                .enter().append("path")
                                .attr("class", "circlePath")
                                .attr("d", myC)
                                .style("fill", function(d) { return d.fill; });

                    d3.select("#logoSVGg").attr("transform", "translate(0,250)scale(.2,-.2)")

                    var ters = wink[0].path;
                    var d0 = wink[1].path;
                    d1 = d3.select(".circlePath").attr("d")
                    d3.select(".circlePath").remove("*")

                    svg.append("path")
                        .attr("d", ters)
                        .style("fill","#1bb6eb")
                        //.attr("transform", "translate(165,425)scale(0.05,-0.05)")
                        //.call(transition, ters, d1);

                    svg.append("path")
                        .attr("d", d1)
                        .style("fill","#1bb6eb")
                        .call(transition, d0, d1);

                    },1000)


                },19600)
                kill = 0;
                function transition(path, d0, d1) {
                    if (kill <= 1){
                        time = 500;
                        kill+=1
                    }else{time = 300000}
                    setTimeout(function(){
                      path.transition()
                          .duration(500)
                          .attrTween("d", pathTween(d1, 4))
                          .each("end", function() { d3.select(this).call(transition, d1, d0); });

                    },time)
                }

                function pathTween(d1, precision) {

                    return function() {
                        var path0 = this,
                            path1 = path0.cloneNode(),
                            n0 = path0.getTotalLength(),
                            n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

                        // Uniform sampling of distance based on specified precision.
                        var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
                        while ((i += dt) < 1) distances.push(i);
                        distances.push(1);

                        // Compute point-interpolators at each distance.
                        var points = distances.map(function(t) {
                        var p0 = path0.getPointAtLength(t * n0),
                            p1 = path1.getPointAtLength(t * n1);
                        return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);

                 });

                return function(t) {
                  return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
                };

          };
    }


}
            //Data Elements
            var lines = scope.data[0].lines
            var circle = scope.data[0].circle
            var images = scope.data[0].images
            var house = scope.data[0].house
            var wink = scope.data[0].wink

            drawLogo(lines, circle, images, house, wink)


         }
      };
      return directive;
   });

function Ctrl($scope) {

    //Data Elements
    var centerCircle = [

    {"or":58, "dx":330, "dy":341, "color":"#1bb6eb", "index": 0}
    ];
    var dotLine = [
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 0},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 1},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 2},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 3},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 4},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 5},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 6},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 7},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 8},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 9},
                            {"r":2, "color":"#1bb6eb", "color2":"#868686", "index": 10}
                   ];
    var images =[
        {"id":"speaker","link":"static/layout/img/wink/speaker.PNG", "dx":330, "dy":36, "height": 73, "width":55, "index":0},
        {"id":"lock", "link":"static/layout/img/wink/lock.PNG", "dx":554, "dy":105, "height": 75, "width":58, "index":1},
        {"id":"camera", "link":"static/layout/img/wink/camera.PNG", "dx":644, "dy":336, "height": 57, "width":78, "index":2},
        {"id":"fridge", "link":"static/layout/img/wink/fridge.PNG", "dx":554, "dy":581, "height": 99, "width":52, "index":3},
        {"id":"bulb",   "link":"static/layout/img/wink/bulb.PNG", "dx":330, "dy":650, "height": 78, "width":66, "index":4},
        {"id":"window", "link":"static/layout/img/wink/window.PNG", "dx":101, "dy":567, "height": 72, "width":71, "index":5},
        {"id":"switch", "link":"static/layout/img/wink/switch.PNG", "dx":27, "dy":337, "height": 73, "width":55, "index":6},
        {"id":"stereo", "link":"static/layout/img/wink/stereo.PNG", "dx":105, "dy":115,  "height": 52, "width":117, "index":7}
    ];
    var house = [

        {"id":"speaker","link":"static/layout/img/wink/house.PNG", "dx":326, "dy":340, "height": 49, "width":49, "index":8}
    ];
    /*
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="300.000000pt" height="113.000000pt" viewBox="0 0 300.000000 113.000000" preserveAspectRatio="xMidYMid meet">
        <g xmlns="http://www.w3.org/2000/svg" transform="translate(0.000000,113.000000) scale(0.100000,-0.100000)" fill="#1bb6eb" stroke="none"></g>
    </svg>
    */
    var wink = [

                {"id":"w","path":"M561 731 c-16 -10 -24 -24 -92 -162 l-47 -94 -17 40 c-9 22 -28 69 -41 105 -43 111 -41 110 -142 109 -48 -1 -100 -4 -117 -8 -52 -11 -47 -37 55 -256 23 -49 73 -160 112 -245 77 -171 83 -180 107 -180 17 0 55 34 62 56 9 26 133 234 139 234 4 0 14 -12 21 -27 49 -98 132 -243 144 -253 29 -24 55 -1 96 86 21 47 39 87 39 89 0 2 29 65 65 140 36 76 65 138 65 140 0 2 18 42 40 89 22 47 40 93 40 101 0 24 -43 35 -134 35 -95 0 -106 -6 -130 -70 -51 -137 -86 -200 -86 -156 0 8 -3 16 -7 18 -5 2 -26 37 -47 78 -46 89 -82 140 -99 140 -7 0 -18 -4 -26 -9z m104 -141 c39 -72 75 -137 80 -145 8 -12 23 18 66 122 l57 138 92 3 c51 1 97 -1 102 -6 5 -5 -32 -99 -91 -228 -174 -384 -190 -416 -203 -412 -15 5 -72 103 -138 236 -42 85 -60 108 -60 80 0 -25 -175 -313 -190 -313 -9 0 -37 50 -74 130 -141 308 -224 500 -219 507 8 14 210 9 220 -4 5 -7 31 -69 58 -138 50 -129 65 -158 65 -126 0 10 24 64 54 120 29 55 61 116 70 134 9 17 22 32 29 32 6 0 44 -59 82 -130z M1147 712 c-15 -16 -17 -55 -18 -325 -1 -232 2 -311 11 -322 10 -12 36 -15 116 -15 94 0 104 2 114 21 16 28 14 627 -1 646 -8 9 -40 13 -109 13 -81 0 -100 -3 -113 -18z m211 -324 l2 -318 -105 0 -105 0 0 313 c0 173 3 317 7 321 4 4 50 5 103 4 l95 -3 3 -317z M1806 724 c-22 -8 -45 -19 -52 -25 -9 -7 -19 -4 -33 10 -18 18 -33 21 -109 21 -115 0 -122 -6 -127 -95 -4 -65 -4 -383 -1 -501 2 -78 11 -84 126 -84 76 0 100 3 110 15 10 12 14 66 15 193 1 97 5 187 9 200 11 33 61 55 104 47 58 -11 61 -22 62 -200 1 -198 3 -232 18 -247 14 -14 166 -18 202 -6 36 13 40 25 40 118 0 47 1 92 1 100 1 8 -2 71 -5 140 -6 115 -9 130 -39 190 -24 47 -46 74 -81 99 -44 31 -56 35 -125 37 -49 2 -90 -2 -115 -12z m200 -25 c53 -25 90 -68 117 -136 16 -40 20 -81 25 -244 2 -109 2 -209 -2 -223 -6 -26 -7 -26 -106 -26 l-100 0 0 68 c0 37 -2 130 -4 207 -5 136 -6 141 -31 163 -47 40 -147 23 -177 -31 -8 -15 -14 -86 -16 -214 l-4 -193 -98 0 -97 0 -7 108 c-7 118 -7 383 1 475 l5 57 88 0 c116 0 121 -2 114 -51 l-6 -38 39 37 c22 21 55 43 74 49 58 19 135 15 185 -8z M2651 719 c-15 -9 -54 -48 -86 -87 -36 -42 -62 -66 -66 -59 -3 7 -6 38 -7 70 -1 85 -6 88 -126 85 -91 -3 -101 -5 -111 -24 -7 -14 -11 -129 -10 -323 0 -269 2 -302 17 -317 23 -23 192 -24 215 -2 9 10 16 44 19 98 2 46 8 88 13 93 6 6 28 -19 57 -64 26 -41 60 -91 76 -111 l30 -38 117 0 c116 0 141 6 141 37 0 7 -50 88 -111 180 -61 92 -113 173 -116 179 -2 6 41 64 96 128 56 64 101 122 101 130 0 26 -26 35 -124 38 -78 2 -105 0 -125 -13z m-179 -119 l3 -110 93 110 93 110 109 0 c73 0 110 -4 110 -11 0 -6 -41 -59 -92 -117 -50 -59 -98 -114 -105 -124 -13 -14 -1 -36 106 -197 67 -99 121 -185 121 -191 0 -7 -40 -10 -117 -8 l-118 3 -72 109 c-40 60 -74 114 -76 120 -2 6 -16 -3 -30 -19 -24 -27 -26 -37 -27 -117 l0 -88 -99 0 -99 0 -6 63 c-7 64 -6 556 1 570 2 4 49 7 103 7 l99 0 3 -110z"},
                {"id":".","path":"M1204 1041 c-18 -9 -47 -30 -65 -45 -33 -28 -33 -30 -32 -104 2 -104 12 -112 142 -112 57 0 106 5 121 13 23 11 25 19 28 87 2 43 -2 84 -8 96 -12 22 -118 84 -142 83 -7 0 -27 -8 -44 -18z m117 -37 l59 -35 0 -78 0 -78 -46 -7 c-59 -8 -167 -8 -188 0 -13 5 -16 22 -16 85 l0 79 53 35 c28 19 58 34 66 34 7 1 40 -15 72 -35z"}

            ]


    $scope.wink = [{"lines": dotLine, "circle": centerCircle, "images": images, "house":house, "wink":wink}];
}