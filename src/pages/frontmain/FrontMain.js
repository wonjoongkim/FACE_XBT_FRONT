/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Form, Row, Col, Modal } from 'antd';
import './CustomModal.css'; // 스타일 파일을 import
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useUserToken } from '../../hooks/core/UserToken';

import { useUserStatus } from '../../hooks/core/UserStatus';

// Main 메뉴, 교육생 정보 API
import { useSelectScheduleListMutation, useSelectBaselineUserInfoMutation } from '../../hooks/api/MainManagement/MainManagement';

// Notice 목록조회 API
import { useSelectNoticeListMutation } from '../../hooks/api/NoticeManagement/NoticeManagement';

// Notice 이미지
import main_plus from '../../images/main/plus.png';

// X-ray 메뉴 이미지
import xrayrd_01 from '../../images/main/xrayrd_ic01.png';
import xrayrd_02 from '../../images/main/xrayrd_ic02.png';
import xrayrd_03 from '../../images/main/xrayrd_ic03.png';

// learning 메뉴 이미지
import learn_01 from '../../images/main/learn_ic01.png';
import learn_02 from '../../images/main/learn_ic02.png';
import learn_03 from '../../images/main/learn_ic03.png';
import learn_04 from '../../images/main/learn_ic04.svg';
import learn_05 from '../../images/main/learn_ic05.svg';

// actual cases 메뉴 이미지
import actual_01 from '../../images/main/actual_ic01.png';
import actual_02 from '../../images/main/actual_ic02.png';
import actual_03 from '../../images/main/actual_ic03.png';
import actual_04 from '../../images/main/actual_ic04.png';

// theory 메뉴 이미지
import theory_01 from '../../images/main/theory_ic01.png';
import theory_02 from '../../images/main/theory_ic02.png';
import theory_03 from '../../images/main/theory_ic03.png';

import fail_color from '../../images/learning/fail_color.png';

// 교육정보
import { EduInfo } from 'pages/eduinfo';

// Notice
import { NoticeList as NoticeListPlus } from 'pages/notice';
import { NoticeView } from 'pages/notice/NoticeView';

// 물품연습 페이지 Import
import { Practice } from 'pages/practice';

// 학습 페이지 Import
import { LearningS } from 'pages/learning/LearningS'; // 슬라이드 방식
import { LearningC } from 'pages/learning/LearningC'; // 컷 방식

// Ai강화학습 페이지 Import
import { AiLearningS } from 'pages/ailearning/AiLearningS'; // 슬라이드 방식
import { AiLearningC } from 'pages/ailearning/AiLearningC'; // 컷 방식

// 오답문제풀이 페이지 Import
import { WrongAnswerS } from 'pages/wronganswer/WrongAnswerS'; // 슬라이드 방식
import { WrongAnswerC } from 'pages/wronganswer/WrongAnswerC'; // 컷 방식

// 반입금지 물품연습 페이지 Import
import { OXProhibited } from 'pages/oxprohibited';

// 평가 페이지 Import
import { EvaluationS } from 'pages/evaluation/EvaluationS'; // 슬라이드 방식
import { EvaluationC } from 'pages/evaluation/EvaluationC'; // 컷 방식

// 이론평가
import { TheoryevaluationW } from 'pages/theoryevaluation/TheoryevaluationW'; // 이론평가[보안검색요원]
import { TheoryevaluationT } from 'pages/theoryevaluation/TheoryevaluationT'; // 이론평가[항공경비요원]
import { LectureW } from 'pages/theoryevaluation/LectureW'; // 이론강의[보안검색요원]
import { LectureT } from 'pages/theoryevaluation/LectureT'; // 이론강의[항공경비요원]

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

