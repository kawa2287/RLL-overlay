google.charts.load('current', {'packages':['corechart']});

function drawChart(d,colors) {
    var data = google.visualization.arrayToDataTable(d);

    var options = {
        chartArea: {'width': '90%', 'height': '90%'},
        vAxis: {
            title:'% OF TOTAL SCORE',
            baselineColor: 'none',
            ticks: [],
            minValue: 0,
            gridlines: {
                color: 'white',
                count:5,
                lineDashStyle:[5, 1, 3] 
            }},
        hAxis: {
            baselineColor: 'none',
            ticks: [],
            textPosition: 'none',
            title:'TIME --->'
        },
        isStacked: 'percent',
        legend:{
            position: 'none'
        },
        backgroundColor: { fill:'transparent' },
        series:{}
    };

    //set chart colors
    let counter = 0;
    for (var x = 0; x < colors.length; x++)
    {
        for(var n = 0; n <colors[x].length; n++)
        {
            options["series"][counter] = {areaOpacity:1,color:colors[x][n]};
            counter += 1;
        }
    }

    var chart = new google.visualization.AreaChart(document.getElementById('chart-div'));
    chart.draw(data, options);
  }