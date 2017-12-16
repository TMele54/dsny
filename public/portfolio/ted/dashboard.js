d3_4.request("/ted-data").response(function (xhr) {return xhr.responseText}).get(function(data) {
    return draw(JSON.parse(data))
});

EX =[{
    "comments": 4553,
    "description": "Sir Ken Robinson makes an entertaining and profoundly moving case for creating an education system that nurtures (rather than undermines) creativity.",
    "duration": 1164,
    "event": "TED2006",
    "film_date": 1140825600,
    "languages": 60,
    "main_speaker": "Ken Robinson",
    "name": "Ken Robinson: Do schools kill creativity?",
    "num_speaker": 1,
    "published_date": 1151367060,
    "ratings": "[{'id': 7, 'name': 'Funny', 'count': 19645}, {'id': 1, 'name': 'Beautiful', 'count': 4573}, {'id': 9, 'name': 'Ingenious', 'count': 6073}, {'id': 3, 'name': 'Courageous', 'count': 3253}, {'id': 11, 'name': 'Longwinded', 'count': 387}, {'id': 2, 'name': 'Confusing', 'count': 242}, {'id': 8, 'name': 'Informative', 'count': 7346}, {'id': 22, 'name': 'Fascinating', 'count': 10581}, {'id': 21, 'name': 'Unconvincing', 'count': 300}, {'id': 24, 'name': 'Persuasive', 'count': 10704}, {'id': 23, 'name': 'Jaw-dropping', 'count': 4439}, {'id': 25, 'name': 'OK', 'count': 1174}, {'id': 26, 'name': 'Obnoxious', 'count': 209}, {'id': 10, 'name': 'Inspiring', 'count': 24924}]",
    "related_talks": "[{'id': 865, 'hero': 'https://pe.tedcdn.com/images/ted/172559_800x600.jpg', 'speaker': 'Ken Robinson', 'title': 'Bring on the learning revolution!', 'duration': 1008, 'slug': 'sir_ken_robinson_bring_on_the_revolution', 'viewed_count': 7266103}, {'id': 1738, 'hero': 'https://pe.tedcdn.com/images/ted/de98b161ad1434910ff4b56c89de71af04b8b873_1600x1200.jpg', 'speaker': 'Ken Robinson', 'title': \"How to escape education's death valley\", 'duration': 1151, 'slug': 'ken_robinson_how_to_escape_education_s_death_valley', 'viewed_count': 6657572}, {'id': 2276, 'hero': 'https://pe.tedcdn.com/images/ted/3821f3728e0b755c7b9aea2e69cc093eca41abe1_2880x1620.jpg', 'speaker': 'Linda Cliatt-Wayman', 'title': 'How to fix a broken school? Lead fearlessly, love hard', 'duration': 1027, 'slug': 'linda_cliatt_wayman_how_to_fix_a_broken_school_lead_fearlessly_love_hard', 'viewed_count': 1617101}, {'id': 892, 'hero': 'https://pe.tedcdn.com/images/ted/e79958940573cc610ccb583619a54866c41ef303_2880x1620.jpg', 'speaker': 'Charles Leadbeater', 'title': 'Education innovation in the slums', 'duration': 1138, 'slug': 'charles_leadbeater_on_education', 'viewed_count': 772296}, {'id': 1232, 'hero': 'https://pe.tedcdn.com/images/ted/0e3e4e92d5ee8ae0e43962d447d3f790b31099b8_800x600.jpg', 'speaker': 'Geoff Mulgan', 'title': 'A short intro to the Studio School', 'duration': 376, 'slug': 'geoff_mulgan_a_short_intro_to_the_studio_school', 'viewed_count': 667971}, {'id': 2616, 'hero': 'https://pe.tedcdn.com/images/ted/71cde5a6fa6c717488fb55eff9eef939a9241761_2880x1620.jpg', 'speaker': 'Kandice Sumner', 'title': \"How America's public schools keep kids in poverty\", 'duration': 830, 'slug': 'kandice_sumner_how_america_s_public_schools_keep_kids_in_poverty', 'viewed_count': 1181333}]",
    "speaker_occupation": "Author/educator",
    "tags": "['children', 'creativity', 'culture', 'dance', 'education', 'parenting', 'teaching']",
    "title": "Do schools kill creativity?",
    "url": "https://www.ted.com/talks/ken_robinson_says_schools_kill_creativity\n",
    "views": 47227110
}]

