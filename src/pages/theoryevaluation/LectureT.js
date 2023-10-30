/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Tooltip, Space } from 'antd';

// 조회, 상세, 정답제출
import { useSelectTheoryFileListMutation } from '../../hooks/api/TheoryManagement/TheoryManagement';

import { FilePdfOutlined } from '@ant-design/icons';

export const LectureT = (props) => {
    const [loading, setLoading] = useState(false); // 상단 (가방id) 테이블 로딩
    const [dataSource, setDataSource] = useState([]); // Table 데이터 값
    const [isHovered, setIsHovered] = useState(false);
    // =====================================================================================
    // API 호출 Start
    // =====================================================================================
    const [SelectTheoryFileListApi] = useSelectTheoryFileListMutation();
    const handel_SelectTheoryFileList_ApiCall = async () => {
        const SelectTheoryFileListResponse = await SelectTheoryFileListApi({
            eduCode: '2'
        });
        setDataSource([
            ...SelectTheoryFileListResponse?.data?.RET_DATA.map((d, i) => ({
                key: d.theoryNo,
                Num: i + 1,
                eduCode: d.eduCode,
                theoryNo: d.theoryNo,
                title: d.title,
                files: d.files,
                contents: d.contents,
                useYn: d.useYn,
                insertDate: d.insertDate
            }))
        ]);
        setLoading(false);
    };
    // =====================================================================================
    // API 호출 End
    // =====================================================================================

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // Modal 창 닫기
    const ModalClose = () => {
        props.ModalClose();
    };

    useEffect(() => {
        setLoading(true);
        handel_SelectTheoryFileList_ApiCall();
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
                                <h1 className="contit">{`이론강의 [항공경비요원]`}</h1>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* <!-- xbt_con --> */}
                <div className="xbt_con">
                    {/* <!-- 물품 타이틀 표 --> */}
                    <div className="theoryb_box theoryb_box_pd01">
                        <div className="theory_table">
                            <table className="table">
                                <colgroup>
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '60%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>이론명</th>
                                        <th>파일</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="theory_table height550 scrollbar">
                            <table className="table">
                                <colgroup>
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '25%' }} />
                                    <col style={{ width: '60%' }} />
                                </colgroup>
                                <tbody id="question_list">
                                    {dataSource.map((d, i) => (
                                        <tr className="on" key={i}>
                                            <td>{i + 1}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Tooltip title={d.contents} placement="bottom">
                                                    {d.title}
                                                </Tooltip>
                                            </td>
                                            <td>
                                                {d.files.map((f, k) => (
                                                    <Space style={{ widht: '50px' }}>
                                                        <div
                                                            onMouseEnter={handleMouseEnter}
                                                            onMouseLeave={handleMouseLeave}
                                                            style={{ margin: '0 10px', color: isHovered ? 'red' : 'black' }}
                                                        >
                                                            <Tooltip title={f.originalFileName} key={k} placement="bottom">
                                                                <a
                                                                    href={`${decodeURIComponent(`${f.filePath}/${f.saveFileName}`)}`}
                                                                    target="_blank"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        window.open(
                                                                            `${decodeURIComponent(`${f.filePath}/${f.saveFileName}`)}`,
                                                                            'PDFViewer',
                                                                            `width=${window.innerWidth - 60},height=${
                                                                                window.innerHeight
                                                                            },left=20,top=20`
                                                                        );
                                                                    }}
                                                                >
                                                                    <FilePdfOutlined
                                                                        style={{
                                                                            fontSize: '35px',
                                                                            transition: 'color 0.3s'
                                                                        }}
                                                                    />
                                                                </a>
                                                            </Tooltip>
                                                        </div>
                                                    </Space>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
