google.charts.load('current', {'packages':['corechart']});

function drawChart(d) {
    var data = google.visualization.arrayToDataTable(d);

    var options = {
        chartArea: {'width': '90%', 'height': '90%'},
        vAxis: {
            title:'% OF TOTAL SCORE',
            baselineColor: 'none',
            ticks: [],
            minValue: 0,
            gridlines: {
                color: 'transparent'
            }},
        hAxis: {
            baselineColor: 'none',
            ticks: [],
            textPosition: 'none',
            title:'TIME --->'
        },
        isStacked: 'percent',
        legend:{
            position: 'top',
            alignment:'center'
        },
        backgroundColor: { fill:'transparent' },
        series: {
            0: {areaOpacity: 1},
            1: {areaOpacity: 1},
            2: {areaOpacity: 1},
            3: {areaOpacity: 1},
            4: {areaOpacity: 1},
            5: {areaOpacity: 1}
        }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart-div'));
    chart.draw(data, options);
  }