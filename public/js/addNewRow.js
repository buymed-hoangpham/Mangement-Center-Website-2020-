let idStudent;
let count = 0;
$('#studentname').on('change', function(e) {
    idStudent = e.target.value;
})
$('#addNewRowBtn').on('click', function(e) {
    console.log($(this).parent().parent().parent());
    let arrSplited = idStudent.split('-');
    $(this).parent().parent().parent().append(
        `<tr class="tr">
           <td class="text-center align-middle">${++count}</td>
           <td class="align-middle">Id: ${arrSplited[0]} - Tên: ${arrSplited[1]}</td>
           <td></td>
           <td class="text-center"><button type="button", class="btn btn-outline-danger">Xóa</button></td>
        </tr>`
    )
})
