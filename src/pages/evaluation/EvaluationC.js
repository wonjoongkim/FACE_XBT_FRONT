/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Spin, Image } from 'antd';
import 'antd/dist/antd.css';
import $ from 'jquery';
import learnc_0101 from '../../images/learning/learnc_ic01_01.png';
import learnc_0102 from '../../images/learning/learnc_ic01_02.png';
import learnc_0103 from '../../images/learning/learnc_ic01_03.png';
import learnc_0104 from '../../images/learning/learnc_ic01_04.png';
import learnc_0201 from '../../images/learning/learnc_ic02_01.png';
import learnc_0202 from '../../images/learning/learnc_ic02_02.png';
import learnc_0203 from '../../images/learning/learnc_ic02_03.png';
import learnc_0204 from '../../images/learning/learnc_ic02_04.png';
import glas_plus from '../../images/learning/glas_plus.png';
import transform from '../../images/learning/transform.png';
import glas_minus from '../../images/learning/glas_minus.png';
import restoration from '../../images/learning/restoration.png';
import pass from '../../images/learning/pass.png';
import open from '../../images/learning/open.png';
import prohibited from '../../images/learning/prohibited.png';
// import stope from '../../images/learning/stop.png';
import learning_01_1 from '../../images/learning/learning_01_1.jpg';
// import pass_color from '../../images/learning/pass_color.png';
// import fail_color from '../../images/learning/fail_color.png';

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

// 반입금지물품
import { Prohibited } from 'pages/prohibited';

// 평가자와 평가정보조회, 이미지 조회, pass, open, (prohibited, resricted)
import {
    useSelectEvaluationMutation,
    useSelectImgMutation,
    useUpdateEvaluationAnswerMutation,
    useEndEvaluationMutation
} from '../../hooks/api/EvaluationManagement/EvaluationManagement';

