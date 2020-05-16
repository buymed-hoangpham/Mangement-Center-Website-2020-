let idStudent;
let numberTr = 0;
$('#studentname').on('change', function(e) {
    idStudent = e.target.value;
})
$('#addNewRowBtn').on('click', function(e) {
    let arrSplited = idStudent.split('-');
    $(this).parent().parent().parent().append(
        `<tr class="tr" data-id="${++numberTr}">
            <td class="align-middle"><input type="text" class="form-control" name="optionValue" value="Id: ${arrSplited[0]} - Tên: ${arrSplited[1]}"></td>
            <td></td>
            <td class="text-center"><button type="button" class="btn btn-outline-danger" onclick="handleDelete(event)">Xóa</button></td>
        </tr>`
    )
})
$('.deleteThisRowBtn').on('click', function(e) {
    console.log($(this))
    console.log(dataset.id);
    console.log('aaa');
})
function handleDelete(e) {
    let idTr = e.target.parentElement.parentElement.dataset.id
    $(e.target.parentElement.parentElement).remove()
}