/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

// import '../../css/main.css';

// Notice 목록조회 API
import { useSelectNoticeMutation } from '../../hooks/api/NoticeManagement/NoticeManagement';

export const NoticeView = (props) => {
    const [noticeDetailApi, setNoticeDetailApi] = useState();

    // Notice api 정보
    const [NoticeDetailApi] = useSelectNoticeMutation();

    // Notice Api 호출
    const Noticedetail_ApiCall = async () => {
        const noticeResponse = await NoticeDetailApi({
            noticeId: props.NoticeId,
            languageCode: localStorage.getItem('LangTp')
        });
        setNoticeDetailApi(noticeResponse?.data?.RET_DATA);
    };

    const ModalClose = () => {
        props.ModalClose();
    };

    useEffect(() => {
        Noticedetail_ApiCall(); // api 호출
    }, [props.NoticeId]);

    return (
        <>
            {/* <div className="xbt_content"> */}
            <div className="xbt_top">
                <div className="mdnc_top">
                    <h1>Notice</h1>
                </div>
            </div>
            <div className="con_table noticerw_sr scrollbar height360">
                <div className="noticerw_top">
                    <h1>{noticeDetailApi?.title}</h1>
                    <span>{noticeDetailApi?.insertDate}</span>
                </div>
                <div className="noticerw_con">
                    <p>{noticeDetailApi?.contents}</p>
                </div>
            </div>
            {/* </div> */}
            <button
                id="close-two-md"
                data-mact="close"
                data-minfo="two-md"
                className="modal_btn close_btn"
                style={{ marginTop: '20px', marginRight: '20px' }}
                onClick={ModalClose}
            ></button>
        </>
    );
};
