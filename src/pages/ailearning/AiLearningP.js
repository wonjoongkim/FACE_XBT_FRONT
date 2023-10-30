/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Image } from 'antd';
import 'antd/dist/antd.css';

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
import x_img from '../../images/learning/x.png';
import o_img from '../../images/learning/o.png';
import loading_bg from '../../images/common/bg.png';

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

// AI강화학습자와 AI강화학습정보조회, 의사색체 이미지 조회, pass, open, (prohibited, resricted), 합격/불합격 여부
import {
    useSelectAiLearningCompleteMutation,
    useSelectCommonAiLearningImgMutation,
    useSelectCommonColorImgMutation,
    useSelectLearnProblemsResultMutation
} from '../../hooks/api/CommonManagement/CommonManagement';

// 반입금지물품 페이지
import { Prohibited } from 'pages/prohibited';

export const AiLearningP = (props) => {
    const { confirm } = Modal;
    const [visible, setVisible] = useState(false); // 이미지 클릭시
    const [imgView, setImgView] = useState(); // Preview 이미지 설장

    const [ModalOpen, setModalOpen] = useState(false); // 반입금지물품 Modal창

    const [copbtc, setCopbtc] = useState();
    const [loading, setLoading] = useState(false); // 상단 (가방id) 테이블 로딩
    const [imgLoading, setImgLoading] = useState(false); // 이미지 영역 로딩
    const [subLoading, setSubLoading] = useState(false); // 하단 테이블 로딩

    const [textFrontSide, setTextFrontSide] = useState('F'); // 정면/측면 선택 설정

    const [choiceGoods, setChoiceGoods] = useState(null); // 선택된 가방ID
    const [choiceActionDivNm, setChoiceActionDivNm] = useState(null); // 선택된 가방 정답

    // AI강화학습완료 정답확인 Api
    const [AiLearningCompleteApi] = useSelectLearningCompleteMutation();
    const [learningCompleteData, setAiLearningCompleteData] = useState([]);

    // AI강화학습완료 이미지 조회 Api
    const [CompleteBagScanIdApi] = useSelectCommonLearningImgMutation();
    const [completeBagScanIdData, setCompleteBagScanIdData] = useState([]);
    const [frontImage, setFrontImage] = useState(null); // 정면 이미지
    const [sideImage, setSideImage] = useState(null); // 측면 이미지

    // AI강화학습완료 의사색체 이미지 조회
    const [CompleteColorImgApi] = useSelectCommonColorImgMutation();
    const [completeColorImgData, setCompleteColorImgData] = useState([]);

    const [scale, setScale] = useState(1); // 확대, 축소
    const [flip, setFlip] = useState(false); // 반전(좌우)

    // AI강화학습완료 의사색체 이미지 조회
    const [SelectLearnProblemsApi] = useSelectLearnProblemsResultMutation();
    const [selectLearnProblemsData, setSelectLearnProblemsData] = useState([]);

    // =====================================================================================
    // API 호출 Start
    // =====================================================================================

    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'learningend', //화면아이디
            languageCode: languageKey
        });
        console.log(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // AI강화학습완료 정답확인 Api Call
    const AiLearningComplete_ApiCall = async () => {
        const AiLearningCompleteResponse = await AiLearningCompleteApi({
            menuCd: props.MenuCd,
            languageCode: localStorage.getItem('LangTp')
        });
        // console.log(props.MenuCd);
        setAiLearningCompleteData(AiLearningCompleteResponse?.data?.RET_DATA);
        setLoading(false);
    };

    // AI강화학습완료 이미지조회 Api Call
    const SelectCompleteBagScanId_ApiCall = async (bagScanId) => {
        const CompleteBagScanIdResponse = await CompleteBagScanIdApi({
            bagScanId: bagScanId
        });
        setFrontImage(CompleteBagScanIdResponse?.data?.RET_DATA?.imgFront); // 정면 이미지
        setSideImage(CompleteBagScanIdResponse?.data?.RET_DATA?.imgSide); // 측면 이미지
        setCompleteBagScanIdData(CompleteBagScanIdResponse?.data?.RET_DATA);
        setImgLoading(false);
    };

    // AI강화학습완료 의사색체 이미지 조회 Api Call
    const SelectCompleteColorImg_ApiCall = async (command, bagscanid) => {
        const CompleteColorImgResponse = await CompleteColorImgApi({
            bagScanId: bagscanid,
            command: command
        });
        command === '101'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColor) //정면컬러 101
            : command === '102'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorMineral) //정면무기물 102
            : command === '103'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorOrganism) //정면유기물 103
            : command === '104'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorReversal) //정면반전 104
            : command === '105'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorBwRate1) //정면채도 105
            : command === '106'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorBwRate2) //정면채도 106
            : command === '107'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorBwRate3) //정면채도 107
            : command === '108'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorBwRate4) //정면채도 108
            : command === '109'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorBwRate5) //정면채도 109
            : command === '110'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontColorBwRate6) //정면채도 110
            : command === '111'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBw) //정면흑백 111
            : command === '112'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwMineral) //정면흑백무기물 112
            : command === '113'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwOrganism) //정면흑백유기물 113
            : command === '114'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwReversal) //정면흑백반전 114
            : command === '115'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwBwRate1) //정면흑백채도 115
            : command === '116'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwBwRate2) //정면흑백채도 116
            : command === '117'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwBwRate3) //정면흑백채도 117
            : command === '118'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwBwRate4) // 정면흑백채도118
            : command === '119'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwBwRate5) //정면흑백채도 119
            : command === '120'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontBwBwRate6) //정면흑백채도 120
            : command === '201'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColor) //측면컬러 201
            : command === '202'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorMineral) //측면무기물 202
            : command === '203'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorOrganism) //측면유기물 203
            : command === '204'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorReversal) //측면반전 204
            : command === '205'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorBwRate1) //측면채도 205
            : command === '206'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorBwRate2) //측면채도206
            : command === '207'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorBwRate3) //측면채도207
            : command === '208'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorBwRate4) //측면채도208
            : command === '209'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorBwRate5) //측면채도209
            : command === '210'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideColorBwRate6) //측면채도210
            : command === '211'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBw) //측면흑백211
            : command === '212'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwMinerals) //측면흑백무기물212
            : command === '213'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwOrganism) //측면흑백유기물213
            : command === '214'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwReversal) //측면흑백반전214
            : command === '215'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwBwRate1) //측면흑백채도215
            : command === '216'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwBwRate2) //측면흑백채도216
            : command === '217'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwBwRate3) //측면흑백채도217
            : command === '218'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwBwRate4) //측면흑백채도218
            : command === '219'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwBwRate5) //측면흑백채도219
            : command === '220'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideBwBwRate6) //측면흑백채도220
            : command === '401'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgFrontDanger) //정면XRAY위험물품 401
            : command === '402'
            ? setFrontImage(CompleteColorImgResponse?.data?.RET_DATA.imgSideDanger) //측면XRAY위험물품 402
            : '';
    };

    // AI강화학습완료 상세물품목록조회 Api Call
    const SelectLearnProblems_ApiCall = async (bagScanId) => {
        const SelectLearnProblemsResponse = await SelectLearnProblemsApi({
            menuCd: props.MenuCd,
            languageCode: localStorage.getItem('LangTp'),
            bagScanId: bagScanId
        });
        setSelectLearnProblemsData(SelectLearnProblemsResponse?.data?.RET_DATA);
        setSubLoading(false);
    };

    // =====================================================================================
    // API 호출 End
    // =====================================================================================

    // 측면 이미지 클릭
    const FrontSide_Change = (textFrontSide) => {
        textFrontSide === 'S' ? setTextFrontSide('F') : setTextFrontSide('S');
        setFrontImage(sideImage);
        setSideImage(frontImage);
    };

    // Preview 이미지 처리
    const PreviewCall = (previewimage) => {
        setImgView(previewimage);
        setVisible(true);
    };

    const ColorGroup = (command, bagscanid) => {
        bagscanid !== null
            ? (SelectCompleteColorImg_ApiCall(command, bagscanid), setCopbtc(command.slice(-2)))
            : Modal.warning({
                  title: 'Warning',
                  content: '가방ID가 선택되지 않았습니다.'
              });
    };

    // 확대
    const handleZoomIn = () => {
        setScale(scale + 0.1);
        setCopbtc('21');
    };

    // 축소
    const handleZoomOut = () => {
        setScale(scale - 0.1);
        setCopbtc('23');
    };

    // 반전(좌우)
    const handleFlip = () => {
        setFlip(!flip);
        setCopbtc('22');
    };

    // 복원
    const handleRestore = () => {
        setScale(1);
        setFlip(false);
        setCopbtc('24');
    };

    // 상단 테이블 - 가방ID 선택
    const handChoiceGoods = (bagScanId, actionDivName) => {
        setChoiceGoods(bagScanId);
        setChoiceActionDivNm(actionDivName);
        SelectCompleteBagScanId_ApiCall(bagScanId);
        SelectLearnProblems_ApiCall(bagScanId);
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

    // 종료 처리
    const ModalClose = () => {
        props.ModalClose2();
    };

    useEffect(() => {
        LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp'));
        setLoading(true);
        AiLearningComplete_ApiCall();
    }, []);

    return (
        <>
            <div className="xbt_content">
                {/* <!-- xbt_top --> */}
                <div className="xbt_top" style={{ zIndex: '9999' }}>
                    {/* <!-- learnct01 --> */}
                    <div className="learnct01">
                        <ul>
                            <li>
                                <h1 className="contit">{languageApplyInfoData.learningend1}</h1>
                            </li>
                            <li>
                                <h3>{learningCompleteData?.moduleNm}</h3>
                            </li>
                            <li>
                                <h2 className="conname">{learningCompleteData?.userName}</h2>
                                <button
                                    id="close-th-modal"
                                    data-mact="close"
                                    data-minfo="th-modal"
                                    className="modal_btn conbtn01 conbtn_pd01"
                                    onClick={ModalClose}
                                >
                                    {languageApplyInfoData.learningend2}
                                </button>
                                <button type="button" className="conbtn01" onClick={() => Prohibitedinfo_Modal()}>
                                    {languageApplyInfoData.learningend3}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* <!-- xbt_con --> */}
                <div className="xbt_con mt20 learn_comp">
                    {/* <!-- lrncomp_left --> */}
                    <div className="lrncomp_left">
                        {/* <!-- lrncompl_top --> */}
                        <div className="lrncompl_top conbox_sty">
                            {/* <!-- lrncompl_tit --> */}
                            {choiceActionDivNm === '' ? (
                                ''
                            ) : (
                                <div className="lrncompl_tit">
                                    <h3>{choiceActionDivNm}</h3>
                                </div>
                            )}
                            <div className="lrncompl_img" id="Front_Images" style={{ height: '100%', overflow: 'hidden' }}>
                                {choiceGoods === null ? (
                                    <div id="container" style={{ height: '455px' }}>
                                        <img src={loading_bg} alt="" style={{ height: '450px', opacity: '0.05' }} />
                                    </div>
                                ) : (
                                    <div id="container" style={{ height: '455px' }}>
                                        <button onClick={() => PreviewCall(frontImage)}>
                                            <img
                                                id="frontimages"
                                                src={`data:image/png;base64,${frontImage}`}
                                                alt=""
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    transform: `scaleX(${flip ? -1 : 1}) scale(${scale})`
                                                }}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <Image
                                style={{
                                    display: 'none'
                                }}
                                src={`data:image/png;base64,${imgView}`}
                                preview={{
                                    visible,
                                    onVisibleChange: (value) => {
                                        setVisible(value);
                                    }
                                }}
                            />
                        </div>
                        {/* <!-- lrncompl_bot --> */}
                        <div className="lrncompl_bot" style={{ zIndex: '9999' }}>
                            <div className="learn_btcon">
                                {/* <!-- learnbtc01 --> */}
                                <div className="learnbtc01">
                                    <ul>
                                        {/* 정면 컬러 101~104 Start */}
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('401', choiceGoods)
                                                        : () => ColorGroup('402', choiceGoods)
                                                }
                                                className={copbtc === '01' ? 'on' : ''}
                                            >
                                                <img src={learnc_0101} alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('102', choiceGoods)
                                                        : () => ColorGroup('202', choiceGoods)
                                                }
                                                className={copbtc === '02' ? 'on' : ''}
                                            >
                                                <img src={learnc_0102} alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('103', choiceGoods)
                                                        : () => ColorGroup('203', choiceGoods)
                                                }
                                                className={copbtc === '03' ? 'on' : ''}
                                            >
                                                <img src={learnc_0103} alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('104', choiceGoods)
                                                        : () => ColorGroup('204', choiceGoods)
                                                }
                                                className={copbtc === '04' ? 'on' : ''}
                                            >
                                                <img src={learnc_0104} alt="" />
                                            </a>
                                        </li>
                                        {/* 정면 컬러 101~104 End */}

                                        {/* 정면 흑백 111~114 Start */}
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('111', choiceGoods)
                                                        : () => ColorGroup('211', choiceGoods)
                                                }
                                                className={copbtc === '11' ? 'on' : ''}
                                            >
                                                <img src={learnc_0201} alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('112', choiceGoods)
                                                        : () => ColorGroup('212', choiceGoods)
                                                }
                                                className={copbtc === '12' ? 'on' : ''}
                                            >
                                                <img src={learnc_0202} alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('113', choiceGoods)
                                                        : () => ColorGroup('213', choiceGoods)
                                                }
                                                className={copbtc === '13' ? 'on' : ''}
                                            >
                                                <img src={learnc_0203} alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('114', choiceGoods)
                                                        : () => ColorGroup('214', choiceGoods)
                                                }
                                                className={copbtc === '14' ? 'on' : ''}
                                            >
                                                <img src={learnc_0204} alt="" />
                                            </a>
                                        </li>
                                        {/* 정면 흑백 111~114 End */}
                                    </ul>
                                </div>
                                {/* <!-- learnbtc02 --> */}
                                <div className="learnbtc02">
                                    <ul>
                                        {/* 정면 컬러 채도 105~110 Start */}
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('105', choiceGoods)
                                                        : () => ColorGroup('205', choiceGoods)
                                                }
                                                className={copbtc === '05' ? 'on' : ''}
                                            >
                                                <span className="brig_ic01_01"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('106', choiceGoods)
                                                        : () => ColorGroup('206', choiceGoods)
                                                }
                                                className={copbtc === '06' ? 'on' : ''}
                                            >
                                                <span className="brig_ic01_02"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('107', choiceGoods)
                                                        : () => ColorGroup('207', choiceGoods)
                                                }
                                                className={copbtc === '07' ? 'on' : ''}
                                            >
                                                <span className="brig_ic01_03"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('108', choiceGoods)
                                                        : () => ColorGroup('208', choiceGoods)
                                                }
                                                className={copbtc === '08' ? 'on' : ''}
                                            >
                                                <span className="brig_ic01_04"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('109', choiceGoods)
                                                        : () => ColorGroup('209', choiceGoods)
                                                }
                                                className={copbtc === '09' ? 'on' : ''}
                                            >
                                                <span className="brig_ic01_05"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('110', choiceGoods)
                                                        : () => ColorGroup('210', choiceGoods)
                                                }
                                                className={copbtc === '10' ? 'on' : ''}
                                            >
                                                <span className="brig_ic01_06"></span>
                                            </a>
                                        </li>
                                        {/* 정면 컬러 채도 105~110 End */}
                                    </ul>
                                    <ul>
                                        {/* 정면 흑백 채도 115~120 Start */}
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('115', choiceGoods)
                                                        : () => ColorGroup('215', choiceGoods)
                                                }
                                                className={copbtc === '15' ? 'on' : ''}
                                            >
                                                <span className="brig_ic02_01"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('116', choiceGoods)
                                                        : () => ColorGroup('216', choiceGoods)
                                                }
                                                className={copbtc === '16' ? 'on' : ''}
                                            >
                                                <span className="brig_ic02_02"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('117', choiceGoods)
                                                        : () => ColorGroup('217', choiceGoods)
                                                }
                                                className={copbtc === '17' ? 'on' : ''}
                                            >
                                                <span className="brig_ic02_03"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('118', choiceGoods)
                                                        : () => ColorGroup('218', choiceGoods)
                                                }
                                                className={copbtc === '18' ? 'on' : ''}
                                            >
                                                <span className="brig_ic02_04"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('119', choiceGoods)
                                                        : () => ColorGroup('219', choiceGoods)
                                                }
                                                className={copbtc === '19' ? 'on' : ''}
                                            >
                                                <span className="brig_ic02_05"></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={
                                                    textFrontSide === 'F'
                                                        ? () => ColorGroup('120', choiceGoods)
                                                        : () => ColorGroup('220', choiceGoods)
                                                }
                                                className={copbtc === '20' ? 'on' : ''}
                                            >
                                                <span className="brig_ic02_06"></span>
                                            </a>
                                        </li>
                                        {/* 정면 흑백 채도 115~120 End */}
                                    </ul>
                                </div>
                                {/* <!-- learnbtc03 --> */}
                                <div className="learnbtc03">
                                    <ul>
                                        {/* 확대 */}
                                        <li>
                                            <a href="#" id="color_glas_plus" onClick={handleZoomIn} className={copbtc === '21' ? 'on' : ''}>
                                                <img src={glas_plus} alt="확대" title="ZoomIn" />
                                            </a>
                                        </li>
                                        {/* 반전 */}
                                        <li>
                                            <a href="#" id="color_transform" onClick={handleFlip} className={copbtc === '22' ? 'on' : ''}>
                                                <img src={transform} alt="좌우반전" title="Transform" />
                                            </a>
                                        </li>
                                        {/* 축소 */}
                                        <li>
                                            <a
                                                href="#"
                                                id="color_glas_minus"
                                                onClick={handleZoomOut}
                                                className={copbtc === '23' ? 'on' : ''}
                                            >
                                                <img src={glas_minus} alt="축소" title="ZoomOut" />
                                            </a>
                                        </li>
                                        {/* 복원 */}
                                        <li>
                                            <a
                                                href="#"
                                                id="color_restoration"
                                                onClick={handleRestore}
                                                className={copbtc === '24' ? 'on' : ''}
                                            >
                                                <img src={restoration} alt="복원" title="Restoration" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {/* <!-- learnbtc06 측면 이미지 --> */}
                                <div className="learnbtc06" id="Side_Images" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <button onClick={() => FrontSide_Change(textFrontSide)}>
                                        <img src={`data:image/png;base64,${sideImage}`} alt="" style={{ width: '100%', height: '75px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- lrncomp_right --> */}
                    <div className="lrncomp_right">
                        {/* <!-- lrncompr_con01 --> */}
                        <div className="lrncompr_con01 conbox_sty conbox_pd01">
                            <div className="con_table">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '11%' }}>No</th>
                                            <th style={{ width: '21%' }}>{languageApplyInfoData.learningend4}</th>
                                            <th style={{ width: '21%' }}>{languageApplyInfoData.learningend5}</th>
                                            <th style={{ width: '21%' }}>{languageApplyInfoData.learningend6}</th>
                                            <th style={{ width: '21%' }}>{languageApplyInfoData.learningend7}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <div className="con_table height120 scrollbar">
                                <table className="table">
                                    <tbody>
                                        {learningCompleteData?.learningProblemList?.map((t, i) => {
                                            return (
                                                <tr
                                                    className={choiceGoods === i ? 'on' : ''}
                                                    key={i}
                                                    onClick={() => handChoiceGoods(t.bagScanId, t.actionDivName)}
                                                >
                                                    <td style={{ width: '11%' }}>{i + 1}</td>
                                                    <td style={{ width: '21%' }}>{t.bagScanId}</td>
                                                    <td style={{ width: '21%' }}>{t.actionDivName}</td>
                                                    <td style={{ width: '21%' }}>
                                                        {t.userActionDivName === null ? '-' : t.userActionDivName}
                                                    </td>
                                                    <td style={{ width: '21%' }}>
                                                        <img src={t.answerYn === 'N' ? x_img : o_img} alt="" />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <!-- lrncompr_con02 --> */}
                        <div className="lrncompr_con02 conbox_sty conbox_pd01" id="Real_Img">
                            <img src={`data:image/png;base64,${completeBagScanIdData.imgReal}`} alt="" style={{ width: '50%' }} />
                        </div>
                        {/* <!-- lrncompr_con03 --> */}
                        <div className="lrncompr_con03 conbox_sty conbox_pd01">
                            <div className="con_table">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{languageApplyInfoData.learningend8}</th>
                                            <th>{languageApplyInfoData.learningend9}</th>
                                            <th>{languageApplyInfoData.learningend10}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="con_table height110 scrollbar">
                                <table className="table">
                                    <tbody>
                                        {selectLearnProblemsData?.map((pd, i) => {
                                            return (
                                                <tr className="on" key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{pd.unitName}</td>
                                                    <td>{pd.openYn}</td>
                                                    <td>{pd.passYn}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 반입금지물품 모달 창 Start */}
            <Modal
                className="custom-modal"
                maskClosable={false}
                open={ModalOpen}
                onOk={handleOk}
                closable={false}
                // onCancel={handleCancel}
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
        </>
    );
};
