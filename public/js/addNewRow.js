let idStudent;
let count = 0;
let numberTr = 0;
$('#studentname').on('change', function(e) {
    idStudent = e.target.value;
})
$('#addNewRowBtn').on('click', function(e) {
    let arrSplited = idStudent.split('-');
    $(this).parent().parent().parent().append(
        `<tr class="tr" id="${numberTr++}">
            <td class="text-center align-middle">${++count}</td>
            <td class="align-middle"><input type="text" class="form-control" name="optionValue" value="Id: ${arrSplited[0]} - Tên: ${arrSplited[1]}"></td>
            <td></td>
            <td class="text-center"><button type="button" class="btn btn-outline-danger" id="deleteThisRowBtn">Xóa</button></td>
        </tr>`
    )
})
$('#deleteThisRowBtn').on('click', function(e) {
    console.log($(this).parent().parent().parent().attr('id'));
    console.log('aaa');
})