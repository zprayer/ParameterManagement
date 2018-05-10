$(function() {
    var dt_table;
    dt_table = $('#sensorlist').dataTable({
        dom:'lBfrtip',
		ordering: false,
        bDeferRender: true,
        bFilter: true,
        bStateSave: true,
        paging: true,
        pagingType: "bootstrap_full_number",
        lengthMenu: [[5, 10, 20,-1], [5, 10, 20,'All']],
        iDisplayLength: 10,
		buttons: 
        [
		 {
               extend: 'collection',
               text: ' 导出工具 ',
			   className:'fa fa-angle-down',
			   width:'200',
			   style:"background-color:blue",
				
               buttons: [
			  // */
				 
				// {
				//	'extend': 'colvis', 
					
				//},  */
				{  
            'extend': 'print',  
            'text': '  打印',
            'className':"fa fa-print",//按钮的class名称
				},
                 {  
            'extend': 'excel',  
            'text': '  保存为excel',
			'title':'传感器数据库',
            'className':'fa fa-file-excel-o',//按钮的class名称
				} , 
                 {  
            'extend': 'pdf',  
            'text': '  保存为pdf',
			'title':'传感器数据库',
            'className':'fa fa-file-pdf-o',//按钮的class名称 btn green  btn-outline
				}   
                    
               ]
            }
              
		],
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
            {mData: 'sensor_name'},
            {mData: 'sensor_type'},
            {mData: 'weight'},
            {mData: 'voltage'},
            {mData: 'power'},
            {mData:'signal_range'},
            {mData:'signal_type'},
            {mData:'comment'},
            {
                mData: 'id',
                mRender: function (data, type, full, meta) {
                    return data = '<button id="DetailOne" class="btn btn-primary btn-sm" data-id=' + data + '>详细信息</button>&nbsp&nbsp<button id="ModifyOne" class="btn btn-info btn-sm" data-id=' + data + '>编 辑</button>&nbsp&nbsp<button id="deleteOne" class="btn btn-danger btn-sm" data-id=' + data + '>删 除</button>';
                }
            }


        ],
        aoColumnDefs: [{
            sDefaultContent: "Not found",
            aTargets: ['_all']
        }
        ],
        searching: true,
        processing: true,
        serverSide: true,
        ajax:"/sensor_list_json/",
        initComplete: initComplete
    });

    function initComplete(data) {
        var tableWrapper = jQuery('#sensorlist_wrapper');

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
	//传感器修改权限控制
    $(document).delegate('#ModifyOne', 'click', function () {
        var id = $(this).data("id");
       // $('#modifyBtnSubmit').val(id);
        //$('#myModal-modify-info').modal('show');
        $.ajax({
            url:"/change_sensor_permission/",
            data:$('#RquestModifyOne').data("id"),
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success:function(data){
                if (data.permisson == 'true')
                {
                  
                    $('#modifyBtnSubmit').val(id);
                    $('#myModal-modify-info').modal('show');
                }
				else 
					alert("没有修改传感器权限！")
			},
             error:function(){
                alert("请求异常！")
            } 
			});
		
    });
    //监听编辑模态框弹出事件
    $('#myModal-modify-info').on('show.bs.modal', function () {
     // 执行一些动作...
        var id = $('#modifyBtnSubmit').val();
        $.ajax({
            url: "/request_sensor_info/",
            data: "id=" + id,
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success: function (data) {
                $('#modify_sensor_name').val(data.responsedata[0].sensor_name);
                $('#modify_sensor_type').val(data.responsedata[0].sensor_type);
                $('#modify_weight').val(data.responsedata[0].weight);
                $('#modify_voltage').val(data.responsedata[0].voltage);
                $('#modify_power').val(data.responsedata[0].power);
                $('#modify_signal_range').val(data.responsedata[0].signal_range);
                $('#modify_signal_type').val(data.responsedata[0].signal_type);
                $('#modify_comment').val(data.responsedata[0].comment);
            },
            error: function (data) {
                alert("请求异常！");
            }
        });



    });
    //提交编辑参数请求
    $(document).delegate('#modifyBtnSubmit','click',function(){
        var id = $(this).val();
        //console.log(id)
        //console.log($('#modifyParForm').serialize()+"id="+id);
        $.ajax({
            url:"/modify_sensor/",
            data:$('#modifySensorForm').serialize()+"&id=" + id,
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
                    alert("传感器型号已被删除！");
                else
                    alert("删除失败！");
            },
            error:function(){
                alert("请求失败！")

            }
        });
    });
    //新增参数
    $(document).delegate('#add_sensor', 'click', function () {
        $('#myModal-add-info').modal('show');
    });
    //提交新增参数请求
	//表单验证
    $(document).delegate('#addBtnSubmit', 'click', function () {
        $.ajax({
            url: "/add_sensor/",
            data: $('#addSensorForm').serialize(),
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success: function (data) {
               if (data.check == "必填项不能为空")
                {
					
					$('#alert-danger-2').attr('class', 'alert alert-danger display-hide');
					$('#alert-danger-1').attr('class', 'alert alert-danger');
					
					alert("必填项不能为空");
                    /* $('#myModal-add-info').modal('hide');
                    window.location.reload(); */
                }
                else if (data.check == "传感器型号已存在，请核对")
				{	
			        $('#alert-danger-1').attr('class', 'alert alert-danger display-hide');
                    $('#alert-danger-2').attr('class', 'alert alert-danger');
                    alert("传感器型号已存在，请核对");
					$('#myModal-add-info').modal('show');
				}
				else
				{
					alert("添加成功");
					$('#alert-success').attr('class', 'alert-success');
                    $('#myModal-add-info').modal('hide');
                    window.location.reload(); 
                }
            },
            error: function (data) {
                alert("请求异常！");
            }
        });
    });
    // 删除按钮模态框触发
	//删除传感器权限控制
    $(document).delegate('#deleteOne', 'click', function () {
        var id = $(this).data("id");//获取删除按钮中的data-id的值
        console.log(id);
        //$("#delSubmit").val(id);//赋值给删除确认按钮
        //$("#deleteOneModal").modal('show');
		$.ajax({
            url:"/change_sensor_permission/",
            data:$('#RquestModifyOne').data("id"),
            cache: false,
            type: "GET",
            dataType: "json",
            async: true,
            success:function(data){
                if (data.permisson == 'true')
                {
                  
                   $("#delSubmit").val(id);//赋值给删除确认按钮
                   $("#deleteOneModal").modal('show');
                }
				else 
					alert("没有删除传感器权限！")
			},
            error:function(){
                alert("请求异常！")
            } 
			});
		
    });
    //提交删除请求
    $(document).delegate('#delSubmit', 'click', function () {
        var id = $(this).val();
        $('#deleteOneModal').modal('hide');
        $.ajax({
            url: "/delete_sensor/",
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
