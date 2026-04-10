function fetchDataAndUpdateValues() {
    fetch('/get-datavalue')
        .then(response => response.json())
        .then(data => {
            updatevalue(data);
        })
        .catch(error => console.error('Error:', error));
}

function updatevalue(data) {
    am5.ready(function() {
        var root = am5.Root.new("valuediv");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        var chart = root.container.children.push(am5percent.SlicedChart.new(root, {
            layout: root.verticalLayout
        }));

        var series = chart.series.push(am5percent.FunnelSeries.new(root, {
            alignLabels: false,
            orientation: "vertical",
            valueField: "Total Profit",        
            categoryField: "Sales Channel"      
        }));


        series.data.setAll(data);
        series.appear();

        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50,
            marginTop: 15,
            marginBottom: 15
        }));

        legend.data.setAll(data);
        console.log(data);

        chart.appear(1000, 100);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchDataAndUpdateValues();
});