export const EvaluationC = (props) => {
    const { confirm } = Modal; // Modal
    const [visible, setVisible] = useState(false); // 이미지 클릭시

    const [ModalOpen, setModalOpen] = useState(false); // 반입금지물품 Modal창
    // const [PassModalOpen, setPassModalOpen] = useState(false); // 합격 Modal창
    // const [FailModalOpen, setFailModalOpen] = useState(false); // 불합격 Modal창
    const [CompleteModalOpen, setCompleteModalOpen] = useState(false); // 완료 Modal창

    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 초기 정답버튼 비활성

    const [copbtc01, setCopbtc01] = useState(); // 의사색체 첫번째 블럭
    const [copbtc02, setCopbtc02] = useState(); // 의사색체 두번째 블럭
    const [copbtc03, setCopbtc03] = useState(); // 의사색체 세번째 블럭
    const [answerType, setAnswerType] = useState(''); // 정답의 Open 설정

    const [learnbagScanId, setLearnbagScanId] = useState([]); // 가방아이디
    const [ImageCount, setImageCount] = useState('0'); // 출제 문항 카운트
    const [ImageTotal, setImageTotal] = useState('0'); // 출제 문항의 총수량

    const [textFrontSide, setTextFrontSide] = useState('F'); // 정면/측면 선택 설정
    const [state, setState] = useState({ seconds: 0, minutes: 0 }); // 카운트

    const [imgView, setImgView] = useState(); // Preview 이미지 설장
    const [loading, setLoading] = useState(false); // 로딩

    // 평가자와 평가정보조회 api 정보
    const [EvaluationApi] = useSelectEvaluationMutation();
    const [EvaluationData, setEvaluationData] = useState([]);

    // 이미지조회 api 정보
    const [SelectImgApi] = useSelectImgMutation();

    // PASS, OPEN, (PROHIBITED, RESRICTED) 정답처리 api 정보
    const [UpdateEvaluationAnswerApi] = useUpdateEvaluationAnswerMutation();
    const [updateEvaluationAnswerData, setUpdateEvaluationAnswerData] = useState();

    // 재응시 체크
    const [recompleteModalOpen, setRecompleteModalOpen] = useState(false); // 이미 완료 Modal창

    // 합격/불합격 api 정보
    const [EndEvaluationApi] = useEndEvaluationMutation();
    const [endEvaluationData, setEndEvaluationData] = useState();

    // =====================================================================================
    // API 호출 Start
    // =====================================================================================

    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'evaluation', //화면아이디
            languageCode: languageKey
        });
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // 평가자와 평가정보조회 Api Call
    const Evaluation_ApiCall = async () => {
        const EvaluationResponse = await EvaluationApi({
            menuCd: props.MenuCd
        });

        if (EvaluationResponse?.data?.RET_CODE === 'ALREADY_STARE') {
            setLoading(false);
            setRecompleteModalOpen(true);
            // Modal.warning({
            //     title: 'Warning',
            //     content: EvaluationResponse?.data?.RET_DESC,
            //     onOk() {
            //         ModalClose();
            //     }
            // });
        } else {
            if (EvaluationResponse?.data?.RET_CODE !== '0000') {
                setLoading(false);
                Modal.warning({
                    title: 'Warning',
                    content: '출제된 문제가 없습니다.',
                    onOk() {
                        ModalClose();
                    }
                });
            }
            setEvaluationData(EvaluationResponse?.data?.RET_DATA);
            setImageTotal(EvaluationResponse?.data?.RET_DATA.learningProblemList.length); // 총 문항 수
            setState({ seconds: 0, minutes: EvaluationResponse?.data?.RET_DATA?.timeLimit }); // 카운트
            // setState({ seconds: 10, minutes: 0 }); // 카운트
        }
        setLoading(false);
    };

    // PASS, OPEN, (PROHIBITED, RESRICTED) 정답처리 Api Call
    const UpdateEvaluationAnswer_ApiCall = async (userActionDiv, bagScanId) => {
        // console.log(userActionDiv, bagScanId, props.MenuCd);
        const UpdateEvaluationAnswerResponse = await UpdateEvaluationAnswerApi({
            userActionDiv: userActionDiv, // 사용자가 선택한 정답
            menuCd: props.MenuCd,
            bagScanId: bagScanId //xray 가방스캔 아이디
        });
        setAnswerType('');
        setUpdateEvaluationAnswerData(UpdateEvaluationAnswerResponse?.data?.RET_CODE);
    };

    // 평가 합격불합격 Api Call
    const EndEvaluation_ApiCall = async () => {
        const EndEvaluationResponse = await EndEvaluationApi({
            menuCd: props.MenuCd
        });
        setEndEvaluationData(EndEvaluationResponse?.data?.RET_DATA);
        ModalClose();
        // if (EndEvaluationResponse?.data?.RET_DATA?.passYn === 'Y') {
        //     setPassModalOpen(true); // 합격 모달
        // } else {
        //     setFailModalOpen(true); // 불합격 모달
        // }
    };
    // =====================================================================================
    // API 호출 End
    // =====================================================================================

    //평가시작-컷 타입의 시작 버튼 누르면 실행
    const learn02_start = () => {
        let images = $('#learn02_img img'); //이미지 목록
        let $currentImage; //현재 움직이는 이미지
        var start_count = 0;

        let currentImageIndex = 0; //현재 보여지는 이미지 순서
        let is_learn02_play = true;
        setIsButtonDisabled(false);

        const intervalId = setInterval(() => {
            setState((prevState) => {
                const seconds = prevState.seconds > 0 ? prevState.seconds - 1 : 59;
                const minutes = seconds === 59 ? prevState.minutes - 1 : prevState.minutes;
                if (seconds === 0 && minutes === 0) {
                    clearInterval(intervalId); // 타이머 종료
                    setCompleteModalOpen(true); //평가 종료 Modal
                    $('#learn02_bimg').hide();
                    $('#close_second_modal').show();
                    $('#close_second_modal_on').hide();
                    is_learn02_play = false;
                }
                return { seconds, minutes };
            });
        }, 1000);

        // 출제 문항 총수량
        setImageTotal(images.length);
        // 현재 문항 수량
        if (start_count === images.length) {
            setImageCount(start_count);
        } else {
            setImageCount(start_count + 1);
        }
        $('#learn02_bimg').show();
        setLearnbagScanId($(images[currentImageIndex]).data('value')); // 가방 아이디 저장

        //시작 버튼 비활성화
        //브라우저에 따라 정상작동 되지 않는 경우가 있어
        //시작 기능이 있는 버튼을 숨기고, 기능이 없는 버튼 노출
        $('#learn02_start').hide();
        $('#learn02_start_on').show();
        $('#close_second_modal').hide();
        $('#close_second_modal_on').show();

        //Pass, Open, Prohibited 눌렀을 때 다음 이미지 보이게
        function learn02_btn() {
            if (is_learn02_play) {
                // open 초기화 (RESRICTED -> PROHIBITED)
                $(images[currentImageIndex]).hide();
                currentImageIndex++;

                // 이미지 클릭시 preview 이벤트
                $(images[currentImageIndex]).click(function (e) {
                    PreviewCall(e.target.src);
                });

                $('#learn02_bimg').attr('src', $(images[currentImageIndex]).data('thum'));
                if (currentImageIndex === images.length) {
                    clearInterval(intervalId); // 타이머 종료
                    setCompleteModalOpen(true); //평가 종료 Modal
                    $('#learn02_bimg').hide();
                    $('#close_second_modal').show();
                    $('#close_second_modal_on').hide();
                    is_learn02_play = false;
                } else {
                    setImageCount(currentImageIndex + 1);
                    $(images[currentImageIndex]).show();
                }
            }
        }

        //<====================
        // Pass, Open, Prohibited, Risricted 버튼 눌렀을 때 처리할 부분
        // 다음 이미지로 넘어감
        // learn02_Open_Prohibited:0, learn02_Prohibited:1, learn02_Open_Pass:2, learn02_Open_Resricted:0, learn02_Pass:4
        $('.learnbtc04 button').click(async function () {
            if ($(this)[0].id == 'learn02_Open') {
                try {
                    const RealImageResponse = await SelectImgApi({
                        bagScanId: $(images[currentImageIndex]).data('value'),
                        command: '403'
                    });
                    $currentImage = $(images[currentImageIndex]);
                    $(this).attr('src', $currentImage.attr('src'));
                    $currentImage.attr('src', 'data:image/png;base64,' + RealImageResponse?.data?.RET_DATA.imgReal);
                } catch (error) {}
            } else {
                if ($(this)[0].id == 'learn02_Pass') {
                    UpdateEvaluationAnswer_ApiCall('4', $(images[currentImageIndex]).data('value')); // 미개봉/통과 pass [4]
                } else if ($(this)[0].id == 'learn02_Prohibited') {
                    UpdateEvaluationAnswer_ApiCall('1', $(images[currentImageIndex]).data('value')); // 미개봉/금지 Prohibited [1]
                } else if ($(this)[0].id == 'learn02_Open_Pass') {
                    UpdateEvaluationAnswer_ApiCall('3', $(images[currentImageIndex]).data('value')); // 개봉/제한 Open/Pass [3]
                } else if ($(this)[0].id == 'learn02_Open_Resricted') {
                    UpdateEvaluationAnswer_ApiCall('2', $(images[currentImageIndex]).data('value')); // 개봉/통과 Open/Resricted [2]
                } else if ($(this)[0].id == 'learn02_Open_Prohibited') {
                    UpdateEvaluationAnswer_ApiCall('0', $(images[currentImageIndex]).data('value')); // 개봉/금지 Open/Prohibited [0]
                }
                learn02_btn();
                setAnswerType(null);
            }
        });

        $(images).hide();
        $(images[currentImageIndex]).show();

        // 측면 이미지 클릭시 처리
        $('#learn02_bimg').click(function () {
            var image_src = $(this).attr('src');
            $currentImage = $(images[currentImageIndex]);
            $(this).attr('src', $currentImage.attr('src'));
            $currentImage.attr('src', image_src);
        });

        // 의사색체 버튼 클릭
        $('#color_group101').click(function () {
            if ($(this)[0].id == 'color_group101') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '101');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '201');
            }
        });

        $('#color_group102').click(function () {
            if ($(this)[0].id == 'color_group102') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '102');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '202');
            }
        });

        $('#color_group103').click(function () {
            if ($(this)[0].id == 'color_group103') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '103');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '203');
            }
        });

        $('#color_group104').click(function () {
            if ($(this)[0].id == 'color_group104') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '104');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '204');
            }
        });

        $('#color_group105').click(function () {
            if ($(this)[0].id == 'color_group105') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '105');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '205');
            }
        });

        $('#color_group106').click(function () {
            if ($(this)[0].id == 'color_group106') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '106');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '206');
            }
        });

        $('#color_group107').click(function () {
            if ($(this)[0].id == 'color_group107') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '107');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '207');
            }
        });

        $('#color_group108').click(function () {
            if ($(this)[0].id == 'color_group108') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '108');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '208');
            }
        });

        $('#color_group109').click(function () {
            if ($(this)[0].id == 'color_group109') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '109');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '209');
            }
        });

        $('#color_group110').click(function () {
            if ($(this)[0].id == 'color_group110') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '110');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '210');
            }
        });

        $('#color_group111').click(function () {
            if ($(this)[0].id == 'color_group111') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '111');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '211');
            }
        });

        $('#color_group112').click(function () {
            if ($(this)[0].id == 'color_group112') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '112');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '212');
            }
        });

        $('#color_group113').click(function () {
            if ($(this)[0].id == 'color_group113') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '113');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '213');
            }
        });

        $('#color_group114').click(function () {
            if ($(this)[0].id == 'color_group114') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '114');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '214');
            }
        });

        $('#color_group115').click(function () {
            if ($(this)[0].id == 'color_group115') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '115');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '215');
            }
        });

        $('#color_group116').click(function () {
            if ($(this)[0].id == 'color_group116') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '116');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '216');
            }
        });

        $('#color_group117').click(function () {
            if ($(this)[0].id == 'color_group117') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '117');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '217');
            }
        });

        $('#color_group118').click(function () {
            if ($(this)[0].id == 'color_group118') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '118');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '218');
            }
        });

        $('#color_group119').click(function () {
            if ($(this)[0].id == 'color_group119') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '119');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '219');
            }
        });

        $('#color_group120').click(function () {
            if ($(this)[0].id == 'color_group120') {
                imagesrcApi($(images[currentImageIndex]).data('value'), '120');
            } else {
                imagesrcApi($(images[currentImageIndex]).data('value'), '220');
            }
        });

        async function imagesrcApi(bagScanId, command) {
            try {
                const SelectImgResponse = await SelectImgApi({
                    bagScanId: bagScanId,
                    command: command
                }); // 비동기 함수 호출

                if (command === '101') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColor; //정면컬러 101
                } else if (command === '102') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorMineral; //정면무기물 102
                } else if (command === '103') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorOrganism; //정면유기물 103
                } else if (command === '104') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorReversal; //정면반전 104
                } else if (command === '105') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorBwRate1; //정면채도 105
                } else if (command === '106') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorBwRate2; //정면채도 106
                } else if (command === '107') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorBwRate3; //정면채도 107
                } else if (command === '108') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorBwRate4; //정면채도 108
                } else if (command === '109') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorBwRate5; //정면채도 109
                } else if (command === '110') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColorBwRate6; //정면채도 110
                } else if (command === '111') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBw; //정면흑백 111
                } else if (command === '112') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwMineral; //정면흑백무기물 112
                } else if (command === '113') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwOrganism; //정면흑백유기물 113
                } else if (command === '114') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwReversal; //정면흑백반전 114
                } else if (command === '115') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwBwRate1; //정면흑백채도 115
                } else if (command === '116') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwBwRate2; //정면흑백채도 116
                } else if (command === '117') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwBwRate3; //정면흑백채도 117
                } else if (command === '118') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwBwRate4; // 정면흑백채도118
                } else if (command === '119') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwBwRate5; //정면흑백채도 119
                } else if (command === '120') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontBwBwRate6; //정면흑백채도 120
                } else if (command === '201') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColor; //측면컬러 201
                } else if (command === '202') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorMineral; //측면무기물 202
                } else if (command === '203') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorOrganism; //측면유기물 203
                } else if (command === '204') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorReversal; //측면반전 204
                } else if (command === '205') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorBwRate1; //측면채도 205
                } else if (command === '206') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorBwRate2; //측면채도206
                } else if (command === '207') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorBwRate3; //측면채도207
                } else if (command === '208') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorBwRate4; //측면채도208
                } else if (command === '209') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorBwRate5; //측면채도209
                } else if (command === '210') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideColorBwRate6; //측면채도210
                } else if (command === '211') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBw; //측면흑백211
                } else if (command === '212') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwMinerals; //측면흑백무기물212
                } else if (command === '213') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwOrganism; //측면흑백유기물213
                } else if (command === '214') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwReversal; //측면흑백반전214
                } else if (command === '215') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwBwRate1; //측면흑백채도215
                } else if (command === '216') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwBwRate2; //측면흑백채도216
                } else if (command === '217') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwBwRate3; //측면흑백채도217
                } else if (command === '218') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwBwRate4; //측면흑백채도218
                } else if (command === '219') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwBwRate5; //측면흑백채도219
                } else if (command === '220') {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgSideBwBwRate6; //측면흑백채도220
                } else {
                    var image_src = SelectImgResponse?.data?.RET_DATA.imgFrontColor; //정면컬러 101
                }
                $currentImage = $(images[currentImageIndex]);
                $(this).attr('src', $currentImage.attr('src'));
                $currentImage.attr('src', 'data:image/png;base64,' + image_src);
            } catch (error) {}
        }

        // 이미지 클릭시 preview 이벤트
        $(images[currentImageIndex]).click(function (e) {
            PreviewCall(e.target.src);
        });

        var scale = 1;
        var isFlipped = false;
        var originalWidth = $(images[currentImageIndex]).width();

        // 확대
        $('#color_glas_plus').click(async function () {
            scale += 0.1;
            $(images[currentImageIndex]).css('transform', 'scaleX(' + (isFlipped ? -1 : 1) + ') scale(' + scale + ')');
        });

        // 좌우 반전
        $('#color_transform').click(async function () {
            isFlipped = !isFlipped;
            $(images[currentImageIndex]).css('transform', 'scaleX(' + (isFlipped ? -1 : 1) + ') scale(' + scale + ')');
        });

        // 축소
        $('#color_glas_minus').click(async function () {
            scale -= 0.1;
            $(images[currentImageIndex]).css('transform', 'scaleX(' + (isFlipped ? -1 : 1) + ') scale(' + scale + ')');
        });

        // 복원
        $('#color_restoration').click(async function () {
            scale = 1;
            isFlipped = false;
            $(images[currentImageIndex]).css('transform', 'scaleX(1) scale(1)');
            $(images[currentImageIndex]).width(originalWidth);
        });

        var mouseX = 0;
        var mouseY = 0;
        var isDragging = false;
        var startLeft = 0;
        var startTop = 0;

        $(images[currentImageIndex]).mousedown(function (e) {
            isDragging = true;
            mouseX = e.pageX;
            mouseY = e.pageY;
            startLeft = parseInt($(images[currentImageIndex]).css('left')) || 0;
            startTop = parseInt($(images[currentImageIndex]).css('top')) || 0;
        });

        $(document).mouseup(function (e) {
            isDragging = false;
        });

        $(document).mousemove(function (e) {
            if (isDragging) {
                var x = e.pageX - mouseX;
                var y = e.pageY - mouseY;
                var newLeft = startLeft + x;
                var newTop = startTop + y;
                $(images[currentImageIndex]).css('left', newLeft + 'px');
                $(images[currentImageIndex]).css('top', newTop + 'px');
            }
        });
    };

    // 반입금지물품 Modal 이벤트처리 Start
    const Prohibitedinfo_Modal = () => {
        setModalOpen(true);
    };

    const handleOk = () => {
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };
    // 반입금지물품 Modal 이벤트처리 End

    // 합격 Modal 이벤트 처리
    // const PasshandleOk = () => {
    //     setPassModalOpen(false);
    //     ModalClose();
    // };

    // 불합격 Modal 이벤트 처리
    // const FailhandleOk = () => {
    //     setFailModalOpen(false);
    //     ModalClose();
    // };

    // 평가완료 Modal 이벤트 처리
    const CompletehandleOk = () => {
        EndEvaluation_ApiCall();
        setCompleteModalOpen(false); // 평가완료 modal 창 닫기
    };
    const copbtc01_Cho = (ImgColorCode) => {
        setCopbtc01(ImgColorCode);
        setCopbtc02();
        setCopbtc03();
    };

    const copbtc02_Cho = (ImgColorCode) => {
        setCopbtc02(ImgColorCode);
        setCopbtc01();
        setCopbtc03();
    };

    const copbtc03_Cho = (ImgColorCode) => {
        setCopbtc01();
        setCopbtc02();
        setCopbtc03(ImgColorCode);
    };

    // Preview 이미지 처리
    const PreviewCall = (previewimage) => {
        setImgView(previewimage);
        setVisible(true);
    };

    // 종료 처리
    const ModalClose = () => {
        props.ModalClose();
    };

    // 재응시 제출 Modal 이벤트 처리
    const recompletehandleOk = () => {
        setRecompleteModalOpen(false); // 재응시 제출 modal 창 닫기
        props.ModalClose();
    };

    useEffect(() => {
        LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp'));
        setLoading(true);
        Evaluation_ApiCall(); // 평가자와 평가정보조회 api 호출
    }, []);

    return (
        <>
            <Spin spinning={loading}>
                <div className="learn_con">
                    {/* <!-- xbt_top --> */}
                    <div className="xbt_top">
                        {/* <!-- learnct01 --> */}
                        <div className="learnct01">
                            <ul>
                                <li>
                                    <h1 className="contit">{languageApplyInfoData.evaluation1}(Cut)</h1>
                                </li>
                                <li>
                                    <h3>{EvaluationData?.moduleNm}</h3>
                                </li>
                                <li>
                                    <h2 className="conname pr30">{EvaluationData?.userName}</h2>
                                    <button type="button" className="conbtn01" onClick={() => Prohibitedinfo_Modal()}>
                                        {languageApplyInfoData.evaluation2}
                                    </button>
                                </li>
                            </ul>
                        </div>
                        {/* <!-- learnct02 --> */}
                        <div className="learnct02">
                            <ul>
                                <li className="learntit_con">
                                    <div className="learntit">OR Normal</div>
                                    <div className="learntit">
                                        {textFrontSide === 'F' ? 'Front' : 'Side'} {learnbagScanId}
                                    </div>
                                    {/* <div className="learntit">레벨 : 1</div> */}
                                </li>
                                <li className="learnct02_center">
                                    <div className="question">
                                        {languageApplyInfoData.evaluation5}
                                        <span>
                                            {ImageCount}/{ImageTotal}
                                        </span>
                                    </div>
                                    <div className="question_box">
                                        <dl>
                                            <dd className="qsbox" style={state.minutes < 3 ? { background: 'red' } : {}}>
                                                {state.minutes < 10 ? `0${state.minutes}` : state.minutes}
                                            </dd>
                                            <dd className="qsb_pd">:</dd>
                                            <dd className="qsbox" style={state.minutes < 3 ? { background: 'red' } : {}}>
                                                {state.seconds < 10 ? `0${state.seconds}` : state.seconds}
                                            </dd>
                                        </dl>
                                    </div>
                                </li>
                                <li>
                                    <button className="learnbtn btn_start" id="learn02_start" type="button" onClick={learn02_start}>
                                        {languageApplyInfoData.evaluation3}
                                    </button>
                                    <button className="learnbtn btn_end" id="learn02_start_on" type="button">
                                        {languageApplyInfoData.evaluation3}
                                    </button>
                                    <button
                                        id="close_second_modal"
                                        data-mact="close"
                                        data-minfo="second-modal"
                                        style={{ marginLeft: '23px' }}
                                        className="modal_btn learnbtn btn_start"
                                        onClick={ModalClose}
                                    >
                                        {languageApplyInfoData.evaluation4}
                                    </button>
                                    <button
                                        id="close_second_modal_on"
                                        data-mact="close"
                                        data-minfo="second-modal"
                                        style={{ display: 'none' }}
                                        className="modal_btn learnbtn btn_end"
                                    >
                                        {languageApplyInfoData.evaluation4}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* <!-- learnc_img --> */}
                    <div className="learnc_img" id="learn02_img">
                        <div id="container">
                            {/* <div id="learn02_progress"></div> */}
                            {EvaluationData?.learningProblemList?.map((imgs, i) => {
                                return (
                                    <>
                                        <img
                                            key={i}
                                            src={'data:image/png;base64,' + imgs.imgFront}
                                            data-thum={'data:image/png;base64,' + imgs.imgSide}
                                            data-value={imgs.bagScanId}
                                            className="image"
                                            alt="Preview"
                                            title="Preview"
                                        />
                                    </>
                                );
                            })}
                        </div>
                    </div>
                    <Image
                        style={{
                            display: 'none'
                        }}
                        src={imgView}
                        preview={{
                            visible,
                            onVisibleChange: (value) => {
                                setVisible(value);
                            }
                        }}
                    />
                </div>
                {/* <!-- learn_bottom --> */}
                <div className="learn_bottom">
                    {/* <!-- learn_btcon --> */}
                    <div className="learn_btcon">
                        {/* <!-- learnbtc01 --> */}
                        <div className="learnbtc01">
                            <ul>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group101' : 'color_group201'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('01', learnbagScanId)}
                                        className={copbtc01 === '01' ? 'on' : ''}
                                    >
                                        <img src={learnc_0101} alt="" data-value={textFrontSide === 'F' ? '101' : '201'} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group102' : 'color_group202'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('02', learnbagScanId)}
                                        className={copbtc01 === '02' ? 'on' : ''}
                                    >
                                        <img src={learnc_0102} alt="" data-value={textFrontSide === 'F' ? '102' : '202'} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group103' : 'color_group203'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('03', learnbagScanId)}
                                        className={copbtc01 === '03' ? 'on' : ''}
                                    >
                                        <img src={learnc_0103} alt="" data-value={textFrontSide === 'F' ? '103' : '203'} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group104' : 'color_group204'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('04', learnbagScanId)}
                                        className={copbtc01 === '04' ? 'on' : ''}
                                    >
                                        <img src={learnc_0104} alt="" data-value={textFrontSide === 'F' ? '104' : '204'} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group111' : 'color_group211'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('05', learnbagScanId)}
                                        className={copbtc01 === '05' ? 'on' : ''}
                                    >
                                        <img src={learnc_0201} alt="" data-value={textFrontSide === 'F' ? '111' : '211'} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group112' : 'color_group212'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('06', learnbagScanId)}
                                        className={copbtc01 === '06' ? 'on' : ''}
                                    >
                                        <img src={learnc_0202} alt="" data-value={textFrontSide === 'F' ? '112' : '212'} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group113' : 'color_group213'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('07', learnbagScanId)}
                                        className={copbtc01 === '07' ? 'on' : ''}
                                    >
                                        <img src={learnc_0203} alt="" data-value={textFrontSide === 'F' ? '113' : '213'} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group114' : 'color_group214'}
                                        href="#"
                                        onClick={() => copbtc01_Cho('08', learnbagScanId)}
                                        className={copbtc01 === '08' ? 'on' : ''}
                                    >
                                        <img src={learnc_0204} alt="" data-value={textFrontSide === 'F' ? '114' : '214'} />
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* <!-- learnbtc02 --> */}
                        <div className="learnbtc02">
                            <ul>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group105' : 'color_group205'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('09', learnbagScanId)}
                                        className={copbtc02 === '09' ? 'on' : ''}
                                    >
                                        <span className="brig_ic01_01" data-value={textFrontSide === 'F' ? '105' : '205'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group106' : 'color_group206'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('10', learnbagScanId)}
                                        className={copbtc02 === '10' ? 'on' : ''}
                                    >
                                        <span className="brig_ic01_02" data-value={textFrontSide === 'F' ? '106' : '206'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group107' : 'color_group207'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('11', learnbagScanId)}
                                        className={copbtc02 === '11' ? 'on' : ''}
                                    >
                                        <span className="brig_ic01_03" data-value={textFrontSide === 'F' ? '107' : '207'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group108' : 'color_group208'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('12', learnbagScanId)}
                                        className={copbtc02 === '12' ? 'on' : ''}
                                    >
                                        <span className="brig_ic01_04" data-value={textFrontSide === 'F' ? '108' : '208'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group109' : 'color_group209'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('13', learnbagScanId)}
                                        className={copbtc02 === '13' ? 'on' : ''}
                                    >
                                        <span className="brig_ic01_05" data-value={textFrontSide === 'F' ? '109' : '209'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group110' : 'color_group210'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('14', learnbagScanId)}
                                        className={copbtc02 === '14' ? 'on' : ''}
                                    >
                                        <span className="brig_ic01_06" data-value={textFrontSide === 'F' ? '110' : '210'}></span>
                                    </a>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group115' : 'color_group215'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('15', learnbagScanId)}
                                        className={copbtc02 === '15' ? 'on' : ''}
                                    >
                                        <span className="brig_ic02_01" data-value={textFrontSide === 'F' ? '115' : '215'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group116' : 'color_group216'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('16', learnbagScanId)}
                                        className={copbtc02 === '16' ? 'on' : ''}
                                    >
                                        <span className="brig_ic02_02" data-value={textFrontSide === 'F' ? '116' : '216'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group117' : 'color_group217'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('17', learnbagScanId)}
                                        className={copbtc02 === '17' ? 'on' : ''}
                                    >
                                        <span className="brig_ic02_03" data-value={textFrontSide === 'F' ? '117' : '217'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group118' : 'color_group218'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('18', learnbagScanId)}
                                        className={copbtc02 === '18' ? 'on' : ''}
                                    >
                                        <span className="brig_ic02_04" data-value={textFrontSide === 'F' ? '118' : '218'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group119' : 'color_group219'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('19', learnbagScanId)}
                                        className={copbtc02 === '19' ? 'on' : ''}
                                    >
                                        <span className="brig_ic02_05" data-value={textFrontSide === 'F' ? '119' : '219'}></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id={textFrontSide === 'F' ? 'color_group120' : 'color_group220'}
                                        href="#"
                                        onClick={() => copbtc02_Cho('20', learnbagScanId)}
                                        className={copbtc02 === '20' ? 'on' : ''}
                                    >
                                        <span className="brig_ic02_06" data-value={textFrontSide === 'F' ? '120' : '220'}></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* <!-- learnbtc03 확대, 축소, 반전, 복구 --> */}
                        <div className="learnbtc03">
                            <ul>
                                {/* 확대 */}
                                <li>
                                    <a
                                        href="#"
                                        id="color_glas_plus"
                                        onClick={() => copbtc03_Cho('0')}
                                        className={copbtc03 === '0' ? 'on' : ''}
                                    >
                                        <img src={glas_plus} alt="확대" title="ZoomIn" />
                                    </a>
                                </li>
                                {/* 반전 */}
                                <li>
                                    <a
                                        href="#"
                                        id="color_transform"
                                        onClick={() => copbtc03_Cho('1')}
                                        className={copbtc03 === '1' ? 'on' : ''}
                                    >
                                        <img src={transform} alt="좌우반전" title="Transform" />
                                    </a>
                                </li>
                                {/* 축소 */}
                                <li>
                                    <a
                                        href="#"
                                        id="color_glas_minus"
                                        onClick={() => copbtc03_Cho('2')}
                                        className={copbtc03 === '2' ? 'on' : ''}
                                    >
                                        <img src={glas_minus} alt="축소" title="ZoomOut" />
                                    </a>
                                </li>
                                {/* 복원 */}
                                <li>
                                    <a
                                        href="#"
                                        id="color_restoration"
                                        onClick={() => copbtc03_Cho('3')}
                                        className={copbtc03 === '3' ? 'on' : ''}
                                    >
                                        <img src={restoration} alt="복원" title="Restoration" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* <!-- learnbtc04 --> */}
                        <div className="learnbtc04">
                            <ul>
                                <li>
                                    <button
                                        className={isButtonDisabled === true ? 'lnbtc_btn next' : 'lnbtc_btn lnbtc_btnon next'}
                                        id={answerType === 'OP' ? 'learn02_Open_Pass' : 'learn02_Pass'}
                                        type="button"
                                        disabled={isButtonDisabled} // 버튼을 비활성화합니다.
                                    >
                                        <span>
                                            <img src={pass} alt="" />
                                        </span>
                                        <p style={{ fontSize: '17px' }}>Pass</p>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={isButtonDisabled === true ? 'lnbtc_btn' : 'lnbtc_btn lnbtc_btnon'}
                                        id={answerType === 'OP' ? 'learn02_Open_Resricted' : 'learn02_Open'}
                                        type="button"
                                        onClick={() => setAnswerType('OP')}
                                        disabled={isButtonDisabled} // 버튼을 비활성화합니다.
                                    >
                                        <span>
                                            <img src={open} alt="" />
                                        </span>
                                        <p style={{ fontSize: '17px' }}>{answerType === 'OP' ? 'Resricted' : 'Open'}</p>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={isButtonDisabled === true ? 'lnbtc_btn' : 'lnbtc_btn lnbtc_btnon'}
                                        id={answerType === 'OP' ? 'learn02_Open_Prohibited' : 'learn02_Prohibited'}
                                        type="button"
                                        disabled={isButtonDisabled} // 버튼을 비활성화합니다.
                                    >
                                        <span>
                                            <img src={prohibited} alt="" />
                                        </span>
                                        <p style={{ fontSize: '17px' }}>Prohibited</p>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        {/* <!-- learnbtc05 멈춤 이미지 --> */}
                        {/* <div className="learnbtc05">
                            <button className="lnbtc_btn stop" id="learn02_stop" type="button">
                                <span>
                                    <img src={stope} alt="" />
                                </span>
                                <p>Stop</p>
                            </button>
                        </div> */}
                        {/* <!-- learnbtc06 측면 이미지 --> */}
                        <div className="learnbtc06">
                            <button onClick={() => (textFrontSide === 'S' ? setTextFrontSide('F') : setTextFrontSide('S'))}>
                                <img src={learning_01_1} id="learn02_bimg" style={{ display: 'none', height: '74px' }} alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </Spin>
            {/* 반입금지물품 모달 창 Start */}
            <Modal
                className="custom-modal"
                maskClosable={false}
                open={ModalOpen}
                onOk={handleOk}
                closable={false}
                width={950}
                style={{
                    top: 35,
                    zIndex: 999
                }}
                footer={null}
            >
                <Prohibited ModalClose={handleCancel} />
            </Modal>
            {/* 반입금지물품 모달 창 End */}

            {/* 완료 모달 창 Start */}
            <Modal
                className="custom-modal"
                maskClosable={false}
                open={CompleteModalOpen}
                onOk={CompletehandleOk}
                closable={false}
                width={540}
                style={{
                    top: 35,
                    zIndex: 999
                }}
                footer={null}
            >
                <div style={{ width: '542px', textAlign: 'center', padding: '50px 0px' }}>
                    <div className="scwd_txt01">
                        <h1>{languageApplyInfoData.evaluation6}</h1>
                    </div>
                    <div className="scwd_txt02">
                        <p>{languageApplyInfoData.evaluation7}</p>
                    </div>
                    <button
                        id="open-six-modal"
                        data-mact="open"
                        data-minfo="six-modal"
                        className="modal_btn conbtn01"
                        onClick={CompletehandleOk}
                    >
                        {languageApplyInfoData.evaluation8}
                    </button>
                    {/* <button id="close-eig-modal" data-mact="close" data-minfo="eig-modal" className="modal_btn close_btn02"></button> */}
                </div>
            </Modal>
            {/* 완료 모달 창 End */}

            {/* 이미 완료 모달 창 Start */}
            <Modal
                className="custom-modal"
                maskClosable={false}
                open={recompleteModalOpen}
                onOk={recompletehandleOk}
                closable={false}
                width={560}
                style={{
                    top: 250,
                    zIndex: 999
                }}
                footer={null}
            >
                <div style={{ width: '100%', textAlign: 'center', padding: '50px 0px' }}>
                    <div className="scwd_txt01">
                        <h2>이미 평가에 응시했습니다.</h2>
                    </div>
                    <button
                        id="open-six-modal"
                        data-mact="open"
                        data-minfo="six-modal"
                        className="modal_btn conbtn01"
                        onClick={recompletehandleOk}
                    >
                        확인
                    </button>
                </div>
            </Modal>
            {/* 이미 완료 모달 창 End */}

            {/* 합격 모달 창 Start */}
            {/* <Modal
                className="custom-modal"
                maskClosable={false}
                open={PassModalOpen}
                onOk={PasshandleOk}
                closable={false}
                width={540}
                style={{
                    top: 35,
                    zIndex: 999
                }}
                footer={null}
            >
                <div style={{ width: '542px', textAlign: 'center', padding: '50px 0px' }}>
                    <div className="img">
                        <img src={pass_color} alt="" />
                    </div>
                    <div className="scwd_txt01">
                        <h3>
                            {EvaluationData?.moduleNm}{' '}
                            <span>
                                {languageApplyInfoData.evaluation9} : {endEvaluationData?.gainScore}
                            </span>
                        </h3>
                    </div>
                    <div className="scwd_txt02">
                        <h1>
                            <span className="scwd_pass">{languageApplyInfoData.evaluation12}</span>
                        </h1>
                    </div>
                    <button
                        id="open-sev-modal"
                        data-mact="open"
                        data-minfo="sev-modal"
                        className="modal_btn conbtn01"
                        onClick={PasshandleOk}
                    >
                        {languageApplyInfoData.evaluation8}
                    </button>
                </div>
            </Modal> */}
            {/* 합격 모달 창 End */}

            {/* 불합격 모달 창 Start */}
            {/* <Modal
                className="custom-modal"
                maskClosable={false}
                open={FailModalOpen}
                onOk={FailhandleOk}
                closable={false}
                width={540}
                style={{
                    top: 35,
                    zIndex: 999
                }}
                footer={null}
            >
                <div style={{ width: '542px', textAlign: 'center', padding: '50px 0px' }}>
                    <div>
                        <img src={fail_color} alt="" />
                    </div>
                    <div className="scwd_txt01">
                        <h3>
                            {EvaluationData?.moduleNm}{' '}
                            <span>
                                {languageApplyInfoData.evaluation9} : {endEvaluationData?.gainScore}
                            </span>
                        </h3>
                    </div>
                    <div className="scwd_txt02">
                        <h1>
                            <span className="scwd_fail">{languageApplyInfoData.evaluation11}</span>
                        </h1>
                    </div>
                    <button
                        id="open-eig-modal"
                        data-mact="open"
                        data-minfo="eig-modal"
                        className="modal_btn conbtn01"
                        onClick={FailhandleOk}
                    >
                        {languageApplyInfoData.evaluation8}
                    </button>
                </div>
            </Modal> */}
            {/* 불합격 모달 창 End */}
        </>
    );
};