function draw(data){
    ref_data = data;
    //Setup Data
    function formatData(data){
        String.prototype.toHHMMSS = function () {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
        };
        data.forEach(function(d,i){
            d["durationFormatted"] = d["duration"].toString().toHHMMSS();
            d["film_date"] = new Date(d["film_date"] * 1000);
            d["published_date"] = new Date(d["published_date"] * 1000);
            d["id"] = i;
        });
        return data
    };
    format_data = formatData(data)
    // Make xf object
    xf = crossfilter(format_data);
    dataDIM = xf.dimension(function(d){return d["id"]}); // I let you filter format_data from the xf obj

    function langChart(xf, selector){

        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Languages")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Count of Languages");

        width = parseInt(d3.select(selector).style("width"), 10)
        //Bar Chart for Published Date

        langs = function(d){return d["languages"]};
        langsChart = dc.barChart(selector);
        langsDim = xf.dimension(function(d){return d["languages"]})
        langsGroup = langsDim.group().reduceCount(function(d){return d["languages"]})

        langsChart
            .width(width)
            .height(200)
            .x(d3.scale.linear().domain([d3.min(ref_data, langs), d3.max(ref_data, langs)]))
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(langsDim)
            .group(langsGroup)
            .transitionDuration(500)
            .centerBar(true)
            .gap(65)
            //.filter([3, 5])
            .elasticY(true)
            .xAxis().ticks(5)
            .tickFormat()
        //.on("renderlet.b", function (chart) {
        // rotate x-axis labels
        //  chart.selectAll('g.x text').attr('transform', 'translate(-10,10) rotate(315)')
        //});

        langsChart.render();
    }; /*Bar Chart - Count Data*/
    function pubChart(xf, selector){

        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Publication Date")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Count of Publications");
        //Bar Chart for Published Date

        pubDate = function(d){return d["published_date"]};
        pubDateChart = dc.lineChart(selector);
        pubDateDim = xf.dimension(function(d){return d["published_date"]});
        pubDateGroup = pubDateDim.group().reduceCount(function(d){return d["published_date"]});

        pubDateChart
            .width(parseInt(d3.select(selector).style("width"), 10))
            .height(200)
            .x(d3.time.scale().domain([d3.min(ref_data, pubDate), d3.max(ref_data, pubDate)]))
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(pubDateDim)
            .group(pubDateGroup)
            .transitionDuration(500).interpolate("basis")
            //.centerBar(true)
            //.gap(65)
            //.filter([3, 5])
            .elasticY(true)
            .xAxis().ticks(6)
            .tickFormat();

        pubDateChart.render();
    }; /*Line Chart - Count Data*/
    function speakChart(xf, selector){

        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Number of Speakers")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Count of Speakers");
        //Bar Chart for Number of Speakers

        numSpeak = function(d){return d["num_speaker"]}
        numSpeakChart = dc.pieChart(selector);
        numSpeakDim = xf.dimension(function(d){return +d["num_speaker"]})
        numSpeakGroup = numSpeakDim.group().reduceCount(function(d){return +d["num_speaker"]})

        numSpeakChart
            .width(parseInt(d3.select(selector).style("width"), 10))
            .height(200)
            //.x(d3.scale.linear().domain([d3.min(ref_data, numSpeak)-1, d3.max(ref_data, numSpeak)+1]))
           // .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(numSpeakDim)
            .group(numSpeakGroup).slicesCap(1)
            .innerRadius(40)
            .legend(dc.legend())
            .transitionDuration(500)
            .on('pretransition', function(chart) {
                chart.selectAll('text.pie-slice').text(function(d) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                })
            });

        numSpeakChart.render();

    }; /*Pie Chart - Count Number*/
    function selectOc(xf, selector){
        //Speaker Occupation Select box

        selectOccu = dc.selectMenu(selector);
        selectOccuDim = xf.dimension(function(d){return d["speaker_occupation"]});
        //selectOccuGroup = selectOccuDim.group();
        selectOccu.width(150)
            .dimension(selectOccuDim)
            .group(selectOccuDim.group())
            .multiple(true)
            .numberVisible(5)
            //.numberItems(10)
            .order(function (a,b) {
            return b.value > a.value ? 1 : a.value > b.value ? -1 : 0;
        });

        selectOccu.render().controlsUseVisibility(true)
    }; /*Select Box - Values*/
    function tableChart(xf, selector){

        bigNum = d3.format(",")
        tableChar = dc.dataTable(selector);
        tableChartDim = xf.dimension(function(d){return d["name"]});
        tableChartGroup = tableChartDim.group();

        tableChar
            .dimension(tableChartDim)
            .group(function(d){
                return +d.value;
            }).sortBy(function(d){return d["published_date"]})
            //.size(17)
            .order(d3.ascending).showGroups(false)
            .columns([
                        "Title",        {label: "",format: function (d) { return d["title"];}},
                       // "Description",  {label: "",format: function (d) { return d["description"];}},
                       // "Speaker",      {label: "",format: function (d) { return d["main_speaker"];}},
                       // "Occupation",   {label: "",format: function (d) { return d["speaker_occupation"];}},
                       // "Published",    {label: "",format: function (d) { return d["published_date"];}},
                        "Duration",     {label: "",format: function (d) { return d["durationFormatted"];}},
                        "URL",          {label: "",format: function (d) { return d["url"];}},
                        "Views",        {label: "",format: function (d) { return bigNum(d["views"]);}}


                        // "Comments", {label: "1",format: function (d) { return d["comments"]; }},
                        // "Event",{label: "4",format: function (d) { return d["event"]; }},
                        // "Film Date",{label: "5",format: function (d) { return d["film_date"]; }},
                        // "Languages",{label: "6",format: function (d) { return d["languages"]; }},
                        // "Name",{label: "8",format: function (d) { return d["name"]; }},
                        // "Speakers",{label: "9",format: function (d) { return d["num_speaker"]; }},
                        // "Ratings",{label: "11",format: function (d) { return d["ratings"]; }},
                        // "Related",{label: "12",format: function (d) { return d["related_talks"]; }  },
                        // "Tags",{label: "14",format: function (d) { return d["tags"]; }},

                ]);

        tableChar.render();
    };/*Table Chart - */
    function numChart(xf, selector, field, title, tag){
        if(selector != "#chartF"){
            d3.select(selector).selectAll("*").remove();
            $(selector).empty();
            d3.select(selector)
                .append("h3")
                .attr("class", "widget-title")
                .attr("align", "left")
                .style("vertical-align", "center")
                .text(title)
                .append("h5")
                .attr("align", "left")
                .style("vertical-align", "center")
                .text(tag);

            width = parseInt(d3.select(selector).style("width"), 10);
            $(selector).height(parseInt(width*0.750));

            //Bar Chart for Published Date
            items = function(d){return +d["name"]};
            viewCommRat = dc.numberDisplay(selector);
            viewCommRatDim = xf.dimension(items);
            viewCommRatGroup = viewCommRatDim.groupAll().reduceSum(function(d){return d[field]});
            average = function(d) {return d.n ? d.tot / d.n : 0;};

            viewCommRat
                .group(viewCommRatGroup)
                .formatNumber(d3.format(".3s"))
                .valueAccessor(function(d){return d})

                //.on("filtered", table(xf, format_data, "#tableID"));


            viewCommRat.render();
        }
        else{
            field1 = field.split(",")[0]
            field2 = field.split(",")[1]

            d3.select(selector).selectAll("*").remove();
            $(selector).empty();
            d3.select(selector)
                .append("h3")
                .attr("class", "widget-title")
                .attr("align", "left")
                .style("vertical-align", "center")
                .text(title)
                .append("h5")
                .attr("align", "left")
                .style("vertical-align", "center")
                .text(tag);

            width = parseInt(d3.select(selector).style("width"), 10);
            //$(selector).height(width);

            //Bar Chart for Published Date
            items = function(d){return ["url"]};
            viewCommRat = dc.numberDisplay(selector);
            viewCommRatDim = xf.dimension(items);
            viewCommRatGroup = viewCommRatDim.groupAll().reduceSum(function(d){return +d[field2]/+d[field1]});
            average = function(d) {return d.n ? d.tot / d.n : 0;};

            viewCommRat
                .group(viewCommRatGroup)
                .formatNumber(d3.format(".1%"))
                .valueAccessor(function(d){return d})

            viewCommRat.render();

        }
    }; /*Number Box - Count Data*/
    function viewsCommsChart(xf, selector){


        d3.select(selector).selectAll("*").remove();
        $(selector).empty();
        d3.select(selector)
            .append("h3")
            .attr("class", "widget-title")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Views (L) & Comments (R)")
            .append("h5")
            .attr("align", "left")
            .style("vertical-align", "center")
            .text("Over Time");
        //Bar Chart for Published Date

        viewCommDate = function(d){return d["published_date"]};
        //viewCommDateChart = dc.lineChart(selector);
        viewCommDateChart = dc.compositeChart(selector);
        viewCommDateDim = xf.dimension(viewCommDate)
        viewDateGroup = viewCommDateDim.group().reduceSum(function(d){return +d["views"]});
        commDateGroup = viewCommDateDim.group().reduceSum(function(d){return +d["comments"]});

        viewCommDateChart
            .width(parseInt(d3.select(selector).style("width"), 10))
            .height(270)
            .margins({top: 10, right: 75, bottom: 50, left: 90})
            .x(d3.time.scale().domain([d3.min(ref_data, viewCommDate), d3.max(ref_data, viewCommDate)]))
            .legend(dc.legend().x(200).y(20).itemHeight(13).gap(5))
            .yAxisLabel("Sum of Views")
            .mouseZoomable(true)
            .shareTitle(false)
            .xUnits(d3.time.months)
            .elasticY(true)
            .compose([
                dc.lineChart(viewCommDateChart).dimension(viewCommDateDim).colors('#5bf3f5')
                    .group(viewDateGroup, "Views").dashStyle([2,2]),
                dc.lineChart(viewCommDateChart).dimension(viewCommDateDim).colors('#d26b6c')
                    .group(commDateGroup, "Comments").dashStyle([5,5]).useRightYAxis(true)
            ])
            .brushOn(false)
            .rightYAxisLabel("Sum of Comments")
            .renderHorizontalGridLines(true)
            .render();
        //viewCommDateChart.render();
        
    }
    function table(xf, data, selector){

        d3.select(selector).selectAll("*").remove();
        var good = []
        for(var item in dataDIM.top(Infinity)){
            good.push(item)
        }

        tableData = []
        data.forEach(function(d){
            if(d["id"] in good){
                tableData.push(d)
            }
        })


        var columnsData = [
            // "FILTER",
            "title",
            "durationFormatted",
            "url",
            "views"
        ]
        var columnsHead = [
            // "Filter Dashboard",
            "Title",
            "Duration",
            "URL",
            "Views"
        ]

        function tabulate(data, columnsHead, columnsData) {

            var table = d3.select(selector)
                .append("table")
                .attr("id",'tableID')
                .attr("class", 'tableClass table table-striped table-bordered dt-responsive nowrap')
                .attr("callspacing", "0")
                .attr("width", "100%");

            var thead = table.append('thead');
            var	tbody = table.append('tbody');

            // append the header row
            thead.append('tr')
                .selectAll('th')
                .data(columnsHead)
                .enter()
                .append('th')
                .text(function (column) { return column; });

            // create a row for each object in the data
            var rows = tbody.selectAll('tr')
                .data(data)
                .enter()
                .append('tr');

            // create a cell in each row for each column
            var cells = rows.selectAll('td')
                .data(function (row) {
                    return columnsData.map(function (column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append('td')
                .html(function (d) {
                    if(d.value == ""){
                        return "Data not reported"
                    }else{
                        var item = d["value"]
                        var tststr = d["value"].toString().substring(0,4)
                        if(tststr === "http"){
                            return "<a href="+ d.value+'">'+d.value+"</a>"
                        }else{
                            return item
                        }

                    }

                });
        }
        tabulate(tableData, columnsHead, columnsData);
        $(".tableClass").DataTable();
    };


    selectOc(xf, "#chartSelect");
    langChart(xf, "#chartA");
    pubChart(xf, "#chartB");
    speakChart(xf, "#chartC");
   // tableChart(xf, "#chartTable");
    numChart(xf, "#chartD", "views", "Views", "View Count");
    numChart(xf, "#chartE", "comments", "Comments", "Comment Count");
    viewsCommsChart(xf, "#chartF");
    table(xf, format_data, "#new");

    dc.chartRegistry.list().forEach(function(chart) {
        chart.on('filtered', function() {
            setTimeout(function(){
                table(xf, format_data, "#new");
            }, 1500);
        });
    });
    //.on("filtered", table(xf, format_data, "#tableID"));

    d3.select(window).on("resize.one",function(){
        langsChart.width(parseInt(d3.select("#chartA").style("width"), 10)).redraw();
        pubDateChart.width(parseInt(d3.select("#chartB").style("width"), 10)).redraw();
        numSpeakChart.width(parseInt(d3.select("#chartC").style("width"), 10)).redraw();
        viewCommDateChart.width(parseInt(d3.select("#chartF").style("width"), 10)).redraw();
        selectOccu.width(parseInt(d3.select("#chartSelect").style("width"), 10)).redraw();
    });
}