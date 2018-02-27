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
        aoColumns: [
            {
                mData: 'id',
                mRender: function (data, type, full, meta) {
                    return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="' + data + '" name="id"/> <span></span> </label>';
                }

            },
            {mData: 'id'},
            {mData: 'name'},
            {mData: 'identifier'},
            {mData: 'name_output'},
            {mData: 'unit'},
            {mData: 'system'},
            {mData: 'responsibility'},
            {mData: 'sensor\\.sensor_name'},
            {mData: 'sensor\\.sensor_type'},
            {mData: 'status'},
            {
                mData: 'id',
                mRender: function (data, type, full, meta) {
                    //return data = '<button id="DetailOne" class="btn btn-primary btn-sm" data-id=' + data + '>详细信息</button>&nbsp&nbsp<button id="ModifyOne" class="btn btn-info btn-sm" data-id=' + data + '>编 辑</button>&nbsp&nbsp<button id="deleteOne" class="btn btn-danger btn-sm" data-id=' + data + '>删 除</button>';
                    return data = '<span>'+
                    '<div class="btn-group">' +
                    '<button class="btn btn-sm green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> 参数需求 <i class="fa fa-angle-down"></i> </button> ' +
                    '<ul class="dropdown-menu pull-left" role="menu"> ' +
                    '<li> <a id = "RquestModifyOne" data-id =' + data + '> <i class="icon-docs"></i> 编辑 </a> </li> ' +
                    '<li> <a id = "RquestDeleteOne" data-id =' + data + '> <i class="icon-tag"></i> 删除 </a> </li> ' +
                    '</ul> ' +
                    '</div>' +
                    '</span>&nbsp&nbsp' +
                    '<span>'+
                    '<div class="btn-group">' +
                    '<button class="btn btn-sm green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> 传感器选型 <i class="fa fa-angle-down"></i> </button> ' +
                    '<ul class="dropdown-menu pull-left" role="menu"> ' +
                    '<li> <a type="submit" data-target="#myModal-modify-sensor" data-toggle="modal" data-id =' + data + '> <i class="icon-docs"></i> 编辑 </a> </li> ' +
                    '<li> <a href="javascript:;"> <i class="icon-tag"></i> 删除 </a> </li> ' +
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
                }
            }


        ],
        aoColumnDefs: [
            /*{
            sDefaultContent: "Not found",
            aTargets: ['_all']
        },*/
            {
                bVisible: false,
                aTargets: [1,4,5]
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
    console.log($('#aircraftinfo').data('aircraftmodel'));

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

    }

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
        console.log(id)
        console.log($('#modifyParForm').serialize()+"id="+id);
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
                if (data.ok = "1")
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
                if (data.ok = '1') {
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
    //单选、多选
	/**
	 * 多选选中和取消选中,同时选中第一个单元格单选框,并联动全选单选框

	$('#parametertable tbody').on('click', 'tr', function(event) {
		var allChecked=$('input[name=allChecked]')[0];//关联全选单选框
		$($(this).children()[0]).children().each(function(){
			if(this.type=="checkbox" && (!$(event.target).is(":checkbox") && $(":checkbox",this).trigger("click"))){
				if(!this.checked){
					this.checked = true;
					addValue(this);
					var selected=dt_table.api().rows('.selected').data().length;//被选中的行数
					//全选单选框的状态处理
					var recordsDisplay=dt_table.api().page.info().recordsDisplay;//搜索条件过滤后的总行数
					var iDisplayStart=dt_table.api().page.info().start;// 起始行数
					if(selected === dt_table.api().page.len()||selected === recordsDisplay||selected === (recordsDisplay - iDisplayStart)){
						allChecked.checked = true;
					}
				}else{
					this.checked = false;
					cancelValue(this);
					allChecked.checked = false;
				}
			}
		});
		$(this).toggleClass('selected');//放在最后处理，以便给checkbox做检测
        console.log($(this).val())
	});
*/


	/**
	 * 全选按钮被点击事件

	$('input[name=allChecked]').click(function(){
		if(this.checked){
			$('#parametertable tbody tr').each(function(){
				if(!$(this).hasClass('selected')){
					$(this).click();
				}
			});
		}else{
			$('#parametertable tbody tr').click();
		}
	});
*/
	/**
	 * 单选框被选中时将它的value放入隐藏域

	function addValue(para) {
		var userIds = $("input[name=id]");
		if(userIds.val() === ""){
			userIds.val($(para).val());
		}else{
			userIds.val(userIds.val()+","+$(para).val());
		}
	}
*/
	/**
	 * 单选框取消选中时将它的value移除隐藏域

	function cancelValue(para){
		//取消选中checkbox要做的操作
		var userIds = $("input[name=allChecked]");
		var array = userIds.val().split(",");
		userIds.val("");
		for (var i = 0; i < array.length; i++) {
			if (array[i] === $(para).val()) {
				continue;
			}
			if (userIds.val() === "") {
				userIds.val(array[i]);
			} else {
				userIds.val(userIds.val() + "," + array[i]);
			}
		}
	}
*/


});
