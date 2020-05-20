$('#type').on('change', function(e) {
    let selectedType = $(this).children("option:selected").val();
    console.log(selectedType);
    $("#class > option").hide();
    $("#class > option").filter(function(){return $(this).data('pub') == selectedType}).show();
});     

$('#class').on('change', function(e) {
    let selectedClass = $(this).children("option:selected").val();
    console.log(selectedClass);
    $("#student > option").hide();
    $("#student > option").filter(function(){return $(this).data('pub') == selectedClass}).show();
    
});     