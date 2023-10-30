/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import gun from '../../images/practice/gun.svg';
// import bomb from '../../images/practice/bomb.svg';
// import ammunition from '../../images/practice/ammunition.svg';
// import sword from '../../images/practice/sword.svg';
// import weapon from '../../images/practice/weapon.svg';
// import camouflage_weapon from '../../images/practice/camouflage_weapon.svg';
// import tool from '../../images/practice/tool.svg';
// import flammable_sub from '../../images/practice/flammable_sub.svg';
// import danger_substances from '../../images/practice/danger_substances.svg';
// import liquid from '../../images/practice/liquid.svg';

import { useSelectUnitGroupListMutation } from '../../hooks/api/SelectUnitGroupManagement/SelectUnitGroupManagement';

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

export const Prohibited = (props) => {
    const [loading, setLoading] = useState(false); // 상단 (가방id) 테이블 로딩

    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'practicepop', //화면아이디
            languageCode: languageKey
        });
        //console.log(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // 반입금지물품 리스트 Api
    const [SelectUnitGroupApi] = useSelectUnitGroupListMutation();
    const [selectUnitGroupData, setSelectUnitGroupData] = useState([]);

    // =====================================================================================
    // API 호출 Start
    // =====================================================================================
    // 반입금지물품 리스트 Api Call
    const SelectUnitGroup_ApiCall = async () => {
        const SelectUnitGroupResponse = await SelectUnitGroupApi({
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectUnitGroupData(SelectUnitGroupResponse?.data?.RET_DATA);
        setLoading(false);
    };
    // =====================================================================================
    // API 호출 End
    // =====================================================================================

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
                                <h1 className="contit">{languageApplyInfoData.practicepop1}</h1>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* <!-- xbt_con --> */}
                <div className="xbt_con">
                    {/* <!-- 물품 내용 표 --> */}
                    <div className="banItems_table scrollbar">
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '60%' }} />
                                <col style={{ width: '15%' }} />
                            </colgroup>
                            <tbody>
                                {selectUnitGroupData?.map((d, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <span>
                                                    <img src={gun.svg} alt="" />
                                                </span>
                                            </td>
                                            <th>{d.groupName}</th>
                                            {/* <td>총기류 (권총, 소총, 기타 총기부품), 가스총, 장난감총 등</td> */}
                                            <td>{d.groupDesc}</td>
                                            <td>{d.actionDivName}</td>
                                        </tr>
                                    );
                                })}
                                {/* <tr>
                                <td>
                                    <span>
                                        <img src={bomb.svg} alt="" />
                                    </span>
                                </td>
                                <th>폭발물류</th>
                                <td>폭약, 사제폭발물, 도화선, 도폭선, 점화장치, 뇌관, 신호탄, 수류탄, 연막탄 등</td>
                                <td>미개봉 / 금지</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={ammunition.svg} alt="" />
                                    </span>
                                </td>
                                <th>실탄류</th>
                                <td>총탄류(권총탄, 소총탄), 탄창, 산탄, 납탄, BB탄 등</td>
                                <td>개봉 / 제한</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={sword.svg} alt="" />
                                    </span>
                                </td>
                                <th>도검류</th>
                                <td>카터칼, 맥가이버칼,과도, 테일키트, 박스칼 등</td>
                                <td>개봉 / 제한</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={weapon.svg} alt="" />
                                    </span>
                                </td>
                                <th>일반 무기류</th>
                                <td>전자충격기, 호신용 스프레이, 다트, 수갑, 곤봉, 표창, 쌍절곤, 목검, 둔기 등</td>
                                <td>개봉 / 제한</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={camouflage_weapon.svg} alt="" />
                                    </span>
                                </td>
                                <th>위장무기류</th>
                                <td>혁대칼, 립스틱칼, 라이터칼, 지팡이칼, 카드칼, 목걸이위장칼 등</td>
                                <td>개봉 / 제한</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={tool.svg} alt="" />
                                    </span>
                                </td>
                                <th>공구/생활용품류</th>
                                <td>망치, 톱, 톱날, 줄, 드라이버, 송곳, 가위 등 (기준 초과시)</td>
                                <td>개봉 / 제한</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={flammable_sub.svg} alt="" />
                                    </span>
                                </td>
                                <th>인화성물질류</th>
                                <td>라이터가스&기름, 신너, 접착제(본드), 캠핑가스, 폭죽 등</td>
                                <td>개봉 / 제한</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={danger_substances.svg} alt="" />
                                    </span>
                                </td>
                                <th>위험물질류</th>
                                <td>독극물, 염산, 황산, 습식건전지, 부식제, 수은, 살충제 등</td>
                                <td>미개봉 / 금지</td>
                            </tr>
                            <tr>
                                <td>
                                    <span>
                                        <img src={liquid.svg} alt="" />
                                    </span>
                                </td>
                                <th>액체, 겔 물품</th>
                                <td>개별용기당 100ml를 초과하는 액체,겔 물품(화장품, 샴푸, 고추장, 된장 등)</td>
                                <td>개봉 / 제한</td>
                            </tr> */}
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
