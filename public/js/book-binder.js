///@author	Hyundai Robototics Co., Ltd. choi, won-hyuk (asoe72@hyundai-robotics.com)
///@brief	build book, print book


///@brief		toolbar button-handler 연결
function initBookBinder() {

    $('#build-book').click(function(){
		const path = $("#path").val();
        const prj_name = $("#prj-name").val();
		
        buildBook(path, prj_name);
        this.blur();
	});
	
	$('#print-book').click(function(){
        const path = $("#path").val();
        printBook(path);
        this.blur();
    });
}


///@param[in]	path	    e.g. "hi6/hrscript/"
///@param[in]	prj_name	e.g. "prj_ko"
///@brief	서버에 build 요청 송신
function buildBook(path, prj_name) {
    $.ajax({
        url: '/build',
        type: 'post',
        data: {
			path: 'public/' + path,
			prj_name: prj_name
		},
        success: function(data) {
            alert('built!');
        }
    })
}


///@brief	완성된 책 preview, 인쇄
function printBook(path) {
	//var win = window.open(`works/${form}/out/book.html`, '_blank');
    var win = window.open(path + 'book.html', '_blank');
	win.focus();
}
