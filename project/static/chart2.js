function fetchDataAndUpdateTable() {
    fetch('/get-datatable')
        .then(response => response.json())
        .then(data => {
            updateDataTable(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateDataTable(data) {
    am5.ready(function() {
        var root = am5.Root.new("datadiv");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panY",
            wheelY: "zoomY",
            pinchZoomY: true,
            paddingLeft: 0,
            paddingRight: 1
        }));

        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineX.set("visible", false);

        var xRenderer = am5xy.AxisRendererX.new(root, {
            strokeOpacity: 0.1
        });

        var yRenderer = am5xy.AxisRendererY.new(root, {
            minGridDistance: 30,
            minorGridEnabled: true
        });

        yRenderer.labels.template.setAll({
            rotation: 0,
            paddingRight: 10
        });

        var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "region", 
            renderer: yRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: xRenderer
        }));

        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Total Revenue",
            yAxis: yAxis,
            xAxis: xAxis,
            valueXField: "revenue", 
            sequencedInterpolation: true,
            categoryYField: "region",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueX}"
            })
        }));

        series.columns.template.setAll({ cornerRadiusBL: 5, cornerRadiusBR: 5, strokeOpacity: 0 });
        series.columns.template.adapters.add("fill", function (fill, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", function (stroke, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

   
        yAxis.data.setAll(data);
        series.data.setAll(data);

        series.appear(1000);
        chart.appear(1000, 100);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchDataAndUpdateTable();
});
