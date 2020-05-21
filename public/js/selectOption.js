$('#type').on('change', function(e) {
    let selectedType = $(this).children("option:selected").val();
    $("#class > option").hide();
    $('select option:contains("--Chọn lớp--")').prop('selected',true);
    $('select option:contains("--Chọn học viên--")').prop('selected',true);
    $("#class > option").filter(function(){return $(this).data('pub') == selectedType}).show();
});     

$('#class').on('change', function(e) {
    let selectedClass = $(this).children("option:selected").val();
    $("#student > option").hide();
    $('select option:contains("--Chọn học viên--")').prop('selected',true);
    $("#student > option").filter(function(){return $(this).data('pub') == selectedClass}).show();
});     