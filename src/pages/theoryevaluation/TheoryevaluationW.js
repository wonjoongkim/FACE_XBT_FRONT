/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

import '../../css/theory.css';
import 'jquery-ui/ui/widgets/progressbar';
import $ from 'jquery';

// 조회, 상세, 정답제출
import {
    useSelectTheoryListMutation,
    useSelectTheoryMutation,
    useEndTheoryMutation
} from '../../hooks/api/TheoryManagement/TheoryManagement';

import checkImg from '../../images/theory/check.svg';

export const TheoryevaluationW = (props) => {
    const { confirm } = Modal; // Modal

    const [questionStart, setQuestionStart] = useState(false);
    const [loading, setLoading] = useState(false); // 로딩
    const [select_questionId, setSelect_questionId] = useState(null); // 리스트에서 선택한 문제 아이디
    const [select_questionType, setSelect_questionType] = useState(null); // 리스트에서 선택한 문제 타입
    const [questionCnt, setQuestionCnt] = useState(null); // 문항 총수량
    const [questcount, setQuestcount] = useState(null); // 문항 번호
    const [matCnt, setMatCnt] = useState(0); // 현재 문제를 푼 수량

    const [answer, setAnswer] = useState([]); // 문항 정답/번호(제출)
    const [answerChk, setAnswerChk] = useState([]); // 문항 정답/번호(체크)
    const [submitbtn, setSubmitbtn] = useState(false); // 문항 정답/번호(확인용)
    const [completeModalOpen, setCompleteModalOpen] = useState(false); // 완료 Modal창
    const [recompleteModalOpen, setRecompleteModalOpen] = useState(false); // 이미 완료 Modal창
    const [recompleteModalText, setRecompleteModalText] = useState(); // 이미 완료 Modal창

    // =====================================================================================
    // API 호출 Start
    // =====================================================================================
    // 조회 ================================================================================
    const [SelectTheoryListApi] = useSelectTheoryListMutation();
    const [selectTheoryListData, setSelectTheoryListData] = useState(null);
    const handel_SelectTheoryList_ApiCall = async () => {
        const SelectTheoryListResponse = await SelectTheoryListApi({
            MenuCd: props.MenuCd
        });
        if (SelectTheoryListResponse?.data?.RET_CODE === 'ALREADY_STARE') {
            setRecompleteModalOpen(true);
            setRecompleteModalText(SelectTheoryListResponse?.data?.RET_DESC);
        } else {
            setSelectTheoryListData(SelectTheoryListResponse?.data?.RET_DATA);
            setQuestionCnt(SelectTheoryListResponse?.data?.RET_DATA?.questionList?.length);
            setLoading(false);
        }
    };

    // 문제 상세 ================================================================================
    const [SelectTheoryApi] = useSelectTheoryMutation();
    const [selectTheoryData, setSelectTheoryData] = useState(null);
    const handel_SelectTheory_ApiCall = async (questionId) => {
        const SelectTheoryResponse = await SelectTheoryApi({
            questionId: questionId
        });
        setSelectTheoryData(SelectTheoryResponse?.data?.RET_DATA);
    };

    // 정답 제출 ================================================================================
    const [EndTheoryApi] = useEndTheoryMutation();
    const handel_EndTheory_ApiCall = async () => {
        const theoryList = Object.entries(answer).map(([questionId, userActionDiv]) => ({
            questionId,
            userActionDiv
        }));
        const EndTheoryResponse = await EndTheoryApi({
            menuCd: props.MenuCd,
            theoryList: theoryList
        });

        if (EndTheoryResponse?.data?.RET_CODE === '0100') {
            setCompleteModalOpen(true); //이론평가 완료 Modal
        }
    };

    // =====================================================================================
    // API 호출 End
    // =====================================================================================

    // 시작 버튼 클릭 시
    const Question_Start = () => {
        // handel_SelectTheoryList_ApiCall();
        setQuestionStart(true);
    };

    // 리스트에서 선택한 문제
    const handel_selectquestion = (questionId, questionType) => {
        setSelect_questionId(questionId);
        setSelect_questionType(questionType);
    };

    // 이론평가 제출
    const handel_submit = () => {
        handel_EndTheory_ApiCall();
    };

    // 이론평가 제출 Modal 이벤트 처리
    const completehandleOk = () => {
        setCompleteModalOpen(false); // 이론평가 제출 modal 창 닫기
        props.ModalClose();
    };

    // 이론평가 제출 Modal 이벤트 처리
    const recompletehandleOk = () => {
        setRecompleteModalOpen(false); // 이론평가 제출 modal 창 닫기
        props.ModalClose();
    };

    // 종료 처리
    const ModalClose = () => {
        props.ModalClose();
    };

    $(document).ready(function () {
        //지문의 글자수가 길면 자동으로 크기 줄여주기
        $('.matter01_choice').each(function () {
            var text = $(this).text();
            var textLength = text.replace(/[\s\n]/g, '').length; // 공백과 개행문자를 제외한 문자 수
            var threshold = 15; // 특정 수

            if (textLength >= threshold) {
                $(this).addClass('mat01choice_long');
            } else {
                $(this).addClass('mat01choice_short');
            }
        });

        $('.ranswer01_choice').each(function () {
            var text = $(this).text();
            var textLength = text.replace(/[\s\n]/g, '').length; // 공백과 개행문자를 제외한 문자 수
            var threshold = 15; // 특정 수

            if (textLength >= threshold) {
                $(this).addClass('ran01choice_long');
            } else {
                $(this).addClass('ran01choice_short');
            }
        });

        $('.mat01tit').each(function () {
            var text = $(this).text();
            var textLength = text.replace(/[\s\n]/g, '').length; // 공백과 개행문자를 제외한 문자 수
            var threshold = 45; // 특정 수

            if (textLength >= threshold) {
                $(this).addClass('mat01tit_long');
            } else {
                $(this).addClass('mat01tit_short');
            }
        });

        $('.ran01tit').each(function () {
            var text = $(this).text();
            var textLength = text.replace(/[\s\n]/g, '').length; // 공백과 개행문자를 제외한 문자 수
            var threshold = 25; // 특정 수

            if (textLength >= threshold) {
                $(this).addClass('ranswer01_long');
            } else {
                $(this).addClass('ranswer01_short');
            }
        });

        /*
        //라디오 버튼 누르면 목록에 제출 표시
        */
        $('.matter01_que li').on('click', function () {
            var groupValues = '';
            groupValues = $(this)[0].id;

            setAnswer({ ...answer, [groupValues.split('_')[0]]: groupValues.split('_')[2] });
            setAnswerChk({ ...answerChk, [groupValues.split('_')[1]]: groupValues.split('_')[2] });
            // console.log(groupValues.split('_')[0], groupValues.split('_')[1], groupValues.split('_')[2]);
            var liSelector = '#' + groupValues.split('_')[1];
            $(liSelector).show();
        });
    });

    useEffect(() => {
        handel_SelectTheoryList_ApiCall();
    }, []);

    useEffect(() => {
        setLoading(true);
        handel_SelectTheory_ApiCall(select_questionId);
    }, [questcount]);

    useEffect(() => {
        //정답을 누를때 마다 현재 몇개 풀었는지 계산
        var Nowcnt = Object.keys(answer).length;
        $('#now_cnt').text(Nowcnt);
        $('.prog_bar').progressbar({
            value: Math.floor((Nowcnt / questionCnt) * 100)
        });

        //전체 문제 수와 정답을 선택한 문제 수를 비교해 같으면 제출 버튼 활성화
        if (Nowcnt == questionCnt) {
            setSubmitbtn(true);
        }
    }, [answer]);

    return (
        <>
            <div className="theory_bg" style={{ borderRadius: '20px', paddingBottom: '30px' }}>
                {/* theory_con */}
                <div className="theory_con">
                    {/* thetop */}
                    <div className="thetop">
                        <ul>
                            <li>
                                <h1 className="contit">이론</h1>
                            </li>
                            <li>
                                <h2 className="conname">{selectTheoryListData?.userName}</h2>
                            </li>
                        </ul>
                        {/* theory_top */}
                        <div className="theory_top">
                            <ul>
                                <li>
                                    {/* prog_bar */}
                                    <div className="prog_bar progbar_bg01">
                                        <div id="question_check">
                                            <span id="now_cnt">0</span>/<span id="total_cnt">{questionStart ? questionCnt : 0}</span>
                                        </div>
                                    </div>
                                    {!submitbtn ? (
                                        <button type="button" id="send_btn" className="thebtn thebtn_gray" style={{ cursor: 'default' }}>
                                            제출
                                        </button>
                                    ) : (
                                        <button type="button" id="send_btn" className="thebtn thebtn_red" onClick={() => handel_submit()}>
                                            제출
                                        </button>
                                    )}
                                </li>
                                <li>
                                    {!questionStart ? (
                                        <>
                                            <button className="thebtn thebtn_blue" type="button" onClick={Question_Start}>
                                                시작
                                            </button>
                                            <button
                                                // id="close-iframe-modal"
                                                data-mact="close"
                                                data-minfo="second-modal"
                                                className="modal_btn thebtn thebtn_blue thebtn_end"
                                                onClick={ModalClose}
                                            >
                                                종료
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="thebtn thebtn_gray" type="button" style={{ cursor: 'default' }}>
                                                시작
                                            </button>
                                            <button
                                                // id="close-iframe-modal"
                                                data-mact="close"
                                                data-minfo="second-modal"
                                                className="modal_btn thebtn thebtn_gray thebtn_end"
                                                style={{ cursor: 'default' }}
                                            >
                                                종료
                                            </button>
                                        </>
                                    )}
                                </li>
                            </ul>
                        </div>
                        {/* theory_bot */}

                        <div className="theory_bot mt15" style={{ height: '630px' }}>
                            {/* theoryb_left */}
                            {questionStart && (
                                <div className="theoryb_left">
                                    {/* theoryb_box */}
                                    <div className="theoryb_box theoryb_box_pd01">
                                        {/* theory_table */}
                                        <div className="theory_table">
                                            <table className="table">
                                                <colgroup>
                                                    <col style={{ width: '15%' }} />
                                                    <col style={{ width: '70%' }} />
                                                    <col style={{ width: '15%' }} />
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>문제</th>
                                                        <th>선택여부</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                        <div className="theory_table height550 scrollbar">
                                            <table className="table">
                                                <colgroup>
                                                    <col style={{ width: '15%' }} />
                                                    <col style={{ width: '70%' }} />
                                                    <col style={{ width: '15%' }} />
                                                </colgroup>
                                                <tbody id="question_list">
                                                    {selectTheoryListData?.questionList?.map((q, i) => (
                                                        <tr
                                                            key={i}
                                                            className={select_questionId === q.questionId ? 'on' : ''}
                                                            onClick={() => {
                                                                setQuestcount(i + 1);
                                                                handel_selectquestion(q.questionId, q.questionType);
                                                            }}
                                                        >
                                                            <td>{i + 1}</td>
                                                            <td>{q.question}</td>
                                                            <td>
                                                                <img id={i + 1} className="question_check" src={checkImg} alt="" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* theoryb_right */}
                            <div className="theoryb_right">
                                {selectTheoryData?.questionType === 'A' ? (
                                    // <TheoryevaluationW_mat01 Quest_Count={questcount} />

                                    <div id={`question${questcount}`} className="question_detail">
                                        <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                            <div className="matter01_tit">
                                                <div className="mat01tit_left">
                                                    문제번호 <span>{questcount < 9 ? `0${questcount}` : questcount}</span>
                                                </div>
                                                <div className="mat01tit_right">
                                                    <p className="mat01tit">{selectTheoryData?.question}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="theorybr02">
                                            <ul className="matter01_que">
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_1`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '1' ? 'on' : ''}
                                                >
                                                    <h3>01</h3>
                                                    <div className="matter01_choice">{selectTheoryData?.choice1}</div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_2`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '2' ? 'on' : ''}
                                                >
                                                    <h3>02</h3>
                                                    <div className="matter01_choice">{selectTheoryData?.choice2}</div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_3`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '3' ? 'on' : ''}
                                                >
                                                    <h3>03</h3>
                                                    <div className="matter01_choice">{selectTheoryData?.choice3}</div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_4`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '4' ? 'on' : ''}
                                                >
                                                    <h3>04</h3>
                                                    <div className="matter01_choice">{selectTheoryData?.choice4}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : selectTheoryData?.questionType === 'B' ? (
                                    // <TheoryevaluationW_mat02 Quest_Count={questcount} />
                                    <div id={`question${questcount}`} className="question_detail">
                                        <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                            <div className="matter01_tit">
                                                <div className="mat01tit_left">
                                                    문제번호 <span>{questcount < 9 ? `0${questcount}` : questcount}</span>
                                                </div>
                                                <div className="mat01tit_right">
                                                    <p className="mat01tit">{selectTheoryData?.question}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="theoryb_box theorybr02">
                                            <ul className="matter01_que">
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_o`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === 'o' ? 'on' : ''}
                                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                                >
                                                    <span className="mo o_off"></span>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_x`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === 'x' ? 'on' : ''}
                                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                                >
                                                    <span className="mx x_off"></span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : selectTheoryData?.questionType === 'C' ? (
                                    // <TheoryevaluationW_mat03 Quest_Count={questcount} />
                                    <div id={`question${questcount}`} className="question_detail">
                                        <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                            <div className="matter01_tit">
                                                <div className="mat01tit_left">
                                                    문제번호 <span>{questcount < 9 ? `0${questcount}` : questcount}</span>
                                                </div>
                                                <div className="mat01tit_right">
                                                    <p className="mat01tit">{selectTheoryData?.question}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="theorybr02">
                                            <ul className="matter01_que">
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_1`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '1' ? 'on' : ''}
                                                >
                                                    <h3>01</h3>
                                                    <div className="matter01_img">
                                                        <img src={`data:image/png;base64, ${selectTheoryData?.choiceImg1}`} alt="" />
                                                    </div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_2`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '2' ? 'on' : ''}
                                                >
                                                    <h3>02</h3>
                                                    <div className="matter01_img">
                                                        <img src={`data:image/png;base64, ${selectTheoryData?.choiceImg2}`} alt="" />
                                                    </div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_3`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '3' ? 'on' : ''}
                                                >
                                                    <h3>03</h3>
                                                    <div className="matter01_img">
                                                        <img src={`data:image/png;base64, ${selectTheoryData?.choiceImg3}`} alt="" />
                                                    </div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_4`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '4' ? 'on' : ''}
                                                >
                                                    <h3>04</h3>
                                                    <div className="matter01_img">
                                                        <img src={`data:image/png;base64, ${selectTheoryData?.choiceImg4}`} alt="" />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : selectTheoryData?.questionType === 'D' ? (
                                    // <TheoryevaluationW_mat04 Quest_Count={questcount} />
                                    <div id={`question${questcount}`} className="question_detail">
                                        <div className="theorybr01 theorybr01_con">
                                            <div className="theorybr01c_left">
                                                <div className="matter02_tit">
                                                    <div className="mat02tit_top">
                                                        문제번호 <span>{questcount < 9 ? `0${questcount}` : questcount}</span>
                                                    </div>
                                                    <div className="mat02tit_bot">
                                                        <p className="mat01tit">{selectTheoryData?.question}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="theorybr01c_right">
                                                <img src={`data:image/png;base64, ${selectTheoryData?.multiPlusImg}`} alt="" />
                                            </div>
                                        </div>
                                        <div className="theorybr02">
                                            <ul className="matter01_que">
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_1`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '1' ? 'on' : ''}
                                                >
                                                    <h3>01</h3>
                                                    <div className="matter01_choice mat01choice_short">{selectTheoryData?.choice1}</div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_2`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '2' ? 'on' : ''}
                                                >
                                                    <h3>02</h3>
                                                    <div className="matter01_choice mat01choice_short">{selectTheoryData?.choice2}</div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_3`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '3' ? 'on' : ''}
                                                >
                                                    <h3>03</h3>
                                                    <div className="matter01_choice mat01choice_short">{selectTheoryData?.choice3}</div>
                                                </li>
                                                <li
                                                    id={`${selectTheoryData?.questionId}_${questcount}_4`}
                                                    data-name={`question${questcount}`}
                                                    className={answerChk[questcount] === '4' ? 'on' : ''}
                                                >
                                                    <h3>04</h3>
                                                    <div className="matter01_choice mat01choice_short">{selectTheoryData?.choice4}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 완료 모달 창 Start */}
            <Modal
                className="custom-modal"
                maskClosable={false}
                open={completeModalOpen}
                onOk={completehandleOk}
                closable={false}
                width={560}
                style={{
                    top: 250,
                    zIndex: 999
                }}
                footer={null}
            >
                <div style={{ width: '542px', textAlign: 'center', padding: '50px 0px' }}>
                    <div className="scwd_txt01">
                        <h1>수고하셨습니다.</h1>
                    </div>
                    <div className="scwd_txt02">
                        <p>이론평가를 마치셨습니다.</p>
                    </div>
                    <button
                        id="open-six-modal"
                        data-mact="open"
                        data-minfo="six-modal"
                        className="modal_btn conbtn01"
                        onClick={completehandleOk}
                    >
                        확인
                    </button>
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
                        <h2>{recompleteModalText}</h2>
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
        </>
    );
};
