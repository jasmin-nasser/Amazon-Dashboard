function fetchDataAndUpdateDemo() {
    fetch('/get_datademo')
        .then(response => response.json())
        .then(data => {
            updateDemo(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateDemo(data) {
    am5.ready(function () {
        var root = am5.Root.new("demodiv");
        root.setThemes([ am5themes_Animated.new(root) ]);

        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                paddingLeft: 5,
                paddingRight: 5
            })
        );

        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        var xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 60,
            minorGridEnabled: true
        });
        var xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                maxDeviation: 0.3,
                categoryField: "Item Type", 
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            })
        );

        xRenderer.grid.template.setAll({
            location: 1
        });
        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })
            })
        );

        var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Units Sold",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Units Sold", 
                sequencedInterpolation: true,
                categoryXField: "Item Type" 
            })
        );

        series.columns.template.setAll({
            width: am5.percent(120),
            fillOpacity: 0.9,
            strokeOpacity: 0
        });
        

        series.columns.template.adapters.add("fill", (fill, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        series.columns.template.adapters.add("stroke", (stroke, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.set("draw", function (display, target) {
            var w = target.getPrivate("width", 0);
            var h = target.getPrivate("height", 0);
            display.moveTo(0, h);
            display.bezierCurveTo(w / 4, h, w / 4, 0, w / 2, 0);
            display.bezierCurveTo(w - w / 4, 0, w - w / 4, h, w, h);
        });
        xAxis.data.setAll(data);
        series.data.setAll(data);

        series.appear(1000);
        chart.appear(1000, 100);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchDataAndUpdateDemo();
});
