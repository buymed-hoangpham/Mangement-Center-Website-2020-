$(function() {
    let $pointITForm = $('#form-pointIT');
    console.log($pointITForm);
    let $pointLanguageForm = $('#form-pointLanguage');
    if($pointITForm.length) {
        $pointITForm.validate({
            rules: {
                theory: {
                    required: true,
                    range: [0, 9]
                },
                practice: {
                    required: true,
                    range: [0, 9]
                },
            },
            messages: {
                theory: {
                    required: '<span style="color: red; font-style: italic;">Không được để trống!</span>', 
                    range: '<span style="color: red; font-style: italic;">Điểm từ 0 đến 9</span>'
                },
                practice: {
                    required: '<span style="color: red; font-style: italic;">Không được để trống!</span>', 
                    range: '<span style="color: red; font-style: italic;">Điểm từ 0 đến 9</span>'
                },
            }
        })
    }
})