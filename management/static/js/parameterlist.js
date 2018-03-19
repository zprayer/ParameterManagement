$(function() {
    var dt_table;
    dt_table = $('#parameterlist').dataTable({
        ordering: false,
        bDeferRender: true,
        bFilter: true,
        bStateSave: true,
        paging: true,
        pagingType: "bootstrap_full_number",
        lengthMenu: [[5, 10, 20,-1], [5, 10, 20,'All']],
        iDisplayLength: 10,
        //dom: "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        oLanguage: {
            sProcessing: "正在获取数据，请稍后...",
            sLengthMenu: "显示 _MENU_ 条",
            sZeroRecords: "没有找到数据",
            sInfo: "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
            sInfoEmpty: "记录数为0",
            sInfoFiltered: "(全部记录数 _MAX_ 条)",
            sInfoPostFix: "",
            sSearch: "搜索",
            sUrl: "",
            oPaginate: {
                "sFirst": "第一页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "最后一页"
            }
        },
        columns: [
            {mData: null},
            {mData: 'id'},
            {mData: 'name'},
            {mData: 'identifier'},
            {mData: 'name_output'},
            {mData: 'unit'},
            {mData: 'system'},
            {mData: 'responsibility'},
            {mData: 'sensor\\.id'},
            {mData: 'sensor\\.sensor_name'},
            {mData: 'sensor\\.sensor_type'},
            {mData: 'status'},
            {mData: null}


        ],
        columnDefs: [
            {
                render: function (data) {
                    return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="' + data.id + '" name="id"/> <span></span> </label>';
                },
                targets: 0

            },
            {
                render:function(data,type,row){
                    if(data.length)
                    {
                        return  '<span class="row-details row-details-close" data-detailstype = "request_details" data-id=' + row.id + '>&nbsp&nbsp&nbsp&nbsp'+row.name+'</span>' ;
                    }
                    else
                    {
                        return data
                    }
                },
                targets: 2
            },
            {
                render:function(data,type,row){//row.sensor.id报错，row是字典类型，采用row['sensor.id']索引
                    if(data.length)
                    {
                        return  '<span class="row-details row-details-close" data-detailstype = "sensor_details" data-id=' + row['sensor.id'] + '>&nbsp&nbsp&nbsp&nbsp'+row['sensor.sensor_name']+'</span>' ;
                    }
                    else
                    {
                        return data
                    }

                },
                targets: 9
            },
            {
                render: function (data) {
                    //return data = '<button id="DetailOne" class="btn btn-primary btn-sm" data-id=' + data + '>详细信息</button>&nbsp&nbsp<button id="ModifyOne" class="btn btn-info btn-sm" data-id=' + data + '>编 辑</button>&nbsp&nbsp<button id="deleteOne" class="btn btn-danger btn-sm" data-id=' + data + '>删 除</button>';
                    return data = '<span>'+
                    '<div class="btn-group">' +
                    '<button class="btn btn-sm green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> 参数需求 <i class="fa fa-angle-down"></i> </button> ' +
                    '<ul class="dropdown-menu pull-left" role="menu"> ' +
                    '<li> <a id = "RquestModifyOne" data-id =' + data.id + '> <i class="icon-docs"></i> 编辑 </a> </li> ' +
                    '<li> <a id = "RquestDeleteOne" data-id =' + data.id + '> <i class="icon-tag"></i> 删除 </a> </li> ' +
                    '</ul> ' +
                    '</div>' +
                    '</span>&nbsp&nbsp' +
                    '<span>'+
                    '<div class="btn-group">' +
                    '<button class="btn btn-sm green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> 传感器选型 <i class="fa fa-angle-down"></i> </button> ' +
                    '<ul class="dropdown-menu pull-left" role="menu"> ' +
                    '<li> <a id = "SensorModifyOne" data-id =' + data.id + '> <i class="icon-docs"></i> 编辑 </a> </li> ' +
                    '<li> <a id = "SensorDeleteOne" data-id =' + data.id + '> <i class="icon-tag"></i> 删除 </a> </li> ' +
                    '</ul> ' +
                    '</div>' +
                    '</span>&nbsp&nbsp' +
                    '<span>'+
                    '<div class="btn-group">' +
                    '<button class="btn btn-sm green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> 采集设备选型 <i class="fa fa-angle-down"></i> </button> ' +
                    '<ul class="dropdown-menu pull-left" role="menu"> ' +
                    '<li> <a href="javascript:;"> <i class="icon-docs"></i> 编辑 </a> </li> ' +
                    '<li> <a href="javascript:;"> <i class="icon-tag"></i> 删除 </a> </li> ' +
                    '</ul> ' +
                    '</div>' +
                    '</span>'
                },
                targets: 12
            },
            {
                visible: false,
                targets: [1,4,5,8]
            }
        ],
        searching: true,
        processing: true,
        serverSide: true,
        //fnServerParams:function(aoData){
        //    aoData.push({'aircraft_model':$('#aircraftinfo').data('aircraftmodel'),'aircraft_number':$('#aircraftinfo').data('aircraftnumber')});
       // },
       // data:function(d){
       //     d.aircraft_model = jQuery('#aircraftinfo').data('aircraftmodel');
       //     d.aircraft_number = jQuery('#aircraftinfo').data('aircraftnumber');
        //},
        ajax: {
            url:"/parameters_list_json/",
            //type:'POST',datatables用post方法报错，待查
            data:{
                'aircraftinfo_id':$('#aircraftinfo').data('aircraftinfo_id')//通过<h1>中的标签进行parameterlistentry页面传参，在view中获取参数进行过滤
            },
            error:function(data){
                if (data.data.len())
                    alert("请求失败！")
            }
        },
        initComplete: initComplete
    });

    function initComplete(data) {
        var tableWrapper = jQuery('#parameterlist_wrapper');

                dt_table.find('.group-checkable').change(function () {
                    var set = jQuery(this).attr("data-set");
                    var checked = jQuery(this).is(":checked");
                    jQuery(set).each(function () {
                        if (checked) {
                            $(this).prop("checked", true);
                            $(this).parents('tr').addClass("active");
                        } else {
                            $(this).prop("checked", false);
                            $(this).parents('tr').removeClass("active");
                        }
                    });
                });

                dt_table.on('change', 'tbody tr .checkboxes', function () {
                    $(this).parents('tr').toggleClass("active");
                });

    };
    function format ( data,type ) {
        //判断详细信息请求种类：参数需求、传感器、采集设备
        var html_out;
        if(type == 'request_details'){
            html_out = '<table style="width:100%;text-align:left;" class ="table table-striped table-condensed table-hover">' +
            '<tr style="background-color:#c0edf1;"><td width = "20%" >参数名称:</td><td width = "80%">'+ data.name +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">软件标识符:</td><td width = "80%">'+ data.identifier +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">输出符号:</td><td width = "80%">'+ data.name_output +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%" >量程最小值:</td><td width = "80%">'+ data.range_min +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">量程最大值:</td><td width = "80%">'+ data.range_max +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">单位:</td><td width = "80%">'+ data.unit +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%" >精度:</td><td width = "80%">'+ data.accuracy +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">采样率:</td><td width = "80%">'+ data.samplerate +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">参数类型:</td><td width = "80%">'+ data.type +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">参数来源:</td><td width = "80%">'+ data.source +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%" >机载监控:</td><td width = "80%">'+ data.airborne_monitor +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">地面监控:</td><td width = "80%">'+ data.ground_monitor +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">所属系统:</td><td width = "80%">'+ data.system +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">负责方:</td><td width = "80%">'+ data.responsibility +'</td></tr>' +
            '</table>';

        }
        else if(type == 'sensor_details'){
            html_out = '<table style="width:100%;text-align:left;" class ="table table-striped table-condensed table-hover">' +
            '<tr style="background-color:#c0edf1;"><td width = "20%" >传感器名称:</td><td width = "80%">'+ data.sensor_name +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">传感器型号:</td><td width = "80%">'+ data.sensor_type +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">重量:</td><td width = "80%">'+ data.weight +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%" >供电要求:</td><td width = "80%">'+ data.voltage +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">功耗:</td><td width = "80%">'+ data.power +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">输出信号范围:</td><td width = "80%">'+ data.signal_range +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%" >输出信号类型:</td><td width = "80%">'+ data.signal_type +'</td></tr>' +
            '<tr style="background-color:#c0edf1;"><td width = "20%">备注:</td><td width = "80%">'+ data.comment +'</td></tr>' +
            '</table>';
        }
        else if(type =='acquisition_details'){

        }

        return html_out
    };




    $('.table').on('click', ' tbody td .row-details', function() {
        var nTr = $(this).parents('tr')[0];
        var detailsType = $(this).data("detailstype");
        //if (dt_table.fnIsOpen(nTr))
        if(dt_table.api().row(nTr).child.isShown())
        {
           //如果已经显示详细信息，判断是否是同一类详细信息请求,如果不是，先关之前打开的详细信息
           if($(this).hasClass("row-details-open")){
               console.log('ok');
               /* This row is already open - close it */
               $(this).addClass("row-details-close").removeClass("row-details-open");
               //dt_table.fnClose(nTr);
               dt_table.api().row(nTr).child.hide();

           }
           else{
               $(".row-details-open").addClass("row-details-close").removeClass("row-details-open");
               dt_table.api().row(nTr).child.hide();
               $(this).trigger("click");
           }

        }
        else
        {
           /* Open this row */
           $(this).addClass("row-details-open").removeClass("row-details-close");
           // 判断是什么类型的详细信息请求
           if(detailsType == 'request_details'){
               fnFormatDetails(nTr, "/request_parameter_info/",$(this).data("id"),detailsType);
           }
           else if(detailsType == 'sensor_details') {
               fnFormatDetails(nTr, "/request_sensor_info/",$(this).data("id"),detailsType);
           }
           else if(detailsType == 'acquisition_details') {

           }

        }
       });

    function fnFormatDetails(nTr, pUrl,pdataId,pdataType) {
        var id = pdataId;
        var type = pdataType;
        var url = pUrl;
        $.ajax({
            url:url,
            data:"id=" + id,
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success:function(data){
                if (data.res == 'ok')
                {
                    //dt_table.fnOpen(nTr,format(data.responsedata[0],type),type);
                    dt_table.api().row(nTr).child(format(data.responsedata[0],type),type).show();
                }
                else if(data.res == 'not exist')
                    alert("参数已被删除！");
                else
                    alert("查询失败！");
            },
            error:function(){
                alert("请求失败！")

            }
        });
    };



    //按钮事件触发
    //编辑参数
    $(document).delegate('#RquestModifyOne', 'click', function () {
        var id = $(this).data("id");
        $('#modifyBtnSubmit').val(id);
        $('#myModal-modify-info').modal('show');

    });
    //监听编辑模态框弹出事件
    $('#myModal-modify-info').on('show.bs.modal', function () {
     // 执行一些动作...
        var id = $('#modifyBtnSubmit').val();
        $.ajax({
            url: "/request_parameter_info/",
            data: "id=" + id,
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success: function (data) {
                $('#modify_name').attr('value', data.responsedata[0].name);
                $('#modify_identifier').val(data.responsedata[0].identifier);
                $('#modify_name_output').val(data.responsedata[0].name_output);
                $('#modify_range_min').val(data.responsedata[0].range_min);
                $('#modify_range_max').val(data.responsedata[0].range_max);
                $('#modify_unit').val(data.responsedata[0].unit);
                $('#modify_accuracy').val(data.responsedata[0].accuracy);
                $('#modify_samplerate').val(data.responsedata[0].samplerate);
                $('#modify_type').val(data.responsedata[0].type);
                $('#modify_source').val(data.responsedata[0].source);
                $('#modify_airborne_monitor').val(data.responsedata[0].airborne_monitor);
                $('#modify_ground_monitor').val(data.responsedata[0].ground_monitor);
                $('#modify_system').val(data.responsedata[0].system);
                $('#modify_responsibility').val(data.responsedata[0].responsibility);
            },
            error: function (data) {
                alert("请求异常！");
            }
        });



    });
    //提交编辑参数请求
    $(document).delegate('#modifyBtnSubmit','click',function(){
        var id = $(this).val();
        $.ajax({
            url:"/modify_parameter/",
            data:$('#modifyParForm').serialize()+"&id=" + id,
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success:function(data){
                if (data.res == 'ok')
                {

                    $('#myModal-modify-info').modal('hide');
                    //alert("参数修改成功！");
                    window.location.reload();

                }
                else if(data.res == 'not exist')
                    alert("参数已被删除！");
                else
                    alert("删除失败！");
            },
            error:function(){
                alert("请求失败！")

            }
        });
    });
    //新增参数
    $(document).delegate('#add_parameter', 'click', function () {
        var aircraftinfo_id = $('#aircraftinfo').data('aircraftinfo_id');
        $('#addBtnSubmit').val(aircraftinfo_id);
        $('#myModal-add-info').modal('show');
    });
    //提交新增参数请求
    $(document).delegate('#addBtnSubmit', 'click', function () {
        var id = $(this).val();

        $.ajax({
            url: "/add_parameter/",
            data: $('#addParForm').serialize()+"&aircraftinfo_id=" + id,
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.ok == "1")
                {
                    $('#myModal-add-info').modal('hide');
                    window.location.reload();
                }
                else
                    alert(data);
            },
            error: function (data) {
                alert("请求异常！");
            }
        });
    });
    // 删除按钮模态框触发
    $(document).delegate('#RquestDeleteOne', 'click', function () {
        var id = $(this).data("id");//获取删除按钮中的data-id的值
        console.log(id);
        $("#delSubmit").val(id);//赋值给删除确认按钮
        $("#deleteOneModal").modal('show');
    });
    //提交删除请求
    $(document).delegate('#delSubmit', 'click', function () {
        var id = $(this).val();
        $('#deleteOneModal').modal('hide');
        $.ajax({
            url: "/delete_parameter/",
            data: "id=" + id,
            async: true,
            type: "GET",
            dataType: "json",
            cache: false,    //不允许缓存
            success: function (data) {
                if (data.ok == '1') {
                    alert("删除成功");
                    window.location.reload();
                }
                else {
                    alert("删除失败");
                }


            },
            error: function (data) {
                alert("请求异常");
            }
        });
    });
    //绑定传感器触发
    $(document).delegate('#SensorModifyOne', 'click', function () {
        var id = $(this).data("id");
        console.log(id);
        $("#modifySensorBtnSubmit").val(id);
        console.log('btnsubmit:' + id)
        $("#myModal-modify-sensor").modal('show');
    });
    //绑定传感器
    $(document).delegate('#modifySensorBtnSubmit','click',function(){
        var sensor_id = $('#id').val();
        var parmeter_id = $(this).val();
        console.log(sensor_id);
        console.log(this);
        $.ajax({
            url: "/bind_sensor/",
            data: "parameter_id=" + parmeter_id + "&sensor_id=" + sensor_id,
            async: true,
            type: "GET",
            dataType: "json",
            cache: false,    //不允许缓存
            success: function (data) {
                if (data.res == '传感器绑定成功！') {
                    alert(data.res);
                    $('#myModal-modify-sensor').modal('hide');
                    window.location.reload();
                }
                else {
                    alert(data.res);
                }


            },
            error: function (data) {
                alert("请求异常");
            }
        });
    });
    //解绑传感器触发
    $(document).delegate('#SensorDeleteOne', 'click', function () {
        var id = $(this).data("id");
        $("#delSensorSubmit").val(id);
        $("#myModal-delete-sensor").modal('show');
    });
    //解绑传感器提交
    $(document).delegate('#delSensorSubmit', 'click', function () {
        var id = $(this).val();

        $.ajax({
            url: "/unbind_sensor/",
            data: "parameter_id=" + id,
            async: true,
            type: "GET",
            dataType: "json",
            cache: false,    //不允许缓存
            success: function (data) {
                if (data.res == '传感器已解绑！') {
                    alert(data.res);
                    $('#deleteOneModal').modal('hide');
                    window.location.reload();
                }
                else {
                    alert(data.res);
                }


            },
            error: function (data) {
                alert("请求异常");
            }
        });
    });
});
