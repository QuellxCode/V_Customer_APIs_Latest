
$(document).ready(function(){
    $('[tool-tip-toggle="tooltip-demo"]').tooltip({
        placement : 'top'
    });
});


jQuery(document).ready(function() {

    var _initSparklineChart = function(src, data, color, border) {
        if (src.length == 0) {
            return;
        }

        var config = {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
                datasets: [{
                    label: "",
                    borderColor: color,
                    borderWidth: border,

                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 12,
                    pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                    pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                    pointHoverBackgroundColor: mUtil.getColor('danger'),
                    pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
                    fill: false,
                    data: data,
                }]
            },
            options: {
                title: {
                    display: false,
                },
                tooltips: {
                    enabled: false,
                    intersect: false,
                    mode: 'nearest',
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10
                },
                legend: {
                    display: false,
                    labels: {
                        usePointStyle: false
                    }
                },
                responsive: true,
                maintainAspectRatio: true,
                hover: {
                    mode: 'index'
                },
                scales: {
                    xAxes: [{
                        display: false,
                        gridLines: false,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: false,
                        gridLines: false,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },

                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 12
                    },
                },

                layout: {
                    padding: {
                        left: 0,
                        right: 10,
                        top: 5,
                        bottom: 0
                    }
                }
            }
        };

        return new Chart(src, config);
    }

    _initSparklineChart($('#m_chart_quick_stats_1'), [10, 14, 18, 11, 9, 12, 14, 17, 18, 14], mUtil.getColor('brand'), 3);
    _initSparklineChart($('#m_chart_quick_stats_2'), [11, 12, 18, 13, 11, 12, 15, 13, 19, 15], mUtil.getColor('danger'), 3);
    _initSparklineChart($('#m_chart_quick_stats_3'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('success'), 3);
    _initSparklineChart($('#m_chart_quick_stats_4'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('danger'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_5'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('success'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_6'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  


    _initSparklineChart($('#m_chart_quick_stats_7'), [13, 10, 9, 11, 10, 9, 8, 10, 9, 13], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_8'), [13, 10, 9, 8, 8, 9, 8, 10, 9, 13], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_9'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_10'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('danger'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_11'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('success'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_12'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  


    _initSparklineChart($('#m_chart_quick_stats_13'), [13, 10, 9, 11, 10, 9, 8, 10, 9, 13], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_14'), [13, 10, 9, 8, 8, 9, 8, 10, 9, 13], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_15'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_16'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('danger'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_17'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('success'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_18'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  



    _initSparklineChart($('#m_chart_quick_stats_19'), [13, 10, 9, 11, 10, 9, 8, 10, 9, 13], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_20'), [13, 10, 9, 8, 8, 9, 8, 10, 9, 13], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_21'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_22'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('danger'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_23'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('success'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_24'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  


    _initSparklineChart($('#m_chart_quick_stats_form2'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_form3'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_form4'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_form5'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_form6'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
    _initSparklineChart($('#m_chart_quick_stats_form7'), [12, 12, 18, 11, 15, 12, 13, 16, 11, 18], mUtil.getColor('brand'), 3);  
   

    
    //Widget Charts Ends

    $(".chatServiceButton").click(function(){
        $("#m_quick_sidebar_toggle").click();
        /*
        $("#m_quick_sidebar_close").removeClass("m-quick-sidebar--on");
        $("#m_quick_sidebar").addClass("m-quick-sidebar--on");
        $(".m-quick-sidebar__content").removeClass("m--hide");
        */
    });

$("#adjustRadius").click(function(){
   $("#radiusModal").modal('show');
});


     


});