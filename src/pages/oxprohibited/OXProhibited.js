/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Select, Space } from 'antd';

import gun from '../../images/practice/gun.svg';
import bomb from '../../images/practice/bomb.svg';
import ammunition from '../../images/practice/ammunition.svg';
import sword from '../../images/practice/sword.svg';
import weapon from '../../images/practice/weapon.svg';
import camouflage_weapon from '../../images/practice/camouflage_weapon.svg';
import tool from '../../images/practice/tool.svg';
import flammable_sub from '../../images/practice/flammable_sub.svg';
import danger_substances from '../../images/practice/danger_substances.svg';
import liquid from '../../images/practice/liquid.svg';
import x_img from '../../images/learning/x.png';
import h_img from '../../images/learning/h.png';
import o_img from '../../images/learning/o.png';
import {
    useSelectUnitGroupListMutation,
    useSelectUnitGroupAnswerMutation
} from '../../hooks/api/SelectUnitGroupManagement/SelectUnitGroupManagement';

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

export const OXProhibited = (props) => {
    const [loading, setLoading] = useState(false); // 상단 (가방id) 테이블 로딩
    const [selectedOptions, setSelectedOptions] = useState({});

    // 반입금지물품 리스트 Api
    const [SelectUnitGroupApi] = useSelectUnitGroupListMutation();
    const [selectUnitGroupData, setSelectUnitGroupData] = useState([]);

    // 반입금지물품 정답 Api
    const [SelectUnitGroupAnswerApi] = useSelectUnitGroupAnswerMutation();
    const [selectUnitGroupAnswerData, setSelectUnitGroupAnswerData] = useState([]);

    // =====================================================================================
    // API 호출 Start
    // =====================================================================================

    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'practice', //화면아이디
            languageCode: languageKey
        });
        //console.log(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // 반입금지물품 리스트 Api Call
    const SelectUnitGroup_ApiCall = async () => {
        const SelectUnitGroupResponse = await SelectUnitGroupApi({
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectUnitGroupData(SelectUnitGroupResponse?.data?.RET_DATA);
        setLoading(false);
    };

    // 반입금지물품 정답 Api Call
    const SelectUnitGroupAnswer_ApiCall = async (userActionDiv, unitGroupCd) => {
        const SelectUnitGroupAnswerResponse = await SelectUnitGroupAnswerApi({
            unitGroupCd: unitGroupCd, //반입금지물품cd
            userActionDiv: userActionDiv, //사용자정답
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectUnitGroupAnswerData(SelectUnitGroupAnswerResponse?.data?.RET_DATA);
        setSelectedOptions((prevState) => ({
            ...prevState,
            [unitGroupCd]: SelectUnitGroupAnswerResponse?.data?.RET_DATA?.answerYn
        }));
        setLoading(false);
    };
    // =====================================================================================
    // API 호출 End
    // =====================================================================================

    const OptionsSet = [
        {
            value: '0',
            label: '개봉/금지',
            color: '#155eb6'
        },
        {
            value: '1',
            label: '미개봉/금지',
            color: '#155eb6'
        },
        {
            value: '2',
            label: '개봉/제한',
            color: '#155eb6'
        },
        {
            value: '3',
            label: '개봉/통과',
            color: '#155eb6'
        },
        {
            value: '4',
            label: '미개봉/통과',
            color: '#155eb6'
        }
    ];

    // 정답 체크
    const handleChange = (e, unitGroupCd) => {
        SelectUnitGroupAnswer_ApiCall(e, unitGroupCd);

        // console.log(`selected ${value}`);
    };

    const ModalClose = () => {
        props.ModalClose();
    };

    useEffect(() => {
        LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp'));
        setLoading(true);
        SelectUnitGroup_ApiCall();
    }, []);

    return (
        <>
            <div className="xbt_content banItems_content">
                {/* <!-- xbt_top --> */}
                <div className="xbt_top">
                    {/* <!-- xbttop02 --> */}
                    <div className="xbttop02">
                        <ul>
                            <li>
                                <h1 className="contit">{languageApplyInfoData.practic1}</h1>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* <!-- xbt_con --> */}
                <div className="xbt_con">
                    {/* <!-- 물품 타이틀 표 --> */}
                    <div className="banItems_table">
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '50%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '10%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>{languageApplyInfoData.practic2}</th>
                                    <th className="t_left">{languageApplyInfoData.practic3}</th>
                                    <th className="t_left">{languageApplyInfoData.practic4}</th>
                                    <th>Action</th>
                                    <th>{languageApplyInfoData.practic5}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    {/* <!-- //물품 타이틀 표 -->	 */}
                    {/* <!-- 물품 내용 표 --> */}
                    <div className="banItems_table scrollbar">
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '50%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '10%' }} />
                            </colgroup>
                            <tbody>
                                {selectUnitGroupData?.map((d, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ width: '10%' }}>
                                                <span>
                                                    <img src={'data:image/svg+xml;base64,' + d.unitImg} alt="" />
                                                    {/* <img src={gun} alt="" /> */}
                                                </span>
                                            </td>
                                            <td style={{ width: '15%' }}>{d.groupName}</td>
                                            <td style={{ width: '50%' }}>{d.groupDesc}</td>
                                            <td style={{ width: '15%' }}>
                                                {/* <!-- 옵션--> */}
                                                <div className="practice_test_select">
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="#정답선택"
                                                            style={{
                                                                color: selectedOptions ? 'red' : '#98BBE0',
                                                                width: '180px',
                                                                borderRadius: 8
                                                            }}
                                                            onChange={(e) => handleChange(e, d.unitGroupCd)}
                                                            options={OptionsSet}
                                                            optionLabelProp="label"
                                                        />
                                                    </Space>
                                                </div>
                                                {/* <!-- //옵션 --> */}
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <span>
                                                    <img
                                                        src={
                                                            selectedOptions[d.unitGroupCd] === 'Y'
                                                                ? o_img
                                                                : selectedOptions[d.unitGroupCd] === 'N'
                                                                ? x_img
                                                                : selectedOptions[d.unitGroupCd] === 'H'
                                                                ? h_img
                                                                : ''
                                                        }
                                                        alt=""
                                                    />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* <!-- //물품 내용 표 --> */}
                </div>
                <button
                    id="close-first-modal"
                    data-mact="close"
                    data-minfo="first-modal"
                    className="modal_btn close_btn"
                    onClick={ModalClose}
                ></button>
            </div>
        </>
    );
};
