
//
 $(document).ready(function()
                {
	

                 
  $.ajax({
            url:"/statistics_parameter/",
            data:"1",
            cache: false,
            type: "GET",
            dataType: "json",
            async: false,
            success:function(data){
                /* $('#sum_parameter').text(data.parameter_count);
				$('#sum_sensor').text(data.sensor_count);
				
				$('#1all').text("100");
				$('#1used').text("20");
				$('#1unused').text("80"); */
				var data1 = {
    labels: ["1#", "2#", "3#", "4#", "5#", "6#", "7#","8#", "9#", "10#", "11#", "12#", "13#", "14#","15#", "16#",],// "17#", "18#", "19#", "20#", "21#",],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "#be1e2d",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data:[],// [65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, ],//80, 81, 56, 55, 40,]
        },
        {
            label: "My Second dataset",
            fillColor: "#00a79d",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data:[],// [28, 48, 40, 19, 86, 27, 90,28, 48, 40, 19, 86, 27, 90,28, 48,],// 40, 19, 86, 27, 900]
        }
    ]
};
var data2 = {
    labels: ["17#", "18#", "19#", "20#", "21#", "22#", "23#","24#", "25#", "26#", "27#", "28#", "29#", "30#","31#", "32#",],// "17#", "18#", "19#", "20#", "21#",],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "#be1e2d",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, ],//80, 81, 56, 55, 40,]
        },
        {
            label: "My Second dataset",
            fillColor: "#00a79d",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90,28, 48, 40, 19, 86, 27, 90,28, 48,],// 40, 19, 86, 27, 900]
        }
    ]
};
				for(var i = 1; i <16;i++)
   { 
    data1.datasets[0].data.push(i);//将数组arr2中的值写入data
	data1.datasets[1].data.push(i);
   }
   data1.datasets[0].data.push(data.parameter_count);//将数组arr2中的值写入data
	data1.datasets[1].data.push(100);
   var options = {
  scaleFontColor: "black"
};

var ctx1 = document.getElementById("bar-canvas-1").getContext("2d");
var ctx2 = document.getElementById("bar-canvas-2").getContext("2d");
var myBarChart = new Chart(ctx1).Bar(data1, options);
var myBarChart = new Chart(ctx2).Bar(data2, options);
				
            },
            error:function(){
                alert("222")

            },
			
			
			
			/*  for(var i = 1; i <16;i++)
   { 
    data1.datasets[0].data.push(i);//将数组arr2中的值写入data
	data1.datasets[1].data.push(i);
   } */

			
});				

				})///
