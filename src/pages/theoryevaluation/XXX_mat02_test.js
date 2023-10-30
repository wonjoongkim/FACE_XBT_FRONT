import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

import '../../css/theory.css';
import 'jquery-ui/ui/widgets/progressbar';
import $ from 'jquery';
import checkImg from '../../images/theory/check.svg';

export const TheoryevaluationW_mat02 = (props) => {
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
            if ($('.matter02_que').length > 0) {
                $('#total_cnt').text($('.matter02_que').length);
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
            $('.matter02_que li').on('click', function () {
                $(this).parent().children('li').removeClass('on');
                $(this).addClass('on');
                //라디오버튼의 name을 가져와서
                var groupName = $(this).data('name');

                //li에 data 형식으로 찾은다음
                var liSelector = '#' + groupName + '_check';

                //찾은 li에 클래스 추가
                $(liSelector).show();

                //정답을 누를때 마다 현재 몇개 풀었는지 계산
                // $('#now_cnt').text($('.matter02_que li.on').length);
                // $('.prog_bar').progressbar({
                //     value: Math.floor(($('.matter02_que li.on').length / $('.matter02_que').length) * 100)
                // });

                //전체 문제 수와 정답을 선택한 문제 수를 비교해 같으면 제출 버튼 활성화
                if ($('.matter02_que li.on').length == $('.matter02_que').length) {
                    $('#send_btn').removeClass('thebtn_gray');
                    $('#send_btn').addClass('thebtn_red');
                }
            });
        });
    }, []);
    return (
        <>
            {/* theoryb_right */}
            <div className="theoryb_right">
                <div id={`question${props.Quest_Count}`} className="question_detail">
                    {/* theoryb_box */}
                    <div className="theoryb_box theoryb_box_pd01 theorybr01">
                        {/* matter01_tit */}
                        <div className="matter01_tit">
                            {/* mat01tit_left */}
                            <div className="mat01tit_left">
                                문제번호 <span>0{props.Quest_Count}</span>
                            </div>
                            {/* mat01tit_right */}
                            <div className="mat01tit_right">
                                <p className="mat01tit">
                                    보안검색 완료구역으로 들어가는 승무원, 공항 보호구역 출입증을 소지한 공항직원, 그 밖에 보호구역 진입을
                                    허가 받은 사람 및 물품에 대한 보안검색 방법으로 올바른 것은?
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* theoryb_box */}
                    <div className="theoryb_box theorybr02">
                        <ul className="matter02_que">
                            <li data-name="question1">
                                <span className="mo o_off"></span>
                            </li>
                            <li data-name="question1">
                                <span className="mx x_off"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};
