
$(document).ready(function() { 

           $.ajax({
            url:"/statistics_parameter/",
            data:"1",
            cache: false,
            type: "GET",
            dataType: "json",
            async: false,
            success:function(data){
                $('#sum_parameter').text(data.parameter_count);
				$('#sum_sensor').text(data.sensor_count);
				/* $('#1all').text(data.sensor_count);
				$('#1used').text(data.sensor_count);
				$('#1unused').text(data.sensor_count */
				$('#1all').text("100");
				$('#1used').text("20");
				$('#1unused').text("80");
            },
            error:function(){
                alert("222")

            },
			
});
	/* 
		$('#myTable5').gvChart({
		chartType: 'PieChart',
		gvSettings: {
			vAxis: {title: 'No of players'},
			hAxis: {title: 'Month'},
			width: 600,
			height: 350
		}
	});				 */



});