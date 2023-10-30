import $ from 'jquery';
$(document).ready(function () {
    var time_out; //이미지가 움직임 예약
    var animation; //이미지가 움직이는 상태 저장
    var position; //이미지와 스크롤바 이동
    var $currentImage; //현재 움직이는 이미지
    var is_learn01_play = false;

    $('#close-first-modal').click(function () {
        if (is_learn01_play) {
            alert('시험이 종료되었습니다.');
            $currentImage.remove();
            clearTimeout(animation);
            clearTimeout(time_out);
            clearInterval(position);
            is_learn01_play = false;
            $('#learn01_bimg').hide();
            $('#myRange').css('visibility', 'hidden');
        }
    });

    //학습시작-슬라이더 타입의 시작 버튼 누르면 실행
    $('#learn01_start').click(function () {
        var containerWidth = $('#learn01_img').width(); //이미지가 움직일 공간 크기
        var isPaused = false; //일시정지 상태 저장
        var current_image = 0; //현재 움직이는 이미지가 몇번째인가
        var start_count = 0;

        var origin_img = [];
        var thum_img = [];
        $('#learn01_img img').each(function (i) {
            origin_img[i] = $(this);
            thum_img[i] = $(this).data('thum');
        });

        var images = origin_img; //이미지 목록(배열)

        var move_timer = slide_time; //움직이는 시간(ms, 1/1000초)
        var move_distance = slide_speed; //움직일 거리

        is_learn01_play = true;

        //하단 바 초기화 작업
        //$("#myRange").removeAttr("disabled");
        $('#myRange').attr('max', $('#learn01_img').width());
        $('#myRange').val($('#learn01_img').width());
        $('#myRange').css('visibility', 'visible');

        $('#learn01_bimg').show();

        //시작 버튼 비활성화
        //브라우저에 따라 정상작동 되지 않는 경우가 있어
        //시작 기능이 있는 버튼을 숨기고, 기능이 없는 버튼 노출
        $('#learn01_start').hide();
        $('#learn01_start_on').show();

        //이미지를 유지한 상태로 이동 시작
        function moveImage() {
            $currentImage = $(images[current_image]);
            animation = $currentImage.animate({ left: '-=' + move_distance }, move_timer, function () {
                time_out = setTimeout(image_position, move_timer);
            });
        }

        //기존 이미지 제거하고 이동 시작
        //마지막 이미지가 끝났을 경우 시험 종료
        function resetImage() {
            $currentImage = $(images[current_image]);
            if (start_count > 0) {
                $currentImage.remove();
                //$currentImage.hide();
                current_image++;
            }

            //current_image++;
            if (current_image >= images.length) {
                alert('시험이 종료되었습니다.');
                clearTimeout(animation);
                clearTimeout(time_out);
                clearInterval(position);
                $('#learn01_bimg').hide();
                $('#myRange').css('visibility', 'hidden');
                is_learn01_play = false;
            } else {
                var $nextImage = $(images[current_image]);
                $nextImage.css('left', containerWidth);
                $('#learn01_bimg').attr('src', $nextImage.data('thum'));
                animation = $nextImage.animate({ left: '-=' + move_distance }, move_timer, function () {
                    time_out = setTimeout(image_position, move_timer);
                });
            }
            start_count++;
        }

        //이미지 이동 진행
        //이미지가 화면 밖으로 사라질 경우 resetImage() 호출
        function image_position() {
            $currentImage = $(images[current_image]);
            var imageWidth = $currentImage.width();
            var image_left = $currentImage.position().left;
            if (image_left < -(imageWidth + 50)) {
                clearInterval(animation);
                //current_image++;
                resetImage();
            } else {
                if (is_learn01_play) {
                    animation = $currentImage.animate({ left: '-=' + move_distance }, move_timer, function () {
                        time_out = setTimeout(image_position, move_timer);
                    });
                }
            }
        }

        //하단 버튼과 이미지의 위치를 동기화
        function set_position() {
            $currentImage = $(images[current_image]);
            var imageWidth = $currentImage.width();
            var currentPosition = $currentImage.position().left + imageWidth / 2;
            $('#myRange').val(currentPosition);
        }
        resetImage();
        //moveImage();
        position = setInterval(set_position, 10);

        //하단 버튼을 드래그하여 이미지 위치 이동
        $('#myRange').on('input', function () {
            if (isPaused) {
                position = $('#myRange').val();
                $currentImage = $(images[current_image]);
                var imageWidth = $currentImage.width();
                var image_left = Number(position) - imageWidth / 2;
                $currentImage.attr('style', 'left:' + image_left + 'px');
            }
        });

        //진행중일때 Stop 버튼을 누르면 일시정지
        //일시정지일때 Stop 버튼을 누르면 다시재생
        $('#learn01_stop').click(function () {
            if (is_learn01_play) {
                if (!isPaused) {
                    isPaused = true;
                    $(images[current_image]).stop();
                    clearTimeout(animation);
                    clearTimeout(time_out);
                    clearInterval(position);
                    $('#learn01_stop').addClass('lnbtc_btnon');
                    $('#myRange').removeAttr('disabled');
                } else {
                    isPaused = false;
                    moveImage();
                    $('#learn01_stop').removeClass('lnbtc_btnon');
                    position = setInterval(set_position, 10);
                    $('#myRange').attr('disabled', '');
                }
            }
        });

        //Pass, Open, Prohibited 눌렀을 때 다음 이미지 보이게
        function learn01_btn() {
            if (is_learn01_play) {
                isPaused = false;

                $('#learn01_stop').removeClass('lnbtc_btnon');
                $(images[current_image]).stop();
                clearTimeout(animation);
                clearTimeout(time_out);
                clearInterval(position);
                position = setInterval(set_position, 10);

                resetImage();
            }
        }

        //<====================
        //각각 버튼 눌렀을 때 처리할 부분
        //다음 이미지로 넘어가는 기능만 구현
        $('#learn01_pass').click(function () {
            learn01_btn();
        });

        $('#learn01_open').click(function () {
            learn01_btn();
        });

        $('#learn01_prohibited').click(function () {
            learn01_btn();
        });
        //======================>

        $('#learn01_bimg').click(function () {
            var image_src = $(this).attr('src');
            $currentImage = $(images[current_image]);
            $(this).attr('src', $currentImage.attr('src'));
            $currentImage.attr('src', image_src);
        });
    });

    var timer; //이미지가 보여지는 타이머
    var timeout; //시험종료를 위한 타이머
    var progressBar = $('#learn02_progress'); //남은시간 게이지
    var images = $('#learn02_img img'); //이미지 목록
    var is_learn02_play = false;

    $('#close-second-modal').click(function () {
        if (is_learn02_play) {
            $(images).hide();
            clearTimeout(timer);
            clearTimeout(timeout);
            alert('시험이 종료되었습니다.');
            progressBar.stop();
            progressBar.css({ width: '0%' });
            is_learn02_play = false;
            $('#learn02_bimg').hide();
        }
    });

    //학습시작-컷 타입의 시작 버튼 누르면 실행
    $('#learn02_start').click(function () {
        var currentImageIndex = 0; //현재 보여지는 이미지 순서
        var start_time; //이미지가 보여지기 시작한 시간
        var stop_time; //일시정지 버튼을 누른 시간
        var status = 0; //일시정지 버튼 상태
        var learn_time = cut_time; //이미지를 보여줄 시간(ms, 1/1000초)
        is_learn02_play = true;

        //남은시간 표시
        $('#learn02_progress').show();
        $('#learn02_bimg').show();

        //시작 버튼 비활성화
        //브라우저에 따라 정상작동 되지 않는 경우가 있어
        //시작 기능이 있는 버튼을 숨기고, 기능이 없는 버튼 노출
        $('#learn02_start').hide();
        $('#learn02_start_on').show();

        //이미지를 지정된 시간만 노출 후 다음 이미지로 변경
        function displayNextImage() {
            start_time = Date.now();
            paused_time = 0;
            $(images[currentImageIndex]).hide();
            currentImageIndex++;
            if (currentImageIndex === images.length) {
                clearTimeout(timer);
                clearTimeout(timeout);
                alert('시험이 종료되었습니다.');
                progressBar.stop();
                progressBar.css({ width: '0%' });
                $('#learn02_bimg').hide();
                is_learn02_play = false;
            } else {
                $(images[currentImageIndex]).show();
                $('#learn02_bimg').attr('src', $(images[currentImageIndex]).data('thum'));
                updateProgressBar(learn_time);
                timer = setTimeout(displayNextImage, learn_time);
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    $(images[currentImageIndex]).hide();
                    currentImageIndex++;
                    if (currentImageIndex === images.length) {
                        clearTimeout(timer);
                        alert('시험이 종료되었습니다.');
                        progressBar.stop();
                        progressBar.css({ width: '0%' });
                        $('#learn02_bimg').hide();
                        is_learn02_play = false;
                    } else {
                        $(images[currentImageIndex]).show();
                        updateProgressBar(learn_time);
                        timer = setTimeout(displayNextImage, learn_time);
                    }
                }, learn_time);
            }
        }

        //일시정지
        function pause() {
            clearTimeout(timer);
            clearTimeout(timeout);
            var progressBar = $('#learn02_progress');
            progressBar.stop();
            stop_time = Date.now();
        }
        //다시시작
        var paused_time = 0;
        function resume() {
            var remaining_time = learn_time - (stop_time - start_time) + paused_time;
            timer = setTimeout(displayNextImage, remaining_time);
            clearTimeout(timeout);
            updateProgressBar(remaining_time, true);
            paused_time += Date.now() - stop_time;
        }

        //남은시간 게이지
        function updateProgressBar(duration, resume = false) {
            progressBar.stop();
            if (!resume) progressBar.css({ width: '100%' });
            progressBar.animate({ width: '0%' }, duration, 'linear');
        }

        //일시정지버튼을 눌렀을 때 처리
        $('#learn02_stop').click(function () {
            if (is_learn02_play) {
                if (status === 0) {
                    pause();
                    status = 1;
                    $('#learn02_stop').addClass('lnbtc_btnon');
                } else {
                    resume();
                    status = 0;
                    $('#learn02_stop').removeClass('lnbtc_btnon');
                }
            }
        });

        //Pass, Open, Prohibited 눌렀을 때 다음 이미지 보이게
        function learn02_btn() {
            if (is_learn02_play) {
                $(images[currentImageIndex]).hide();
                currentImageIndex++;
                start_time = Date.now();
                paused_time = 0;
                $('#learn02_bimg').attr('src', $(images[currentImageIndex]).data('thum'));

                if (currentImageIndex === images.length) {
                    clearTimeout(timer);
                    clearTimeout(timeout);
                    alert('시험이 종료되었습니다.');
                    progressBar.stop();
                    $('#learn02_bimg').hide();
                    progressBar.css({ width: '0%' });
                    is_learn02_play = false;
                } else {
                    // Show the next image and restart the timer
                    $(images[currentImageIndex]).show();
                    updateProgressBar(learn_time);
                    clearTimeout(timer);
                    clearTimeout(timeout);
                    status = 0;
                    $('#learn02_stop').removeClass('lnbtc_btnon');
                    timer = setTimeout(displayNextImage, learn_time);
                }
            }
        }

        //<====================
        //각각 버튼 눌렀을 때 처리할 부분
        //다음 이미지로 넘어가는 기능만 구현
        $('#learn02_pass').click(function () {
            learn02_btn();
        });

        $('#learn02_open').click(function () {
            learn02_btn();
        });

        $('#learn02_prohibited').click(function () {
            learn02_btn();
        });
        //====================>

        $(images).hide();
        $(images[currentImageIndex]).show();
        updateProgressBar(learn_time);
        timer = setTimeout(displayNextImage, learn_time);
        start_time = Date.now();
        paused_time = 0;
        $('#learn02_bimg').click(function () {
            var image_src = $(this).attr('src');
            $currentImage = $(images[currentImageIndex]);
            $(this).attr('src', $currentImage.attr('src'));
            $currentImage.attr('src', image_src);
        });
    });
});
