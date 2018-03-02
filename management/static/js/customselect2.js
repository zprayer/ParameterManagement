/**
 * Created by lenovo on 2018/2/28.
 */
$(function() {
    function formatRepo(repo) {
        repo.text = repo.sensor_type
        repo.id = repo.id
        console.log(repo.text)
        /*var markup = '<div class="clearfix">' +
        '<div id = ' + repo.id +'>' + repo.text + '</div>' +
        '</div>';*/
        return repo.text;
    }

    function formatRepoSelection(repo) {return repo.full_name || repo.text;}
    $.fn.select2.defaults.set("theme", "bootstrap");
    $("#select2-button-addons-single-input-group-sm").select2({
        placeholder: "请输入后选择传感器型号",
        width: "off",
        ajax: {
            type:'GET',
            url: "/select_sensor/",
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    q: params.term, // search term
                    page: params.page
                };
            },
            processResults: function(data, page) {
                // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function(markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection
    });
    $('#select2-button-addons-single-input-group-sm').on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
        $('#id').val(data.id);
        $('#sensor_name').val(data.sensor_name);
        $('#sensor_type').val(data.sensor_type);
        $('#weight').val(data.weight);
        $('#power').val(data.power);
        $('#voltage').val(data.voltage);
        $('#signal_range').val(data.signal_range);
        $('#signal_type').val(data.signal_type);
        $('#comment').val(data.comment);
    });
});



