import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

import '../../css/theory.css';
import 'jquery-ui/ui/widgets/progressbar';
import $ from 'jquery';
import checkImg from '../../images/theory/check.svg';

export const TheoryevaluationW = (props) => {
    const { confirm } = Modal; // Modal

    // 종료 처리
    const ModalClose = () => {
        props.ModalClose();
    };

    useEffect(() => {
        $(document).ready(function () {
            //기본 세팅(문제 1번만 보이기, 총 문제 수 적용)
            $('.question_check').hide();
            $('.question_detail').hide();
            $('#question1').show();
            if ($('.matter01_que').length > 0) {
                $('#total_cnt').text($('.matter01_que').length);
            }

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
        //목록 누르면 문제 변경하기
        */
            $('#question_list tr').on('click', function () {
                //목록에서 강조표시
                $(this).parent().children('tr').removeClass('on');
                $(this).addClass('on');

                var target_num = $(this).index() + 1;

                //문제 숨긴다음 선택한 문제 표시
                $('.question_detail').hide();
                $('#question' + target_num).show();
            });

            /*
        //라디오 버튼 누르면 목록에 제출 표시
        */
            $('.matter01_que li').on('click', function () {
                $(this).parent().children('li').removeClass('on');
                $(this).addClass('on');
                //라디오버튼의 name을 가져와서
                var groupName = $(this).data('name');

                //li에 data 형식으로 찾은다음
                var liSelector = '#' + groupName + '_check';

                //찾은 li에 클래스 추가
                $(liSelector).show();

                //정답을 누를때 마다 현재 몇개 풀었는지 계산
                $('#now_cnt').text($('.matter01_que li.on').length);
                $('.prog_bar').progressbar({
                    value: Math.floor(($('.matter01_que li.on').length / $('.matter01_que').length) * 100)
                });

                //전체 문제 수와 정답을 선택한 문제 수를 비교해 같으면 제출 버튼 활성화
                if ($('.matter01_que li.on').length == $('.matter01_que').length) {
                    $('#send_btn').removeClass('thebtn_gray');
                    $('#send_btn').addClass('thebtn_red');
                }
            });
        });
    }, []);
    return (
        <>
            <div className="theory_bg">
                {/* theory_con */}
                <div className="theory_con">
                    {/* thetop */}
                    <div className="thetop">
                        <ul>
                            <li>
                                <h1 className="contit">이론</h1>
                            </li>
                            <li>
                                <h2 className="conname">홍길동</h2>
                            </li>
                        </ul>
                        {/* theory_top */}
                        <div className="theory_top">
                            <ul>
                                <li>
                                    {/* prog_bar */}
                                    <div className="prog_bar progbar_bg01">
                                        <div id="question_check">
                                            <span id="now_cnt">0</span>/<span id="total_cnt">15</span>
                                        </div>
                                    </div>
                                    <button type="button" id="send_btn" className="thebtn thebtn_gray">
                                        제출
                                    </button>
                                </li>
                                <li>
                                    <button className="thebtn thebtn_blue" type="button">
                                        시작
                                    </button>
                                    <button
                                        // id="close-iframe-modal"
                                        data-mact="close"
                                        data-minfo="second-modal"
                                        className="modal_btn thebtn thebtn_gray thebtn_end"
                                        onClick={ModalClose}
                                    >
                                        종료
                                    </button>
                                </li>
                            </ul>
                        </div>
                        {/* theory_bot */}
                        <div className="theory_bot mt15">
                            {/* theoryb_left */}
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
                                                <tr className="on">
                                                    <td>1</td>
                                                    <td>차량검색요령으로서 차량검색 점검항목으로 적절하지 않은 것은?</td>
                                                    <td>
                                                        <img id="question1_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>
                                                        출입초소 근무 중 화물차량 검색을 실시하여야 한다. 다음 중 차량검색요령의 유의사항이
                                                        아닌 것은?
                                                    </td>
                                                    <td>
                                                        <img id="question2_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>
                                                        휴대용금속탐지장비의 검색요령으로 검색순서가 올바른 것은 ? <br />
                                                        ① 가슴에서 낭심까지 인체의 앞 부분 전체
                                                        <br />
                                                        ② 휴대용금속탐지장비를 왼손 또는 오른손으로 가볍게 잡는다.
                                                        <br />
                                                        ③ 뒷목에서 둔부까지 뒷부분검색
                                                        <br />④ 피검사자의 왼쪽팔위부터 시계방향으로 오른쪽팔 위까지
                                                    </td>
                                                    <td>
                                                        <img id="question3_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>4</td>
                                                    <td>차량 보안검색 순서가 맞는 것은?</td>
                                                    <td>
                                                        <img id="question4_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>5</td>
                                                    <td>보호구역 출입통제 지점에 대한 설명 중 맞지 않는 것은?</td>
                                                    <td>
                                                        <img id="question5_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>6</td>
                                                    <td>보호구역 출입차량에 대한 확인절차에 관한 설명중 맞지 않는 것은?</td>
                                                    <td>
                                                        <img id="question6_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>7</td>
                                                    <td>
                                                        출입초소 근무 중 화물차량 검색을 실시하여야 한다. 다음중 차량검색요령의 유의사항이
                                                        아닌 것은?
                                                    </td>
                                                    <td>
                                                        <img id="question7_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>8</td>
                                                    <td>
                                                        보안검색 완료구역으로 들어가는 승무원, 공항 보호구역 출입증을 소지한 공항직원, 그
                                                        밖에 보호구역 진입을 허가 받은 사람 및 물품에 대한 보안검색 방법으로 올바른 것은?
                                                    </td>
                                                    <td>
                                                        <img id="question8_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>9</td>
                                                    <td>다음은 보호구역내 무기반입에 대한 내용이다. 틀린 내용은?</td>
                                                    <td>
                                                        <img id="question9_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>10</td>
                                                    <td>항공보안검색요원의 보안검색 대상이 아닌 것은?</td>
                                                    <td>
                                                        <img id="question10_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>11</td>
                                                    <td>다음 중 보안검색요원이 보안검색업무 인수. 인계 사항이 아닌 것은?</td>
                                                    <td>
                                                        <img id="question11_check" className="question_check" src={checkImg} alt="" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* theoryb_right */}
                            <div className="theoryb_right">
                                <div id="question1" className="question_detail">
                                    {/* theoryb_box */}
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        {/* matter01_tit */}
                                        <div className="matter01_tit">
                                            {/* mat01tit_left */}
                                            <div className="mat01tit_left">
                                                문제번호 <span>01</span>
                                            </div>
                                            {/* mat01tit_right */}
                                            <div className="mat01tit_right">
                                                <p className="mat01tit">차량검색요령으로서 차량검색 점검항목으로 적절하지 않은 것은?</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* theoryb_box */}
                                    <div className="theorybr02">
                                        {/* matter01_que */}
                                        <ul className="matter01_que" id="matter01_que">
                                            <li data-name="question1" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">차량반사경</div>
                                            </li>
                                            <li data-name="question1" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">차량외부</div>
                                            </li>
                                            <li data-name="question1" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">트렁크</div>
                                            </li>
                                            <li data-name="question1" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">차량하부</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question2" className="question_detail">
                                    {/* theoryb_box */}
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        {/* matter01_tit */}
                                        <div className="matter01_tit">
                                            {/* mat01tit_left */}
                                            <div className="mat01tit_left">
                                                문제번호 <span>02</span>
                                            </div>
                                            {/* mat01tit_right */}
                                            <div className="mat01tit_right">
                                                <p className="mat01tit ">
                                                    출입초소 근무 중 화물차량 검색을 실시하여야 한다. 다음 중 차량검색요령의 유의사항이 아닌
                                                    것은?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* theorybr02 */}
                                    <div className="theorybr02">
                                        {/* matter01_que */}
                                        <ul className="matter01_que">
                                            <li data-name="question2" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">차량엔진을 끄지않고 시동중에 보안검색실시</div>
                                            </li>
                                            <li data-name="question2" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">운전자와 탑승객의 위치파악</div>
                                            </li>
                                            <li data-name="question2" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">폭발물 설치가능 또는 운전자 도주 우려시 안전장소 격리</div>
                                            </li>
                                            <li data-name="question2" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">차량출입증 소지여부 확인</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question3" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>03</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit ">
                                                    휴대용금속탐지장비의 검색요령으로 검색순서가 올바른 것은 ? <br />
                                                    ① 가슴에서 낭심까지 인체의 앞 부분 전체
                                                    <br />
                                                    ② 휴대용금속탐지장비를 왼손 또는 오른손으로 가볍게 잡는다.
                                                    <br />
                                                    ③ 뒷목에서 둔부까지 뒷부분검색
                                                    <br />④ 피검사자의 왼쪽팔위부터 시계방향으로 오른쪽팔 위까지
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question3" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">②→④→①→③</div>
                                            </li>
                                            <li data-name="question3" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">④→②→③→①</div>
                                            </li>
                                            <li data-name="question3" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">①→④→②→③</div>
                                            </li>
                                            <li data-name="question3" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">①→②→③→④</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question4" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>04</span>
                                            </div>
                                            <div className="mat01tit_right">
                                                <p className="mat01tit">차량 보안검색 순서가 맞는 것은?</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question4" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">
                                                    차량외부 → 트렁크 → 급유구 → 타이어 → 엔진룸 → 차량하부 → 차량내부
                                                </div>
                                            </li>
                                            <li data-name="question4" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">
                                                    차량외부 → 급유구 → 트렁크 → 타이어 → 엔진룸 → 차량하부 → 차량내부
                                                </div>
                                            </li>
                                            <li data-name="question4" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">
                                                    차량외부 → 트렁크 → 급유구 → 엔진룸 → 타이어 → 차량하부 → 차량내부
                                                </div>
                                            </li>
                                            <li data-name="question4" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">
                                                    차량외부 → 트렁크 → 급유구 → 차량내부 → 엔진룸 → 차량하부 → 타이어
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question5" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>05</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit">보호구역 출입통제 지점에 대한 설명 중 맞지 않는 것은?</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question5" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">공항 근처의 체육관으로 진입하는 지점</div>
                                            </li>
                                            <li data-name="question5" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">
                                                    여객터미널 또는 화물터미널의 보호구역으로 진입하는 지점
                                                </div>
                                            </li>
                                            <li data-name="question5" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">
                                                    공항 주변도로에서 주기장 등 공항이동지역으로 진입하는 지점
                                                </div>
                                            </li>
                                            <li data-name="question5" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">
                                                    인원 또는 차량이 일반지역에서 보호구역으로 진입하는 지점
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question6" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>06</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit">보호구역 출입차량에 대한 확인절차에 관한 설명중 맞지 않는 것은?</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question6" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">차량등록증 소지여부</div>
                                            </li>
                                            <li data-name="question6" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">차량번호와 보호구역 출입증과 일치여부</div>
                                            </li>
                                            <li data-name="question6" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">출입허가 구역의 일치여부</div>
                                            </li>
                                            <li data-name="question6" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">출입증의 출입허가기간의 경과여부</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question7" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>07</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit">
                                                    출입초소 근무 중 화물차량 검색을 실시하여야 한다. 다음중 차량검색요령의 유의사항이 아닌
                                                    것은?
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question7" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">차량엔진을 끄지 않고 시동중에 보안검색실시</div>
                                            </li>
                                            <li data-name="question7" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">운전자와 탑승객의 위치파악</div>
                                            </li>
                                            <li data-name="question7" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">폭발물 설치가능 또는 운전자 도주 우려시 안전장소 격리</div>
                                            </li>
                                            <li data-name="question7" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">차량출입증 소지여부 확인</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question8" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>08</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit">
                                                    보안검색 완료구역으로 들어가는 승무원, 공항 보호구역 출입증을 소지한 공항직원, 그 밖에
                                                    보호구역 진입을 허가 받은 사람 및 물품에 대한 보안검색 방법으로 올바른 것은?
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question8" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">일반승객과 동일한 보안검색을 실시 한다</div>
                                            </li>
                                            <li data-name="question8" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">특별 보안검색을 실시 한다</div>
                                            </li>
                                            <li data-name="question8" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">상주직원이므로 보안검색을 생략한다</div>
                                            </li>
                                            <li data-name="question8" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">약식보안검색을 실시하여야 한다</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question9" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>09</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit">다음은 보호구역내 무기반입에 대한 내용이다. 틀린 내용은?</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question9" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">
                                                    항공기내보안요원이 무기를 반입할 경우, 승무원증을 확인한 후 본인이 맞을시 통과 시킨다.
                                                </div>
                                            </li>
                                            <li data-name="question9" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">
                                                    항공기에 무기를 가지고 들어가려는 사람은 탑승 전에 이를 해당 항공기의 기장에게 보관하게
                                                    하고 목적지에 도착한 후 반환받아야 한다.
                                                </div>
                                            </li>
                                            <li data-name="question9" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">
                                                    경호업무 및 범죄인 호송업무를 위한 무기는 지방항공청장의 허가를 받아야 한다.
                                                </div>
                                            </li>
                                            <li data-name="question9" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">
                                                    공항운영업무를 위한 청원경찰이 소지한 무기는 허가대상과 허가된 무기인지를 확인 후
                                                    기록유지 한다.
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question10" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>10</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit">항공보안검색요원의 보안검색 대상이 아닌 것은?</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question10" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">항공기에서 탑승 하는 승객의 환송객</div>
                                            </li>
                                            <li data-name="question10" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">휴대물품 및 위탁수하물</div>
                                            </li>
                                            <li data-name="question10" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">항공기에 탑승하는 기장, 승무원</div>
                                            </li>
                                            <li data-name="question10" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">보호구역에 출입하는 상주직원 및 임시출입자</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="question11" className="question_detail">
                                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                                        <div className="matter01_tit">
                                            <div className="mat01tit_left">
                                                문제번호 <span>11</span>
                                            </div>

                                            <div className="mat01tit_right">
                                                <p className="mat01tit">다음 중 보안검색요원이 보안검색업무 인수. 인계 사항이 아닌 것은?</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="theorybr02">
                                        <ul className="matter01_que">
                                            <li data-name="question11" data-num="1">
                                                <h3>01</h3>
                                                <div className="matter01_choice">보안검색요원 근무자들 개개인의 컨디션</div>
                                            </li>
                                            <li data-name="question11" data-num="2">
                                                <h3>02</h3>
                                                <div className="matter01_choice">근무 중 발생한 특이사항 확인</div>
                                            </li>
                                            <li data-name="question11" data-num="3">
                                                <h3>03</h3>
                                                <div className="matter01_choice">
                                                    보안검색 근무일지에 서명 및 근무 중 발생한 특이사항 기록
                                                </div>
                                            </li>
                                            <li data-name="question11" data-num="4">
                                                <h3>04</h3>
                                                <div className="matter01_choice">항공보안장비의 정상작동상태 및 수량 등을 확인</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
