angular.module('companyLogo', []).
   directive('logo', function ($parse) {
        var directive = {
         restrict: 'E',
         replace: false,
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {

            function drawLogo(hammer, roller, saw, drill, level, placard){

                //Dimensions
                var margin = {top: 10, right: 10, bottom: 10, left: 10},
                        width = 800 - margin.left - margin.right,
                        height = 600 - margin.top - margin.bottom;

                //Vector Graphics
                var widthR =  width + margin.left + margin.right;
                var heightR = height + margin.top + margin.bottom;


                var svg = d3.select(element[0])
                            .append("svg")
                            .attr("id", "svgee")
                            .attr("viewBox", "0 0" + " " + widthR.toString() + " " + heightR.toString())
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .append("g")
                            .attr("transform", "translate(-100,450)")
                            .attr("fill", "#000000")
                            .attr("stroke", "none")

                // Step 0 - Set initial positions
                function initial_position(){

                    svg.append("g").attr("id", "placard")
                        .append("path")
                        .attr("d", placard.path)
                        .attr("transform", "translate(0,250)scale(0.05,-0.05)")
                        .attr("fill", "#26170f")

                    svg.append("g").attr("id", "hammer")
                        .append("path")
                        .attr("d", hammer.path)
                        .attr("transform", "translate(-550,0)scale(0.05,-0.05)")
                        .attr("fill", "#ffd60a")

                    svg.append("g").attr("id", "roller")
                        .append("path")
                        .attr("d", roller.path)
                        .attr("transform", "translate(250,500)scale(0.05,-0.05)")
                        .attr("fill", "#ffd60a")

                    svg.append("g").attr("id", "saw")
                        .append("path")
                        .attr("d", saw.path)
                        .attr("transform", "translate(325,-500)scale(0.05,-0.05)")
                        .attr("fill", "#ffd60a")

                    svg.append("g").attr("id", "level")
                        .append("path")
                        .attr("d", level.path)
                        .attr("transform", "translate(500,500)scale(0.05,-0.05)")
                        .attr("fill", "#ffd60a")

                    svg.append("g").attr("id", "drill")
                        .append("path")
                        .attr("d", drill.path)
                        .attr("transform", "translate(1000,0)scale(0.05,-0.05)")
                        .attr("fill", "#ffd60a")

                    svg.append("text").attr("id", "handy")
                        .attr("x", 455)
                        .attr("y", -150)
                        .attr("dy", ".35em")
                        .attr("fill", "white") // make me white later
                        .attr("font-size", "28pt")
                        .attr("font-weight", "bold")
                        .attr("letter-spacing", 3)
                        //.attr("font-family", "")
                        .text("HANDYMAN")
                        .style("opacity", 0)

                }
                initial_position()

                // Step 1 - Move D
                function move_D(){
                    wait = 1000;speed = 3000;
                    d3.select("#drill").transition().delay(wait).duration(speed).attr("transform", "translate(-450,0)");
                }
                move_D()

                // Step 2 - Move Roller, Saw, and Level
                function move_R_S_L(){
                    wait = 1150;speed = 3000;
                    d3.select("#roller").transition().delay(wait).duration(speed).attr("transform", "translate(0,-500)");
                    d3.select("#saw").transition().delay(wait).duration(speed).attr("transform", "translate(0,500)");
                    d3.select("#level").transition().delay(wait).duration(speed).attr("transform", "translate(0,-500)");
                }
                move_R_S_L()

                // Step 3 - Move Hammer
                function move_hammer(){
                    wait = 1300;speed = 3500;
                    d3.select("#hammer").transition().delay(wait).duration(speed).attr("transform", "translate(700,0)");
                }
                move_hammer()

                // Step - 4 Swing Hammer
                function swing_hammer(){
                    wait = 5300;speed = 1000;
                    H = d3.select("#hammer")
                    H.transition().delay(wait).duration(speed).attr("transform", "rotate(46.5, 10, 700)");

                    wait = 6200;speed = 1000;
                    H.transition().delay(wait).duration(speed).attr("transform", "translate(750,0)");// rotate(45deg)

                    //wait = 8300;speed = 1000;
                    //H.transition().delay(wait).duration(speed).attr("transform",  "rotate(1deg,750,0)")
                }
                swing_hammer()

                // Step 5 - Vibrate
                function vibrate_R_S_L_D(){
                    wait = 6200;speed = 100;
                    d3.select("#roller").transition().delay(wait).duration(speed).attr("transform", "translate(0,-495)");
                    d3.select("#saw").transition().delay(wait).duration(speed).attr("transform", "translate(0,510)");
                    d3.select("#drill").transition().delay(wait).duration(speed).attr("transform", "translate(-450,5)");
                    d3.select("#level").transition().delay(wait).duration(speed).attr("transform", "translate(0,-495)");

                    wait = 6300;speed = 100;
                    d3.select("#roller").transition().delay(wait).duration(speed).attr("transform", "translate(0,-500)");
                    d3.select("#saw").transition().delay(wait).duration(speed).attr("transform", "translate(0,500)");
                    d3.select("#drill").transition().delay(wait).duration(speed).attr("transform", "translate(-450,0)");
                    d3.select("#level").transition().delay(wait).duration(speed).attr("transform", "translate(0,-500)");
                }
                vibrate_R_S_L_D()

                // Step 6 - Handyman drop
                function handyman_drop(){
                    wait = 6700;speed = 2500;
                    d3.select("#handy")
                        .transition().delay(wait).duration(speed)
                        .attr("transform", "translate(0,170)")
                        .style("opacity", 1)
                        .ease('bounce')
                }
                handyman_drop()

              }

            hammer = scope.data[0].hammer
            roller = scope.data[0].roller
            saw = scope.data[0].saw
            drill = scope.data[0].drill
            level = scope.data[0].level
            placard = scope.data[0].placard

            drawLogo(hammer, roller, saw, drill, level, placard)

         }
      };
      return directive;
   });

