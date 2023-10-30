/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Select, Modal, Spin, Image, Empty, Space } from 'antd';

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

// 교육생 정보 API
import { useSelectBaselineUserInfoMutation } from '../../hooks/api/MainManagement/MainManagement';
import empty from '../../images/learning/empty.svg';
import {
    useSelectUnitGroupListMutation,
    useSelectUnitListMutation,
    useSelectUnitMutation,
    useSelectCommonPracticeImgMutation,
    useSelectUnitImgMutation,
    useSelectLearnProblemsResultMutation
} from '../../hooks/api/PracticeManagement/PracticeManagement';

// 반입금지물품
import { Prohibited } from 'pages/prohibited';

export const Practice = (props) => {
    const { confirm } = Modal;
    const [ModalOpen, setModalOpen] = useState(false); // 반입금지물품 Modal창
    const [btabcho, setBtabcho] = useState('');
    const [stabcho, setStabcho] = useState('');

    const [optionVal, setOptionVal] = useState('0');
    const [selectUnit, setSelectUnit] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(false); // 이미지 클릭시
    const [imgView, setImgView] = useState(); // Preview 이미지 설장
    const [unitRealImg, setUnitRealImg] = useState(); // 실제 이미지
    const [unitThreedImg, setUnitThreedImg] = useState(); // 3D 이미지
    const [unitFrontImg, setUnitFrontImg] = useState(); // 정면 이미지
    const [unitSideImg, setUnitSideImg] = useState(); // 측면 이미지

    const [loading_List, setLoading_List] = useState(false);
    const [loading_Detail, setLoading_Detail] = useState(false);
    const [loading_Unit, setLoading_Unit] = useState(false);
    const [loading_UnitImg, setLoading_UnitImg] = useState(false);
    const [loading_UnitImg3D, setLoading_UnitImg3D] = useState(false);

    const [scale, setScale] = useState(1); // 확대, 축소
    const [flip, setFlip] = useState(false); // 반전(좌우)
    const tableRef = useRef(null);

    // 교육생 api 정보
    const [SelectBaselineUserInfoApi] = useSelectBaselineUserInfoMutation();
    const [selectBaselineUserInfoData, setSelectBaselineUserInfoData] = useState([]);

    // 물품연습 > 그룹조회목록
    const [SelectUnitGroupListApi] = useSelectUnitGroupListMutation();
    const [selectUnitGroupListData, setSelectUnitGroupListData] = useState([]);

    // 물품연습 > 그룹물품목록조회
    const [SelectUnitListApi] = useSelectUnitListMutation();
    const [selectUnitListData, setSelectUnitListData] = useState([]);

    // 물품연습 > 단품상세조회
    const [SelectUnitApi] = useSelectUnitMutation();
    const [selectUnitData, setSelectUnitData] = useState([]);

    // 물품연습 > 이미지목록가져오기
    const [SelectCommonPracticeImgApi] = useSelectCommonPracticeImgMutation();
    const [selectCommonPracticeImgData, setSelectCommonPracticeImgData] = useState([]);

    // 물품연습 > 의사색체이미지조회
    const [SelectUnitImgApi] = useSelectUnitImgMutation();
    const [selectUnitImgData, setSelectUnitImgData] = useState([]);

    // 물품연습 > 3d이미지각조조절
    const [SelectLearnProblemsResultApi] = useSelectLearnProblemsResultMutation();
    const [selectLearnProblemsResultData, setSelectLearnProblemsResultData] = useState([]);

    // =====================================================================================
    // API 호출 Start
    // =====================================================================================

    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'itempratice', //화면아이디
            languageCode: languageKey
        });
        console.log(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // 교육생정보 Api Call
    const SelectBaselineUserInfo_ApiCall = async () => {
        const mainmenuResponse = await SelectBaselineUserInfoApi({
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectBaselineUserInfoData(mainmenuResponse?.data?.RET_DATA);
    };

    // 물품연습 > 그룹조회목록 Api Call
    const SelectUnitGroupList_ApiCall = async () => {
        const SelectUnitGroupListResponse = await SelectUnitGroupListApi({
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectUnitGroupListData(SelectUnitGroupListResponse?.data?.RET_DATA);
        setLoading_List(false);
    };

    // 물품연습 > 그룹물품목록조회 Api Call
    const SelectUnitList_ApiCall = async (unitGroupCd) => {
        const SelectUnitListResponse = await SelectUnitListApi({
            unitGroupCd: unitGroupCd,
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectUnitListData(SelectUnitListResponse?.data?.RET_DATA);
        setLoading_Detail(false);
    };

    // 물품연습 > 단품상세조회 Api Call
    const SelectUnit_ApiCall = async (unitId) => {
        const SelectUnitResponse = await SelectUnitApi({
            unitId: unitId,
            languageCode: localStorage.getItem('LangTp')
        });
        setSelectUnitData(SelectUnitResponse?.data?.RET_DATA);
        SelectCommonPracticeImg_ApiCall(unitId);
        setLoading_Unit(false);
    };

    // 물품연습 > 이미지목록가져오기 Api Call
    const SelectCommonPracticeImg_ApiCall = async (unitId) => {
        const SelectCommonPracticeImgResponse = await SelectCommonPracticeImgApi({
            unitId: unitId
        });
        setSelectCommonPracticeImgData(SelectCommonPracticeImgResponse?.data?.RET_DATA);

        setUnitRealImg(SelectCommonPracticeImgResponse?.data?.RET_DATA.imgReal);
        setUnitThreedImg(SelectCommonPracticeImgResponse?.data?.RET_DATA.imgThreed);
        setUnitFrontImg(SelectCommonPracticeImgResponse?.data?.RET_DATA.imgFront);
        setUnitSideImg(SelectCommonPracticeImgResponse?.data?.RET_DATA.imgSide);
        setLoading_UnitImg(false);
    };

    // 물품연습 > 3d이미지각조조절 Api Call
    const SelectLearnProblemsResult_ApiCall = async (unitId, command) => {
        const SelectLearnProblemsResultResponse = await SelectLearnProblemsResultApi({
            unitId: unitId,
            command: command //각도
        });
        setSelectLearnProblemsResultData(SelectLearnProblemsResultResponse?.data?.RET_DATA);
        setUnitThreedImg(SelectLearnProblemsResultResponse?.data?.RET_DATA.imgThreedAngle);
        setLoading_UnitImg3D(false);
    };
    // =====================================================================================
    // API 호출 End
    // =====================================================================================

    // 이전
    const goToPrevious = () => {
        if (stabcho > 0) {
            setLoading_UnitImg(true);
            setCurrentIndex(stabcho - 1);
            SelectUnit_ApiCall(selectUnitListData[stabcho - 1].unitId);
            setStabcho(stabcho - 1);
            scrollToRow(stabcho - 1);
        }
    };

    // 다음
    const goToNext = () => {
        if (stabcho < selectUnitListData.length - 1) {
            setLoading_UnitImg(true);
            setCurrentIndex(stabcho + 1);
            SelectUnit_ApiCall(selectUnitListData[stabcho + 1].unitId);
            setStabcho(stabcho + 1);
            scrollToRow(stabcho + 1);
        }
    };

    const scrollToRow = (index) => {
        const tableNode = tableRef.current;
        const rowNode = tableNode.querySelector(`tr[data-row-index="${index}"]`);

        if (rowNode) {
            rowNode.scrollIntoView({ block: 'nearest' });
        }
    };

    // 3D 각도 선택시
    const handleChange = (e, unitId) => {
        setOptionVal(e);
        setLoading_UnitImg3D(true);
        SelectLearnProblemsResult_ApiCall(unitId, e); // 물품연습 > 3d이미지각조조절 Api 호출
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

    // 대분류 물품 선택
    const btablecho = (Bflag, unitGroupCd) => {
        setBtabcho(Bflag);
        setStabcho(0);
        scrollToRow(0);
        setLoading_Detail(true);
        SelectUnitList_ApiCall(unitGroupCd); // 물품연습 > 그룹물품목록조회 Api 호출
    };

    // 중분류 물품명칭 선택
    const stablecho = (Sflag, unitId) => {
        setStabcho(Sflag);
        setLoading_Unit(true);
        setLoading_UnitImg(true);
        setSelectUnit(unitId);
        SelectUnit_ApiCall(unitId); // 물품연습 > 단품상세조회 Api 호출
    };

    // Preview 이미지 처리
    const PreviewCall = (previewimage) => {
        setImgView(previewimage);
        setVisible(true);
    };

    const ModalClose = () => {
        props.ModalClose();
    };

    useEffect(() => {
        LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp'));
        SelectBaselineUserInfo_ApiCall(); // 교육생 정보 Api 호출
        setLoading_List(true);
        SelectUnitGroupList_ApiCall(); // 물품연습 > 그룹조회목록 Api 호출
    }, []);

    return (
        <>
            <div className="xbt_content">
                {/* <!-- xbt_top --> */}
                <div className="xbt_top">
                    {/* <!-- xbttop02 --> */}
                    <div className="xbttop02">
                        <ul>
                            <li>
                                <h1 className="contit">{languageApplyInfoData.itempratice1}</h1>
                            </li>
                            <li>
                                <h2 className="conname tr">{selectBaselineUserInfoData.userNm}</h2>
                                <button
                                    id="close-first-modal"
                                    data-mact="close"
                                    data-minfo="first-modal"
                                    className="modal_btn conbtn01 conbtn_pd01"
                                    onClick={ModalClose}
                                >
                                    {languageApplyInfoData.itempratice2}
                                </button>
                                <button type="button" className="conbtn01" onClick={() => Prohibitedinfo_Modal()}>
                                    {languageApplyInfoData.itempratice3}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* <!-- xbt_con --> */}
                <div className="xbt_con practice_con mt15">
                    <div className="practice_left">
                        {/* <!-- cop_con --> */}
                        <div className="cop_con conbox_sty conbox_pd01">
                            {/* <!-- 물품 타이틀 표 --> */}
                            <div className="con_table cop_table">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>{languageApplyInfoData.itempratice8}</th>
                                            <th>{languageApplyInfoData.itempratice9}</th>
                                            <th>{languageApplyInfoData.itempratice10}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            {/* <!-- 물품 내용 표 --> */}
                            <div className="con_table cop_table height160 scrollbar">
                                <Spin spinning={loading_List}>
                                    <table className="table">
                                        <tbody>
                                            {selectUnitGroupListData?.map((gd, i) => {
                                                return (
                                                    <tr
                                                        key={i}
                                                        className={btabcho === i ? 'on' : ''}
                                                        onClick={() => btablecho(i, gd.unitGroupCd)}
                                                    >
                                                        <td>{i + 1}</td>
                                                        <td>{gd.groupName}</td>
                                                        <td>{gd.openYn}</td>
                                                        <td>{gd.passYn}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </Spin>
                            </div>
                            {/* <!-- 물품명칭 타이틀 표 --> */}
                            <div className="con_table cop_table">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="t_blue">No.</th>
                                            <th className="t_blue">{languageApplyInfoData.itempratice11}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            {/* <!-- 물품명칭 내용 표 --> */}
                            <div className="con_table cop_table height160 scrollbar">
                                <Spin spinning={loading_Detail}>
                                    <table className="table" ref={tableRef}>
                                        <tbody>
                                            {selectUnitListData?.map((ud, i) => (
                                                <tr
                                                    key={i}
                                                    data-row-index={i}
                                                    className={stabcho === i ? 'on' : ''}
                                                    onClick={() => stablecho(i, ud.unitId)}
                                                >
                                                    <td>{i + 1}</td>
                                                    <td>{ud.unitName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Spin>
                            </div>
                            {/* <!-- //물품명칭 내용 표 --> */}
                        </div>
                        {/* <!-- cop_con --> */}
                        <div className="cop_con conbox_sty conbox_pd01">
                            <Spin spinning={loading_Unit}>
                                <div className="cop_con_tlist">
                                    <div>
                                        <p className="number">{selectUnitData?.unitId}</p>
                                    </div>
                                    <div>
                                        <p className="products">{selectUnitData?.unitGroupName}</p>
                                    </div>
                                    <div>
                                        <p className="release">{selectUnitData?.actionDivName}</p>
                                    </div>
                                    <div>
                                        <p className="name">{selectUnitData?.unitName}</p>
                                    </div>
                                </div>
                                <div className="cop_con_btn">
                                    <button
                                        className={currentIndex > 0 ? 'back on' : ''}
                                        onClick={goToPrevious}
                                        disabled={currentIndex === 0}
                                    >
                                        {languageApplyInfoData.itempratice4}
                                    </button>
                                    <button
                                        className={currentIndex < selectUnitListData.length - 1 ? 'next on' : ''}
                                        onClick={goToNext}
                                        disabled={currentIndex === selectUnitListData.length - 1}
                                    >
                                        {languageApplyInfoData.itempratice5}
                                    </button>
                                </div>
                            </Spin>
                        </div>
                    </div>
                    {/* <!-- practice_right --> */}
                    <div className="practice_right">
                        {/* <!-- 옵션--> */}
                        <div className="practice_select">
                            <Select
                                defaultValue={`${optionVal}˚`}
                                style={{
                                    marginTop: '-3px',
                                    width: '142px'
                                }}
                                bordered={false}
                                onChange={(e) => handleChange(e, selectUnit)}
                                options={[
                                    {
                                        label: '0˚',
                                        value: '0'
                                    },
                                    {
                                        label: '12˚',
                                        value: '12'
                                    },
                                    {
                                        label: '24˚',
                                        value: '24'
                                    },
                                    {
                                        label: '36˚',
                                        value: '36'
                                    },
                                    {
                                        label: '48˚',
                                        value: '48'
                                    },
                                    {
                                        label: '60˚',
                                        value: '60'
                                    },
                                    {
                                        label: '72˚',
                                        value: '72'
                                    },
                                    {
                                        label: '84˚',
                                        value: '84'
                                    },
                                    {
                                        label: '96˚',
                                        value: '96'
                                    },
                                    {
                                        label: '108˚',
                                        value: '108'
                                    },
                                    {
                                        label: '120˚',
                                        value: '120'
                                    },
                                    {
                                        label: '132˚',
                                        value: '132'
                                    },
                                    {
                                        label: '144˚',
                                        value: '144'
                                    },
                                    {
                                        label: '156˚',
                                        value: '156'
                                    },
                                    {
                                        label: '168˚',
                                        value: '168'
                                    },
                                    {
                                        label: '180˚',
                                        value: '180'
                                    },
                                    {
                                        label: '192˚',
                                        value: '192'
                                    },
                                    {
                                        label: '204˚',
                                        value: '204'
                                    },
                                    {
                                        label: '216˚',
                                        value: '216'
                                    },
                                    {
                                        label: '228˚',
                                        value: '228'
                                    },
                                    {
                                        label: '240˚',
                                        value: '240'
                                    },
                                    {
                                        label: '252˚',
                                        value: '252'
                                    },
                                    {
                                        label: '264˚',
                                        value: '264'
                                    },
                                    {
                                        label: '276˚',
                                        value: '276'
                                    },
                                    {
                                        label: '288˚',
                                        value: '288'
                                    },
                                    {
                                        label: '300˚',
                                        value: '300'
                                    },
                                    {
                                        label: '312˚',
                                        value: '312'
                                    },
                                    {
                                        label: '324˚',
                                        value: '324'
                                    },
                                    {
                                        label: '336˚',
                                        value: '336'
                                    },
                                    {
                                        label: '348˚',
                                        value: '348'
                                    }
                                ]}
                            />
                        </div>
                        {/* <!-- //옵션 --> */}

                        <div className="angle">
                            <div className="real">
                                <p>Real</p>
                                {/* <Spin spinning={loading_UnitImg}> */}
                                {unitRealImg === '' || unitRealImg === null || unitRealImg === undefined ? (
                                    <Empty
                                        image={empty}
                                        imageStyle={{
                                            height: 160
                                        }}
                                        description={<span></span>}
                                    ></Empty>
                                ) : (
                                    <>
                                        <button onClick={() => PreviewCall(unitRealImg)}>
                                            <img
                                                src={'data:image/png;base64,' + unitRealImg}
                                                alt=""
                                                style={{ width: '366px', height: '279px' }}
                                            />
                                        </button>
                                    </>
                                )}

                                {/* </Spin> */}
                            </div>

                            <div className="dimension">
                                <p>3D</p>
                                {/* <Spin spinning={loading_UnitImg3D}> */}

                                {unitThreedImg === '' || unitThreedImg === null || unitThreedImg === undefined ? (
                                    <Empty
                                        image={empty}
                                        imageStyle={{
                                            height: 160
                                        }}
                                        description={<span>준비중...</span>}
                                    ></Empty>
                                ) : (
                                    <>
                                        <button onClick={() => PreviewCall(unitThreedImg)}>
                                            <img
                                                src={'data:image/png;base64,' + unitThreedImg}
                                                alt=""
                                                style={{ width: '366px', height: '279px' }}
                                            />
                                        </button>
                                    </>
                                )}
                                {/* </Spin> */}
                            </div>
                            <div className="front">
                                <p>Color</p>

                                {unitFrontImg === '' || unitFrontImg === null || unitFrontImg === undefined ? (
                                    <Empty
                                        image={empty}
                                        imageStyle={{
                                            height: 160
                                        }}
                                        description={<span></span>}
                                    ></Empty>
                                ) : (
                                    <>
                                        <button onClick={() => PreviewCall(unitFrontImg)}>
                                            <img
                                                src={'data:image/png;base64,' + unitFrontImg}
                                                alt=""
                                                style={{
                                                    width: '366px',
                                                    height: '279px',
                                                    transform: `scaleX(${flip ? -1 : 1}) scale(${scale})`
                                                }}
                                            />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="side">
                                <p>Gray</p>

                                {unitSideImg === '' || unitSideImg === null || unitSideImg === undefined ? (
                                    <Empty
                                        image={empty}
                                        imageStyle={{
                                            height: 160
                                        }}
                                        description={<span></span>}
                                    ></Empty>
                                ) : (
                                    <>
                                        <button onClick={() => PreviewCall(unitSideImg)}>
                                            <img
                                                src={'data:image/png;base64,' + unitSideImg}
                                                alt=""
                                                style={{ width: '366px', height: '279px' }}
                                            />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {imgView !== null ? (
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
                        ) : (
                            ''
                        )}
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