export const FrontMain = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const isLoggedIn = useUserStatus();
    // 로그인 토큰 정보
    const [userToken] = useUserToken();

    const [ModalOpen, setModalOpen] = useState(false); // 메뉴 Modal창
    const [resetCounter, setResetCounter] = useState(0);
    const [eiModalOpen, setEiModalOpen] = useState(false); // 교육정보 Modal창
    const [nlModalOpen, setNlModalOpen] = useState(false); // Notice List Modal창
    const [vlModalOpen, setVlModalOpen] = useState(false); // Notice List Modal창
    const [noticeId, setNoticeId] = useState(); // 선택한 공지사항 아이디
    const [deadlineModalOpen, setDeadlineModalOpen] = useState(false); // 학습기간이 아닌 경고 Modal창

    const [loading, setLoading] = useState(false);
    const [eiloading, setEiLoading] = useState(false);
    const [nlLoading, setNlLoading] = useState(false);
    const [vlLoading, setVlLoading] = useState(false);
    const [menutitle, setMenutitle] = useState('');
    const [menuValue, setMenuValue] = useState('');

    // =====================================================================================
    // API 호출 Start
    // =====================================================================================

    // 다국어 언어 Api Call / 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'edu', //화면아이디
            languageCode: languageKey
        });
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // 메인메뉴 Api Call / 정보
    const [mainmenuApi, setMainmenuApi] = useState([]); // Main Menu 값
    const [MenuList] = useSelectScheduleListMutation();
    const MainMenu_ApiCall = async () => {
        const mainmenuResponse = await MenuList({
            languageCode: localStorage.getItem('LangTp')
        });
        console.log(mainmenuResponse?.data?.RET_DATA);
        setMainmenuApi(mainmenuResponse?.data?.RET_DATA);
    };

    // 교육생 Api Call / 정보
    const [SelectBaselineUserInfoApi] = useSelectBaselineUserInfoMutation();
    const [selectBaselineUserInfoData, setSelectBaselineUserInfoData] = useState([]);
    const SelectBaselineUserInfo_ApiCall = async () => {
        const mainmenuResponse = await SelectBaselineUserInfoApi({
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectBaselineUserInfoData(mainmenuResponse?.data?.RET_DATA);
    };

    // 공지사항 Api Call / 정보
    const [NoticeListApi] = useSelectNoticeListMutation();
    const [noticeListApi, setNoticeListApi] = useState([]); // Notice List 값
    const Notice_ApiCall = async () => {
        const noticeResponse = await NoticeListApi({
            languageCode: localStorage.getItem('LangTp')
        });

        setNoticeListApi(noticeResponse?.data?.RET_DATA);
    };

    // =====================================================================================
    // API 호출 End
    // =====================================================================================

    // 마우스 오른쪽버튼
    // const handleContextMenu = (event) => {
    //     event.preventDefault();
    // };

    // F12키 차단
    // const handleKeyDown = (event) => {
    //     if (event.keyCode === 123) {
    //       event.preventDefault();
    //     }
    //   };

    // 메뉴 Modal 이벤트처리 Start
    const Menus_Modal = (MenuNumber) => {
        setMenuValue(MenuNumber);
        setResetCounter(0);
        setModalOpen(true);
        setLoading(true);
    };

    const handleOk = () => {
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };
    // 메뉴 Modal 이벤트처리 End

    // 교육정보 Modal 이벤트처리 Start
    const Eduinfo_Modal = () => {
        setEiModalOpen(true);
        setEiLoading(true);
    };

    const eihandleOk = () => {
        setEiModalOpen(false);
    };

    const eihandleCancel = () => {
        setEiModalOpen(false);
    };
    // 교육정보 Modal 이벤트처리 End

    // Notice List Modal 이벤트처리 Start
    const NoticeList_Modal = (nId) => {
        setNoticeId(nId);
        setNlModalOpen(true);
        setNlLoading(true);
    };

    const NoticeView_Modal = (nId) => {
        setNoticeId(nId);
        setVlModalOpen(true);
        setVlLoading(true);
    };

    const nlhandleOk = () => {
        setNlModalOpen(false);
    };

    const nlhandleCancel = () => {
        setNlModalOpen(false);
    };

    const vlhandleOk = () => {
        setVlModalOpen(false);
    };

    const vlhandleCancel = () => {
        setVlModalOpen(false);
    };
    // Notice List Modal 이벤트처리 End

    // 로그아웃 처리
    const LoginOut = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: '로그아웃 하시겠습니까?',
            onOk() {
                userToken.setItem('');
                localStorage.removeItem('LangTp');
                navigate('/login');
            },
            onCancel() {}
        });
    };

    // 학습기간 Modal 이벤트 처리
    const DeadlinehandleOk = () => {
        setDeadlineModalOpen(false);
    };

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
        }
        LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp'));
        MainMenu_ApiCall(); // 메인 메뉴 api 호출
        SelectBaselineUserInfo_ApiCall(); // 교육생 정보 api 호출
        Notice_ApiCall(); // 공지사항 api 호출
    }, []);

    return (
        <>
            <div id="wrap" className="mbg mbg_none">
                <div className="tgnb">
                    <Typography variant="h1">
                        X-ray Security <span>Training</span>
                    </Typography>
                    <nav className="util">
                        <a href="#" onClick={LoginOut}>
                            Logout
                        </a>
                    </nav>
                </div>
                <div id="wlayer">
                    <div className="mcontent">
                        <div className="main_con">
                            <div className="main_left">
                                <div className="main_info">
                                    <div className="minfo_top">
                                        <p>
                                            {selectBaselineUserInfoData?.procNm} - {selectBaselineUserInfoData?.procSeq}
                                        </p>
                                        <h3>{selectBaselineUserInfoData?.userNm}</h3>
                                    </div>
                                    <button className="edu_btn modal_btn" onClick={() => Eduinfo_Modal()}>
                                        {languageApplyInfoData?.edu1}
                                    </button>
                                </div>
                                <div className="mnotice">
                                    <div className="nnc_top">
                                        <h1>Notice</h1>
                                        <button className="nnct_plus modal_btn" onClick={() => NoticeList_Modal()}>
                                            <img src={main_plus} alt="" />
                                        </button>
                                    </div>
                                    <ul className="notice_list">
                                        {noticeListApi?.map((d, i) => (
                                            <li key={i}>
                                                <button className="modal_btn" onClick={() => NoticeView_Modal(d.noticeId)}>
                                                    <p className="tit">{d.title}</p>
                                                    <p className="date">{d.insertDate}</p>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {/* 메뉴 영역 */}
                            <div className="main_right">
                                <div className="mr_con">
                                    <div className="mrcon_tit">
                                        <Typography variant="h1">
                                            {/* X-ray<span>Reading</span> */}
                                            Learning
                                        </Typography>
                                    </div>
                                    <div className="mrcon_ic">
                                        <ul>
                                            {mainmenuApi?.menu1?.map((m1, i) => (
                                                <li key={i}>
                                                    <button
                                                        onClick={() =>
                                                            m1.menuFlag === 'true' ? Menus_Modal(m1.menuCd) : setDeadlineModalOpen(true)
                                                        }
                                                    >
                                                        <div className="circle">
                                                            <img
                                                                src={
                                                                    m1.menuCd === '11'
                                                                        ? xrayrd_01
                                                                        : m1.menuCd === '12' || m1.menuCd === '13'
                                                                        ? xrayrd_02
                                                                        : m1.menuCd === '14' || m1.menuCd === '15'
                                                                        ? xrayrd_03
                                                                        : m1.menuCd === '24' || m1.menuCd === '25'
                                                                        ? learn_03
                                                                        : m1.menuCd === '23'
                                                                        ? learn_02
                                                                        : ''
                                                                }
                                                                alt=""
                                                                style={
                                                                    m1.menuFlag === 'false'
                                                                        ? { opacity: '0.2', pointerEvents: 'none', width: '46px' }
                                                                        : { width: '46px' }
                                                                }
                                                            />
                                                        </div>
                                                        <p>{m1.menuName}</p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mr_con">
                                    <div className="mrcon_tit">
                                        <Typography variant="h1">Evaluation</Typography>
                                    </div>
                                    <div className="mrcon_ic">
                                        <ul>
                                            {mainmenuApi?.menu2?.map((m2, i) => (
                                                <li key={i}>
                                                    <button
                                                        onClick={() =>
                                                            m2.menuFlag === 'true' ? Menus_Modal(m2.menuCd) : setDeadlineModalOpen(true)
                                                        }
                                                    >
                                                        <div className="circle">
                                                            <img
                                                                src={
                                                                    m2.menuCd === '21' || m2.menuCd === '22'
                                                                        ? learn_01
                                                                        : m2.menuCd === '43'
                                                                        ? learn_04
                                                                        : m2.menuCd === '44'
                                                                        ? learn_05
                                                                        : ''
                                                                }
                                                                alt=""
                                                                style={
                                                                    m2.menuFlag === 'false'
                                                                        ? { opacity: '0.2', pointerEvents: 'none', width: '46px' }
                                                                        : { width: '46px' }
                                                                }
                                                            />
                                                        </div>
                                                        <p>{m2.menuName}</p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mr_con">
                                    <div className="mrcon_tit">
                                        <Typography variant="h1">
                                            {/*Actual <span>Cases</span>*/}
                                            Theory
                                        </Typography>
                                    </div>
                                    <div className="mrcon_ic">
                                        <ul>
                                            {mainmenuApi?.menu3?.map((m3, i) => (
                                                <li key={i}>
                                                    <button
                                                        onClick={() =>
                                                            m3.menuFlag === 'true' ? Menus_Modal(m3.menuCd) : setDeadlineModalOpen(true)
                                                        }
                                                    >
                                                        <div className="circle">
                                                            <img
                                                                src={
                                                                    m3.menuCd === '41'
                                                                        ? theory_01
                                                                        : m3.menuCd === '42'
                                                                        ? theory_02
                                                                        : m3.menuCd === '43'
                                                                        ? theory_03
                                                                        : ''
                                                                }
                                                                alt=""
                                                                style={
                                                                    m3.menuFlag === 'false'
                                                                        ? { opacity: '0.2', pointerEvents: 'none', width: '46px' }
                                                                        : { width: '46px' }
                                                                }
                                                            />
                                                        </div>
                                                        <p>{m3.menuName}</p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/*
                                <div className="mr_con">
                                    <div className="mrcon_tit">
                                        <Typography variant="h1">Theory</Typography>
                                    </div>
                                    <div className="mrcon_ic">
                                        <ul>
                                            {mainmenuApi?.menu4?.map((m4, i) => (
                                                <li key={i}>
                                                    <button
                                                        onClick={() =>
                                                            m4.menuFlag === 'true' ? Menus_Modal(m4.menuCd) : setDeadlineModalOpen(true)
                                                        }
                                                    >
                                                        <div className="circle">
                                                            <img
                                                                src={
                                                                    m4.menuCd === '41'
                                                                        ? theory_01
                                                                        : m4.menuCd === '42'
                                                                        ? theory_02
                                                                        : m4.menuCd === '43'
                                                                        ? theory_03
                                                                        : ''
                                                                }
                                                                alt=""
                                                                style={
                                                                    m4.menuFlag === 'false' ? { opacity: '0.2', pointerEvents: 'none' } : {}
                                                                }
                                                            />
                                                        </div>
                                                        <p>{m4.menuName}</p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                */}
                            </div>
                            {/* 메뉴 영역 */}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div onContextMenu={(handleContextMenu, handleKeyDown)}> */}
            {/* 메뉴 모달 창 Start */}
            <Modal
                className="custom-modal"
                maskClosable={false}
                open={ModalOpen}
                onOk={handleOk}
                closable={false}
                destroyOnClose={true}
                width={
                    menuValue === '4'
                        ? '80%'
                        : menuValue === '43' || menuValue === '44'
                        ? '85%'
                        : menuValue === '41' || menuValue === '42'
                        ? '60%'
                        : '97%'
                }
                style={{
                    top: 0,
                    bottom: 0,
                    marginTop: 35,
                    zIndex: 999
                }}
                footer={null}
            >
                {
                    // 물품연습
                    menuValue === '11' ? (
                        <Practice key={resetCounter} ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 학습(Cut)
                    menuValue === '12' ? (
                        <LearningC ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 학습(Slide)
                    menuValue === '13' ? (
                        <LearningS ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // AI 강화학습(Cut)
                    menuValue === '14' ? (
                        <AiLearningC ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // AI 강화학습(Slide)
                    menuValue === '15' ? (
                        <AiLearningS ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 평가(Cut)
                    menuValue === '21' ? (
                        <EvaluationC ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 평가(Slide)
                    menuValue === '22' ? (
                        // <EvaluationS ModalClose={handleCancel} MenuCd={menuValue} />
                        <EvaluationC ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 반입금지 물품연습
                    menuValue === '23' ? (
                        <OXProhibited ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 오답문제풀이(Cut)
                    menuValue === '24' ? (
                        <WrongAnswerC ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 오답문제풀이(Slide)
                    menuValue === '25' ? (
                        <WrongAnswerS ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 실제 사례
                    menuValue === '31' ? (
                        ''
                    ) : // 물품분류변경
                    menuValue === '32' ? (
                        ''
                    ) : // 물품분류연습
                    menuValue === '33' ? (
                        ''
                    ) : // 물품분류평가
                    menuValue === '34' ? (
                        ''
                    ) : // 이론 강의[보안검색요원]
                    menuValue === '41' ? (
                        <LectureW ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 이론 강의[항공경비요원]
                    menuValue === '42' ? (
                        <LectureT ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 이론 평가[보안검색요원]
                    menuValue === '43' ? (
                        <TheoryevaluationW ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : // 이론 평가[항공경비요원]
                    menuValue === '44' ? (
                        <TheoryevaluationT ModalClose={handleCancel} MenuCd={menuValue} />
                    ) : (
                        ''
                    )
                }
            </Modal>
            {/* 메뉴 모달 창 End */}

            {/* 교육정보 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={eiModalOpen}
                onOk={eihandleOk}
                // onCancel={eihandleCancel}
                closable={false}
                width={'82%'}
                style={{
                    top: 50,
                    zIndex: 999
                }}
                footer={[]}
            >
                <EduInfo ModalClose={eihandleCancel} />
            </Modal>
            {/* 교육정보 모달 창 End */}

            {/* Notice List 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={nlModalOpen}
                onOk={nlhandleOk}
                closable={false}
                width={850}
                style={{
                    top: 0,
                    bottom: 0,
                    marginTop: 40,
                    zIndex: 999
                }}
                footer={[]}
            >
                <NoticeListPlus ModalClose={nlhandleCancel} NoticeId={noticeId} />
            </Modal>
            {/* Notice List 모달 창 End */}

            {/* Notice View 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={vlModalOpen}
                onOk={vlhandleOk}
                onClose={vlhandleOk}
                closable={false}
                width={850}
                style={{
                    top: 0,
                    bottom: 0,
                    marginTop: 40,
                    zIndex: 999
                }}
                footer={[]}
            >
                <NoticeView ModalClose={vlhandleCancel} NoticeId={noticeId} />
            </Modal>
            {/* Notice View 모달 창 End */}

            {/* 학습기간 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={deadlineModalOpen}
                onOk={DeadlinehandleOk}
                closable={false}
                width={590}
                style={{
                    zIndex: 999
                }}
                footer={[]}
            >
                <div style={{ width: '542px', textAlign: 'center', padding: '50px 0px' }}>
                    <div>
                        <img src={fail_color} alt="" />
                    </div>
                    <div className="scwd_txt02">
                        <h1>
                            <span className="scwd_fail">{languageApplyInfoData?.menu12}</span>
                        </h1>
                    </div>
                    <button
                        id="open-eig-modal"
                        data-mact="open"
                        data-minfo="eig-modal"
                        className="modal_btn conbtn01"
                        onClick={DeadlinehandleOk}
                    >
                        확인
                    </button>
                    {/* <button id="close-sev-modal" data-mact="close" data-minfo="sev-modal" className="modal_btn close_btn02"></button> */}
                </div>
            </Modal>
            {/* 학습기간 모달 창 End */}
            {/* </div> */}
        </>
    );
};