function Ctrl($scope) {

    //Data Elements
    roller = {"path":"M793 4300 c-137 -27 -183 -58 -183 -119 0 -44 507 -2006 525 -2035 23 -34 -1 -68 -60 -88 -72 -24 -82 -22 -94 13 -13 36 14 38 -243 -15 -231 -47 -630 -172 -636 -198 -1 -7 6 -44 15 -83 15 -56 22 -71 39 -73 42 -6 462 90 609 140 83 28 172 58 199 66 48 17 48 17 43 54 l-5 37 55 12 c68 15 113 45 125 81 7 21 -10 101 -83 375 -292 1104 -431 1644 -437 1695 -5 46 13 59 127 88 94 24 126 21 135 -12 12 -46 7 -54 -44 -72 -62 -22 -114 -71 -107 -100 3 -12 97 -367 210 -791 113 -423 339 -1272 502 -1885 162 -613 300 -1130 306 -1148 13 -39 38 -47 117 -39 73 8 213 52 242 75 13 10 22 29 22 43 -1 25 -509 1969 -791 3024 -88 330 -174 654 -192 720 -17 66 -38 127 -46 135 -10 10 -34 15 -81 15 l-66 0 -16 43 c-26 69 -37 72 -187 42z"}

    hammer = {"path":"M1350 4555 c-92 -21 -243 -97 -400 -202 -226 -152 -317 -240 -258 -251 9 -2 76 27 149 63 142 72 342 154 427 175 131 34 174 -64 111 -259 -21 -65 -22 -73 -7 -87 14 -14 14 -20 -4 -66 -10 -28 -25 -82 -34 -121 -8 -38 -23 -100 -34 -136 -10 -36 -42 -145 -69 -241 -55 -193 -113 -349 -249 -665 -49 -115 -142 -343 -205 -505 -113 -288 -163 -428 -332 -930 -45 -135 -148 -431 -230 -658 -125 -349 -145 -415 -134 -428 36 -43 293 -144 367 -144 37 0 41 2 57 42 9 23 25 87 37 141 11 55 40 152 65 216 74 192 296 820 407 1153 58 172 159 507 226 743 66 237 157 542 202 679 83 258 289 775 314 789 8 4 14 15 14 23 0 9 7 28 14 42 8 15 23 44 32 66 20 45 80 91 138 107 92 25 203 -16 254 -94 37 -58 68 -90 89 -95 62 -14 79 -13 95 5 18 21 105 234 113 279 7 38 0 46 -64 73 -46 19 -63 22 -126 16 -129 -12 -195 19 -258 121 -31 51 -82 74 -267 121 -162 42 -331 53 -440 28z"}

    saw = {"path":"M1615 4643 c-198 -9 -485 -55 -816 -128 -196 -44 -258 -45 -382 -5 -52 17 -116 30 -143 30 -58 0 -119 -31 -112 -58 3 -9 256 -966 563 -2127 l557 -2110 38 -36 c21 -19 55 -41 77 -48 53 -17 629 -39 644 -24 6 6 14 32 16 57 5 44 5 46 -20 46 -14 0 -39 11 -54 25 l-28 24 38 1 c20 0 37 2 37 5 0 3 -12 17 -28 30 l-27 24 39 1 39 0 -23 25 -23 25 25 0 c38 0 41 12 11 37 l-28 22 33 1 c36 0 41 12 12 33 -24 16 -16 27 19 27 l26 0 -24 19 c-25 19 -22 24 23 35 l29 7 -33 24 -32 24 37 7 36 6 -27 29 -28 29 32 0 c37 0 42 14 10 32 -22 12 -22 12 17 23 39 12 40 12 17 26 -28 18 -28 29 1 29 34 0 39 10 14 30 l-22 18 38 7 38 7 -32 24 -31 23 37 7 37 7 -28 23 -29 23 26 1 c37 0 42 10 16 31 l-22 18 25 1 c44 1 54 15 24 35 -21 13 -24 19 -13 26 8 5 25 9 38 9 24 0 24 1 -7 24 -26 19 -30 25 -17 30 9 3 26 6 38 6 20 0 20 2 -8 25 l-30 24 45 1 45 1 -27 22 c-37 30 -35 37 8 37 l35 0 -28 25 -28 24 33 1 c36 0 42 14 12 32 -28 18 -25 28 10 28 35 0 38 10 10 28 -26 16 -17 32 18 32 l27 1 -28 24 -27 24 36 7 36 7 -28 22 -28 22 38 7 39 7 -34 29 -34 29 38 1 c43 0 45 5 15 29 l-22 18 37 7 37 7 -27 24 -28 24 33 1 c36 0 39 6 16 31 -14 16 -13 18 17 24 l33 8 -29 22 -28 23 36 7 36 7 -27 24 -27 23 26 1 c39 0 42 11 12 37 l-28 22 45 1 45 1 -29 23 -28 23 37 7 37 7 -31 23 -32 24 38 7 c38 7 38 7 16 22 -33 22 -28 33 15 33 l37 1 -29 23 -29 24 32 7 c30 6 31 8 17 24 -23 25 -20 31 17 31 l32 1 -27 24 c-16 13 -28 27 -28 30 0 3 17 5 38 5 l37 0 -30 24 -29 23 33 8 33 7 -28 19 -28 18 43 7 44 7 -34 28 c-33 28 -34 28 -9 29 44 1 54 15 26 34 -36 23 -32 36 10 36 l35 0 -28 25 -28 24 38 1 c20 0 37 2 37 5 0 3 -12 17 -27 30 l-28 24 39 1 39 0 -23 25 -23 25 25 0 c38 0 41 12 11 37 l-28 22 33 1 c36 0 41 12 12 33 -24 16 -16 27 19 27 l26 0 -25 20 -25 19 33 7 c38 8 39 11 12 40 l-21 21 33 7 33 6 -30 25 -30 24 27 1 c35 0 43 15 18 33 -18 13 -19 15 -5 21 9 3 28 6 42 6 l26 0 -28 22 -28 22 34 11 c33 12 34 12 11 24 -29 16 -19 31 21 31 l32 1 -27 20 c-37 27 -35 39 5 39 l32 1 -29 23 -28 23 36 7 36 7 -27 24 -28 24 40 1 40 1 -27 24 c-35 30 -35 35 2 35 37 0 38 12 5 38 -21 17 -22 21 -9 26 9 3 25 6 37 6 20 0 20 2 -8 25 l-30 24 45 1 45 1 -27 24 c-16 13 -28 27 -28 30 0 3 16 5 36 5 l35 0 -28 25 -28 24 33 1 c36 0 42 14 12 32 -28 18 -25 28 10 28 35 0 38 10 10 28 -26 16 -17 32 18 32 26 1 26 1 7 16 -19 14 -17 15 27 13 26 -2 51 1 55 5 7 6 -118 521 -163 673 l-15 53 -66 20 c-121 37 -615 98 -973 120 -155 9 -274 10 -415 3z m913 -324 c129 -14 160 -29 195 -101 30 -58 48 -170 30 -181 -18 -11 -177 -26 -428 -42 -311 -19 -304 -18 -570 -70 -121 -24 -256 -48 -300 -55 -44 -6 -201 -32 -349 -57 -298 -51 -311 -50 -417 3 -59 29 -79 74 -79 178 0 68 2 74 25 84 13 6 75 16 137 22 148 15 401 47 510 65 99 17 332 82 434 120 39 15 105 29 154 34 127 12 547 13 658 0z m-843 -3603 c20 -16 40 -39 45 -52 11 -29 -5 -81 -30 -94 -30 -16 -102 -11 -147 10 -46 21 -56 42 -51 106 2 29 9 42 28 52 39 20 113 10 155 -22z"}

    drill = {"path":"M1698 4390 c-565 -67 -923 -166 -1158 -319 -59 -39 -70 -42 -115 -39 -33 3 -64 14 -93 33 -40 26 -45 27 -85 16 -64 -19 -145 -76 -154 -108 -7 -29 -7 -53 2 -500 5 -209 3 -274 -9 -317 -14 -56 -13 -66 10 -66 33 0 63 180 64 386 0 43 5 77 14 89 13 18 14 18 25 -3 14 -26 15 -401 1 -521 -8 -75 -15 -94 -59 -165 -88 -145 -82 -115 -75 -393 6 -224 9 -254 29 -308 21 -55 23 -78 24 -284 2 -253 -3 -237 85 -296 26 -19 54 -44 60 -56 6 -13 26 -28 44 -33 37 -10 34 13 32 -266 -1 -96 -2 -196 -2 -222 1 -27 1 -64 0 -83 -1 -133 -1 -203 0 -225 1 -14 -1 -63 -4 -110 -6 -81 -5 -86 19 -108 l25 -23 20 26 c20 25 21 41 23 278 1 223 2 336 1 395 -2 106 5 320 11 330 5 6 17 12 27 12 11 0 27 11 36 24 8 14 37 39 63 55 93 60 90 52 97 277 4 125 3 213 -4 236 -9 33 -8 38 12 51 12 8 50 18 84 22 70 8 78 16 87 86 15 113 12 107 57 114 48 8 119 74 165 153 26 43 28 56 34 216 4 94 8 243 8 332 1 192 8 257 27 250 25 -9 46 24 39 61 -3 20 -2 33 5 33 5 0 10 20 10 44 0 52 26 90 73 104 17 6 88 13 157 17 131 7 200 19 212 39 4 6 8 30 8 52 0 33 4 43 19 47 11 3 26 20 34 38 29 69 47 77 248 110 234 39 286 32 324 -41 21 -40 43 -38 62 8 20 48 17 46 46 27 37 -24 100 -6 117 34 21 52 2 98 -53 126 -30 15 -44 42 -30 56 10 10 34 10 107 1 164 -21 261 -70 400 -205 69 -67 78 -79 72 -102 -11 -42 1 -64 39 -71 19 -3 32 -11 29 -17 -2 -7 13 -21 33 -32 110 -59 273 -370 359 -685 68 -246 78 -328 78 -600 0 -273 -13 -381 -79 -640 -101 -399 -230 -665 -437 -897 -156 -174 -293 -276 -533 -396 -254 -127 -413 -176 -685 -213 -168 -23 -517 -23 -695 0 -147 19 -312 51 -329 65 -6 5 -68 30 -138 55 -120 44 -131 47 -215 44 l-88 -3 -3 -32 c-4 -37 -12 -41 -102 -46 -44 -3 -40 -4 23 -5 l78 -2 -3 -47 -3 -48 -72 -3 c-96 -4 -94 -22 2 -22 l75 0 0 -46 0 -47 87 7 c81 7 229 51 340 103 30 14 43 13 160 -10 637 -127 1175 -87 1586 120 572 287 906 719 1077 1391 63 248 90 466 90 721 0 385 -64 649 -242 1004 -78 157 -206 352 -229 352 -13 0 -13 7 0 47 7 21 10 42 7 47 -3 5 -26 14 -50 20 -36 9 -68 33 -168 127 -110 103 -135 121 -233 169 -113 56 -234 95 -292 95 -26 0 -33 4 -33 19 0 21 -14 34 -40 38 -8 1 -16 6 -18 12 -2 5 -12 21 -23 35 l-20 26 -227 -1 c-152 -1 -279 -7 -384 -19z"}

    level = {"path":"M115 4370 c-19 -21 -20 -53 -23 -2138 -4 -2033 -4 -2116 14 -2129 19 -14 317 -19 446 -7 65 7 66 7 71 38 9 53 12 4234 4 4243 -5 4 -117 10 -250 11 -238 4 -243 3 -262 -18z m235 -180 c27 -14 45 -32 55 -56 26 -63 25 -64 -82 -64 -54 0 -104 4 -112 9 -24 16 9 82 55 108 22 13 40 23 42 23 1 0 21 -9 42 -20z m29 -286 c28 -6 31 -10 31 -45 l0 -39 -64 0 c-35 0 -78 3 -95 6 -28 6 -31 10 -31 45 l0 39 64 0 c35 0 78 -3 95 -6z m31 -184 l0 -40 -95 0 -95 0 0 40 0 40 95 0 95 0 0 -40z m-9 -500 c3 -91 8 -255 10 -365 l4 -200 -107 -3 -108 -3 0 68 c0 133 21 656 26 665 3 5 42 7 87 6 l82 -3 6 -165z m-131 -981 l0 -120 -27 3 -28 3 -3 104 c-1 58 0 111 2 118 3 7 17 13 31 13 l25 0 0 -121z m129 107 c8 -9 11 -48 9 -112 l-3 -99 -32 -3 -33 -3 0 115 c0 115 0 116 24 116 13 0 29 -6 35 -14z m7 -808 c-3 -161 -9 -326 -12 -366 l-6 -73 -87 3 -86 3 -3 125 c-1 69 -6 229 -11 355 -5 127 -7 233 -4 238 2 4 52 7 110 7 l106 0 -7 -292z m-8 -920 c-3 -31 -6 -33 -52 -41 -27 -4 -70 -7 -95 -5 -45 3 -46 4 -49 41 l-3 37 101 0 101 0 -3 -32z"}

   placard = {"path":"M2705 12168 c-3 -7 -4 -2211 -3 -4898 l3 -4885 6450 0 6450 0 0 4895 0 4895 -6448 3 c-5153 2 -6449 0 -6452 -10z m12734 -2110 c-1 -1096 -3 -1986 -5 -1978 -2 8 -15 92 -30 185 -153 1006 -538 1966 -1096 2732 -258 354 -601 719 -895 951 -47 37 -95 75 -107 84 -20 16 37 17 1057 18 l1077 0 -1 -1992z m-2 -7545 c-2 -2 -470 -2 -1040 -1 l-1036 3 122 97 c417 332 749 709 1087 1238 461 719 722 1396 847 2190 18 113 18 90 21 -1704 1 -1001 1 -1821 -1 -1823z"}

    $scope.dots = [
        {
            "roller":roller,
            "hammer":hammer,
            "saw":saw,
            "drill":drill,
            "level":level,
            "placard":placard
            }
        ];

}