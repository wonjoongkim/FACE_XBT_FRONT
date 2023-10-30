/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
// import { Col, Row, Button, Space, Modal } from 'antd';
// import { Typography } from '@mui/material';

// project import
// import MainCard from 'components/MainCard';

// import tab_01 from '../../images/score/tab_img01.png';
// import tab_02 from '../../images/score/tab_img02.png';
// import tab_03 from '../../images/score/tab_img03.png';
import { Score01 } from './Score01';
import { Score02 } from './Score02';
import { Score03 } from './Score03';
import './eduinfo.css';

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

export const EduInfo = (props) => {
    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'edu', //화면아이디
            languageCode: languageKey
        });
        //console.log(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    const [scoreTabs, setScoreTabs] = useState('score01'); //메뉴선택상태
    const ModalClose = () => {
        props.ModalClose();
    };

    useEffect(() => {
        LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp'));
    }, []);

    return (
        <>
            {/* <!-- xbttop02 --> */}
            <div className="xbttop01">
                <ul>
                    <li>
                        <h1 className="contit">{languageApplyInfoData.edu1}</h1>
                    </li>
                    <li>
                        {/* <!--탭 메뉴 --> */}
                        <div id="layer_menu">
                            <ul>
                                <li style={localStorage.getItem('LangTp') !== 'kr' ? { width: '280px' } : {}}>
                                    <button
                                        type="button"
                                        data-filename="score01"
                                        className={scoreTabs === 'score01' ? 'on' : ''}
                                        onClick={() => setScoreTabs('score01')}
                                        style={{ fontSize: '16px' }}
                                    >
                                        {languageApplyInfoData.edu2}
                                    </button>
                                </li>
                                <li style={localStorage.getItem('LangTp') !== 'kr' ? { width: '280px' } : {}}>
                                    <button
                                        type="button"
                                        data-filename="score02"
                                        className={scoreTabs === 'score02' ? 'on' : ''}
                                        onClick={() => setScoreTabs('score02')}
                                        style={{ fontSize: '16px' }}
                                    >
                                        {languageApplyInfoData.edu3}
                                    </button>
                                </li>
                                <li style={localStorage.getItem('LangTp') !== 'kr' ? { width: '280px' } : {}}>
                                    <button
                                        type="button"
                                        data-filename="score03"
                                        className={scoreTabs === 'score03' ? 'on' : ''}
                                        onClick={() => setScoreTabs('score03')}
                                        style={{ fontSize: '16px' }}
                                    >
                                        {languageApplyInfoData.edu4}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <div className="score_img conbox_sty conbox_pd01 mt20">
                    <div id="tab_div">
                        {scoreTabs === 'score01' ? (
                            <Score01 />
                        ) : scoreTabs === 'score02' ? (
                            <Score02 />
                        ) : scoreTabs === 'score03' ? (
                            <Score03 />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <button
                    id="close-one-md"
                    data-mact="close"
                    data-minfo="one-md"
                    className="modal_btn close_btn"
                    style={{ marginTop: '20px', marginRight: '20px' }}
                    onClick={ModalClose}
                ></button>
            </div>
        </>
    );
};
