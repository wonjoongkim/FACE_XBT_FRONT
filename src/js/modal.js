/*
	버튼에 modal_btn 클래스 넣으면 작동
	data-mact="open"  open, close 
	data-minfo="first-modal" 오픈시킬 창아이디 			
*/
const modals = document.querySelectorAll('.modal_btn');

modals.forEach(function (modal) {
    modal.addEventListener('click', modal_popup_open, false);
});

function modal_popup_open() {
    let tar_act = this.getAttribute('data-mact');
    let tar = this.getAttribute('data-minfo');
    if (tar_act == 'open') {
        //const tar_class = this.getAttribute('data-mclass');
        document.getElementById(tar).style.display = 'block';

        if (typeof sly_exe === 'function') {
            //alert("sss");
            //sly_exe();
        }

        // 첫번째 모달창 가운데 정렬
        let firstModal = document.querySelector('#' + tar + ' .modal');
        let modalWidth = firstModal.offsetWidth;
        //alert(modalWidth);
        let modalHeight = firstModal.offsetHeight;
        firstModal.style.left = `calc(50% - ${modalWidth / 2}px)`;
        //firstModal.style.left = `calc(50% - ${modalWidth}px)`;
        firstModal.style.top = `calc(50% - ${modalHeight / 2}px)`;
        //alert(modalWidth);
    }
    if (tar_act == 'close') {
        document.getElementById(tar).style.display = 'none';
    }
}
