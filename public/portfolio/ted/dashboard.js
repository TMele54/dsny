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

        data.forEach(function(d){
            d["durationFormatted"] = d["duration"].toString().toHHMMSS();
            d["film_date"] = new Date(d["film_date"] * 1000);
            d["published_date"] = new Date(d["published_date"] * 1000);

        });

        return data
    };

    // Make xf object
    xf = crossfilter(formatData(data));

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
            .height(150)
            .x(d3.scale.linear().domain([d3.min(ref_data, langs), d3.max(ref_data, langs)]))
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(langsDim)
            .group(langsGroup)
            .transitionDuration(500)
            .centerBar(true)
            .gap(65)
            //.filter([3, 5])
            .elasticY(true)
            .xAxis()
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

        pubDate = function(d){return d["published_date"]}
        pubDateChart = dc.lineChart(selector);
        pubDateDim = xf.dimension(function(d){return d["published_date"]})
        pubDateGroup = pubDateDim.group().reduceCount(function(d){return d["published_date"]})

        pubDateChart
            .width(parseInt(d3.select(selector).style("width"), 10))
            .height(150)
            .x(d3.time.scale().domain([d3.min(ref_data, pubDate), d3.max(ref_data, pubDate)]))
            .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(pubDateDim)
            .group(pubDateGroup)
            .transitionDuration(500).interpolate("basis")
            //.centerBar(true)
            //.gap(65)
            //.filter([3, 5])
            .elasticY(true)
            .xAxis()
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
            .height(150)
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
        selectOccu
            .dimension(selectOccuDim).group(selectOccuDim.group()).multiple(true)
            .numberVisible(3).controlsUseVisibility(true);
        selectOccu.render()
    }; /*Select Box - Values*/
    function tableChart(xf, selector){










        tableChar = dc.dataTable(selector);
        tableChartDim = xf.dimension(function(d){return d["name"]});
        tableChartGroup = tableChartDim.group();

        tableChar
            .dimension(tableChartDim)
            .group(tableChartGroup)
            //.size(17)
            .order(d3.ascending)
            .columns([
                {
                label: "1",
                format: function (d) { return d["comments"]; }
                },
                {
                label: "2",
                format: function (d) { return d["description"]; }
                },
                {
                label: "3",
                format: function (d) { return d["duration"]; }
                },
                {
                label: "4",
                format: function (d) { return d["event"]; }
                },
                {
                label: "5",
                format: function (d) { return d["film_date"]; }
                },
                {
                label: "6",
                format: function (d) { return d["languages"]; }
                },
                {
                label: "7",
                format: function (d) { return d["main_speaker"]; }
                },
                {
                label: "8",
                format: function (d) { return d["name"]; }
                },
                {
                label: "9",
                format: function (d) { return d["num_speaker"]; }
                },
                {
                label: "10",
                format: function (d) { return d["published_date"]; }
                },
                {
                label: "11",
                format: function (d) { return d["ratings"]; }
                },
                {
                label: "12",
                format: function (d) { return d["related_talks"]; }
                },
                {
                label: "13",
                format: function (d) { return d["speaker_occupation"]; }
                },
                {
                label: "14",
                format: function (d) { return d["tags"]; }
                },
                {
                label: "15",
                format: function (d) { return d["title"]; }
                },
                {
                label: "16",
                format: function (d) { return d["url"]; }
                },
                {
                label: "17",
                format: function (d) { return d["views"]; }
            }
        ]).sortBy(function(d){return d["published_date"]});

        tableChar.render();
    };

    selectOc(xf, "#chartSelect");
    langChart(xf, "#chartA");
    pubChart(xf, "#chartB");
    speakChart(xf, "#chartC");
    tableChart(xf, "#chartTable");


    d3.select(window).on("resize.one",function(){
        langsChart.width(parseInt(d3.select("#chartA").style("width"), 10)).redraw();
        pubDateChart.width(parseInt(d3.select("#chartB").style("width"), 10)).redraw();
        numSpeakChart.width(parseInt(d3.select("#chartC").style("width"), 10)).redraw();
    });
}