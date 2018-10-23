angular.module('machineLearner', []).
   //camel cased directive name
   //in your HTML, this will be named as bars-chart
   directive('algorithm', function ($parse) {
        var directive = {
            restrict: 'E',
            replace: false,
            scope: {data: '=learnerData'},
            link: function (scope, element, attrs) {


               //Data Elements
                var model_attr = scope.data[0].model_attributes;
                var most_informative = scope.data[0].most_informative;

                function table(data, selector){

                    var columnsData = [
                        "Token",
                        "Polarity",
                        "Strength"
                    ]
                    var columnsHead = [
                        // "Filter Dashboard",
                        "Token",
                        "Polarity",
                        "Strength"
                    ]

                    function tabulate(data, columnsHead, columnsData) {
                        var table = d3.select(selector)//.append('table').attr("class", 'tableClass');
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
                            .text(function (d) {
                                if(d.value == ""){
                                    return "Data not reported"
                                }else{
                                    return d.value
                                }

                            });
                        //$('.tableClass').DataTable();
                        return table;
                    }
                    tabulate(data, columnsHead, columnsData)
                };
                function get_polarity(word){
                    var request = new XMLHttpRequest();
                    var request_string = 'http://54.156.184.49:5000/mele/api/naiveBayes?word='+word;
                    console.log(request_string)
                    request.open('GET', request_string, true);
                    request.onload = function () {

                      // Begin accessing JSON data here
                      var data = JSON.parse(this.response);

                      if (request.status >= 200 && request.status < 400) {
                        console.log(JSON.stringify(data))
                      } else {
                        console.log('error');
                      }
                    }

                    request.send();

                }


                table(most_informative, "#tableID");

                get_polarity("happy")

         }
      };
      return directive;
   });

function Ctrl($scope) {
    //Data Elements
    var most_informative_features = [
        {"Token": "Magnificent","Polarity": "Positive", "Strength": "15.0 : 1" },
        {"Token": "Outstanding","Polarity": "Positive", "Strength": "13.6 : 1" },
        {"Token": "Insulting","Polarity": "Negative", "Strength": "13.0 : 1" },
        {"Token": "Religion","Polarity": "Positive", "Strength": "12.3 : 1" },
        {"Token": "Vulnerable","Polarity": "Positive", "Strength": "12.3 : 1" },
        {"Token": "Ludicrous","Polarity": "Negative", "Strength": "11.8 : 1" },
        {"Token": "Avoids","Polarity": "Positive", "Strength": "11.7 : 1" },
        {"Token": "Uninvolving","Polarity": "Negative", "Strength": "11.7 : 1" },
        {"Token": "Astounding","Polarity": "Positive", "Strength": "10.3 : 1" },
        {"Token": "Fascination","Polarity": "positvie", "Strength": "10.3 : 1" },
    ]
    var model_attributes = [
        {"positive_features_count":1000,"negative_features_count":1000}

        ];
    //put object in here, and access it in the directive.. just a dashboard is needed, not any special visualization

    $scope.nb = [{"most_informative": most_informative_features, "model_attributes":model_attributes}];
}