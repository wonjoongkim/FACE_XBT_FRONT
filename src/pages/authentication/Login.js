/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Typography } from '@mui/material';

import { Row, Col, Space, Dropdown, Form, Input, DatePicker, Modal, Tabs, Button, Card } from 'antd';

import locale from 'antd/es/date-picker/locale/ko_KR';
const { RangePicker } = DatePicker;

import koricon from '../../images/login/kor_icon.svg';
import engicon from '../../images/login/eng_icon.svg';
import jpicon from '../../images/login/jp_icon.svg';
import cnicon from '../../images/login/cn_icon.svg';
import success from '../../images/login/success.svg';
import fail from '../../images/login/fail.svg';
import kssa_logo from '../../images/kssa_logo.png';
import kcs_logo from '../../images/main/kcs_1.png';

import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';
import { useUserToken } from '../../hooks/core/UserToken';
import { useUserStatus } from '../../hooks/core/UserStatus';
import { useLoginMutation, useSelectUserIdMutation, useUpdateUserPwdMutation } from '../../hooks/api/LoginManagement/LoginManagement';

import { MyComponent } from './MyComponent';
import { Search } from './Search';

import PDFViewer from './PDFViewer';

import { Document, Page, pdfjs } from 'react-pdf';
import pdfFile from './xbtmanual.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// import Register from './Register';

// ================================|| LOGIN ||================================ //

const Login = () => {
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const isLoggedIn = useUserStatus();
    const [isModalOpen, setIsModalOpen] = useState(false); // 로그인창 Modal창
    const [joinModalOpen, setJoinModalOpen] = useState(false); // 회원가입창 Modal창
    const [searchModalOpen, setSearchModalOpen] = useState(false); // 아이디 찾기 | 비번 변경 Modal창
    const [manualModalOpen, setManualModalOpen] = useState(false); // 메뉴얼 Modal창

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const [IdModalOpen, setIdModalOpen] = useState(false); // 아이디 확인 Modal창
    const [PwModalOpen, setPwModalOpen] = useState(false); // 비밀번호 확인 Modal창

    const [search_IdValue, setSearch_IdValue] = useState(null); // 아이디 확인 값
    const [IdModalMessage, setIdModalMessage] = useState(''); // 아이디 Modal창 메시지
    const [PwModalMessage, setPwModalMessage] = useState(''); // 비밀번호 Modal창 메시지

    const [loading, setLoading] = useState(false);
    const [stuId, setStuId] = useState();
    const [stuPw, setStuPw] = useState();

    const [languageLabel, setLanguageLabel] = useState('Korea');
    const [languageKey, setLanguageKey] = useState();

    // 로그인 토큰 정보
    const [userToken] = useUserToken();

    // 로그인 api 정보
    const [login] = useLoginMutation();

    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'login', //화면아이디
            languageCode: languageKey
        });
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // 아이디 찾기 Api Call
    const [SelectUserIdApi] = useSelectUserIdMutation();
    const SelectUserId_ApiCall = async (ValueData) => {
        const SelectUserIdResponse = await SelectUserIdApi({
            userNm: ValueData.userNm,
            hpNo: ValueData.hpNo
        });
        if (SelectUserIdResponse?.data?.RET_CODE === '0000') {
            setIdModalMessage('입력하신 정보와 일치하는 아이디 입니다.');
            setIdModalOpen(true);
            setSearch_IdValue(SelectUserIdResponse?.data?.RET_DATA.userId);
        } else {
            setIdModalMessage('일치하는 정보가 없습니다.');
            setIdModalOpen(true);
        }
    };

    // 비밀번호 변경 Api Call
    const [UpdateUserPwdApi] = useUpdateUserPwdMutation();
    const UpdateUserPwd_ApiCall = async (ValueData) => {
        const UpdateUserPwdResponse = await UpdateUserPwdApi({
            userNm: ValueData.userNm,
            hpNo: ValueData.hpNo,
            userId: ValueData.userId,
            userPw: ValueData.userPw
        });
        if (UpdateUserPwdResponse?.data?.RET_CODE == '0200') {
            setPwModalMessage('입력하신 비밀번호로 변경되었습니다.');
            setPwModalOpen(true);
        } else {
            setPwModalMessage('입력하신 정보가 맞지 않습니다. 다시 확인 바랍니다.');
            setPwModalOpen(false);
        }
    };

    // 언어 셀렉트박스 옵션 정의 Start
    const items = [
        {
            label: 'Korea',
            key: 'kr',
            icon: <img src={koricon} alt="Korean flag" />
        },
        {
            label: 'English',
            key: 'en',
            icon: <img src={engicon} alt="English flag" />
        }
        // {
        //     label: '日本語',
        //     key: 'ja',
        //     icon: <img src={jpicon} alt="Japan flag" />
        // },
        // {
        //     label: '汉语',
        //     key: 'zh',
        //     icon: <img src={cnicon} alt="China flag" />
        // }
    ];
    // 언어 셀렉트박스 옵션 정의 End

    // 언어 선택시 정의 Start
    const handleMenuClick = (e) => {
        if (e.key === 'kr') {
            setLanguageLabel('Korea');
        } else if (e.key === 'en') {
            setLanguageLabel('English');
            // } else if (e.key === 'ja') {
            //     setLanguageLabel('日本語');
            // } else if (e.key === 'zh') {
            //     setLanguageLabel('汉语');
        }
        localStorage.setItem('LangTp', e.key.toLowerCase());
        setLanguageKey(e.key);
        LanguageApplyInfo_ApiCall(e.key.toLowerCase());
    };
    // 언어 선택시 정의 End

    // 언어 셀렉트 박스 마우스 오버시 Start
    const menuProps = {
        items,
        onClick: handleMenuClick
    };
    // 언어 셀렉트 박스 마우스 오버시 End

    // 로그인 창 Modal
    const LoginForm_Show = () => {
        setIsModalOpen(true);
        setLoading(true);
    };

    // 회원가입 창 Modal
    const JoinForm_Show = async () => {
        const url = 'http://192.168.1.3:8082/Register';
        const width = 800;
        const height = 900;

        const options = `
      width=${width},
      height=${height},
      top=${(window.innerHeight - height) / 2},
      left=${(window.innerWidth - width) / 2},
      scrollbars=yes
    `;
        window.open(url, '_blank', options.replace(/\s/g, ''));
    };

    // 아이디 찾기, 비번 변경
    const Search_Show = () => {
        setSearchModalOpen(true);
    };

    // 메뉴얼 pdf
    const Manual_Show = () => {
        setManualModalOpen(true);
    };

    // 로그인 성공 modal
    const success_info = () => {
        navigate('/frontmain');
        /*
        Modal.success({
            content: (
                <div style={{ textAlign: 'center', width: '330px', padding: '0px 0 10px' }}>
                    <div style={{ marginBottom: '2rem', height: '78px' }}>
                        <img src={success} alt={languageApplyInfoData.login4} />
                    </div>
                    <p style={{ marginBottom: '1rem', width: '360px', fontSize: '2rem', color: '#666666' }}>
                        <b>{languageApplyInfoData.login4}</b>
                    </p>
                </div>
            ),
            okText: languageApplyInfoData.login6,
            onOk() {
                navigate('/frontmain');
            }
        });
        */
    };

    // 로그인 실패 modal
    const failure_info = () => {
        Modal.error({
            content: (
                <div style={{ textAlign: 'center', width: '330px', padding: '0px 0 10px' }}>
                    <div style={{ marginBottom: '2rem', height: '78px' }}>
                        <img src={fail} alt={languageApplyInfoData.login5} />
                    </div>
                    <p style={{ marginBottom: '1rem', width: '360px', fontSize: '2rem', color: '#666666' }}>
                        <b>{languageApplyInfoData.login5}</b>
                    </p>
                </div>
            ),
            okText: languageApplyInfoData.login6,
            onOk() {}
        });
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const joinhandleOk = () => {
        setJoinModalOpen(false);
    };

    const joinhandleCancel = () => {
        setJoinModalOpen(false);
    };

    // 아이디 찾기, 비밀번호 변경 Start
    const searchhandleOk = () => {
        setSearchModalOpen(false);
        form.resetFields();
    };

    const searchhandleCancel = () => {
        setSearchModalOpen(false);
        form.resetFields();
    };
    // 아이디 찾기, 비밀번호 변경 End

    const manualhandleOk = () => {
        setManualModalOpen(false);
    };

    const manualhandleCancel = () => {
        setManualModalOpen(false);
    };

    // 아이디 확인 창
    const IdhandleOk = () => {
        setIdModalOpen(false);
        setSearch_IdValue(null);
    };

    const IdhandleCancel = () => {
        setIdModalOpen(false);
        setSearch_IdValue(null);
    };

    // 비밀번호 확인 창
    const PwhandleOk = () => {
        setPwModalOpen(false);
    };

    const PwhandleCancel = () => {
        setPwModalOpen(false);
    };

    // Enter시 handleSubmit 호출
    const handleChangeSubmit = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    // 아이디 입력
    // const handleChangeId = (e) => {
    //     const value = e.target.value;
    //     setStuId(value);
    // };
    const formatPhoneNumber = (input) => {
        const cleanedInput = input.replace(/\D/g, '');
        return cleanedInput;
    };

    const handleChangeId = (fieldName, inputValue) => {
        const formattedNumber = formatPhoneNumber(inputValue);
        // console.log(formattedNumber);
        setStuId(formattedNumber);
    };

    // 비밀번호 입력
    const handleChangePw = (e) => {
        const value = e.target.value;
        setStuPw(value);
    };

    // 로그인 처리
    const handleLogin = async () => {
        if (stuId === undefined) {
            Modal.warning({
                title: 'Warning',
                content: '아이디를 입력해주세요.'
            });
        } else if (stuPw === undefined) {
            Modal.warning({
                title: 'Warning',
                content: '비밀번호를 입력해주세요.'
            });
        }

        if (stuPw.length < 4) {
            Modal.warning({
                title: 'Warning',
                content: '비밀번호는 4자 이상이어야 합니다.'
            });
        } else {
            const userLoginResponse = await login({
                loginId: stuId,
                loginPw: stuPw
            });
            if (userLoginResponse.data.RET_CODE === '0000') {
                const jwtToken = userLoginResponse.data.RET_DATA.accessToken;
                userToken.setItem(jwtToken);
                localStorage.setItem('LangTp', languageKey);
                success_info();
            } else {
                failure_info();
            }
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    useEffect(() => {
        // console.log(localStorage.getItem('LangTp'));
        // 접속한 브라우져의 언어별 체크
        if (localStorage.getItem('LangTp') === 'undefined' || localStorage.getItem('LangTp') === null) {
            const userCountryCode = navigator.language || navigator.userLanguage;
            if (userCountryCode.length > 2) {
                // Google 버젼
                setLanguageKey(userCountryCode.split('-')[1].toLowerCase());
                localStorage.setItem('LangTp', userCountryCode.split('-')[1].toLowerCase());
                LanguageApplyInfo_ApiCall(userCountryCode.split('-')[1].toLowerCase()); // 다국어 Api 호출
            } else {
                // Edg 버젼
                setLanguageKey(userCountryCode);
                localStorage.setItem('LangTp', userCountryCode);
                LanguageApplyInfo_ApiCall(userCountryCode); // 다국어 Api 호출
            }
        } else {
            setLanguageKey(localStorage.getItem('LangTp'));
            LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp')); // 다국어 Api 호출
        }

        // 로그인이 되어 있으면 처리
        if (isLoggedIn === true) {
            // navigate('/frontmain');
        }
    }, []);

    // 아이디 찾기
    const SearchId = (values) => {
        //console.log('아이디 찾기', values);
        SelectUserId_ApiCall(values);
    };

    // 비밀번호 변경
    const ChangePw = (values) => {
        //console.log('비밀번호 변경', values);
        UpdateUserPwd_ApiCall(values);
    };

    return (
        <>
            {/* wrap */}
            <div id="wrap" className="mbg">
                {/* wlayer */}
                <div id="wlayer" className="login_layer">
                    {/* mcontent */}
                    <div className="mcontent">
                        {/* login_con */}
                        <div className="login_con">
                            {/* <Row justify="center" align="middle" style={{ height: '15vh' }}>
                                <Col>
                                    <img src={kssa_logo} alt="Logo" />
                                </Col>
                            </Row> */}
                            <Typography variant="h2" style={{ marginLeft: '60px', marginBottom: '20px' }}>
                                <img src={kssa_logo} alt="한국보안인재개발원" style={{ width: '60%' }} />
                            </Typography>
                            <Typography variant="h3">{languageApplyInfoData?.login1}</Typography>
                            <Typography variant="h1">
                                X-ray Security
                                <br />
                                Training
                                <br />
                                <span>trainee</span>
                            </Typography>
                            {/* 인재개발원 버전시 주석풀기
                             <p style={{ width: '65%' }}>{languageApplyInfoData.login2}</p> 
                             */}
                            <div>
                                <Space>
                                    <button id="login" className="login_btn modal_btn" onClick={() => LoginForm_Show()}>
                                        {languageApplyInfoData?.login3 ? languageApplyInfoData?.login3 : '로그인'}
                                    </button>
                                    <button id="join" className="login_btn modal_btn" onClick={() => JoinForm_Show()}>
                                        회원가입
                                    </button>
                                </Space>
                            </div>
                            {/* <div style={{ marginTop: '20px' }}>
                                <Space>
                                    <button
                                        className="manual_btn modal_btn"
                                        style={{ fontSize: '15px', padding: '1.2rem 5rem' }}
                                        onClick={() => Search_Show()}
                                    >
                                        ※ 아이디 찾기 | 비밀번호 변경
                                    </button>
                                </Space>
                            </div> */}
                            <div>
                                <button
                                    className="manual_btn modal_btn"
                                    style={{ fontSize: '15px', padding: '1.8rem 11.3rem' }}
                                    onClick={() => Manual_Show()}
                                >
                                    Manual
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 로그인 폼 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={520}
                style={{
                    zIndex: 999
                }}
                footer={[]}
            >
                <Form noValidate layout="vertical" name="Login_Form" form={form} style={{ marginTop: 30 }}>
                    <Row gutter={24}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div>
                                <Typography variant="h3" style={{ marginBottom: '1rem', fontSize: '2rem', color: '#666666' }}>
                                    {languageApplyInfoData?.login1}
                                </Typography>
                                <Typography
                                    variant="h1"
                                    style={{
                                        fontFamily: 'Outfit',
                                        fontSize: '3.6rem',
                                        fontWeight: '600',
                                        lineHeight: '1.2',
                                        color: '#155eb6'
                                    }}
                                >
                                    X-ray Security Training
                                    <span style={{ display: 'block', fontWeight: '200', color: '#0e276c' }}>trainee</span>
                                </Typography>
                                {/* 언어선택 */}
                                <div className="lan_select">
                                    <Space direction="vertical">
                                        <Dropdown placement="bottomRight" menu={menuProps} style={{ border: '0px' }}>
                                            <button
                                                className={`label ${languageKey}`}
                                                style={{
                                                    width: '180px',
                                                    backgroundColor: '#0e276c',
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '2px 50px',
                                                    color: '#fff'
                                                }}
                                            >
                                                {items.find((item) => item.key === languageKey)?.icon}
                                                <span style={{ marginTop: '-5px', width: '100%' }}>{languageLabel}</span>
                                            </button>
                                        </Dropdown>
                                    </Space>
                                </div>

                                {/* 언어선택 */}
                                {/* login_box */}
                                <div className="login_box">
                                    <div className="form-group id">
                                        <Input
                                            type="text"
                                            name="stu_id"
                                            className="form-input border-animation set-1"
                                            placeholder="ID"
                                            maxLength="16"
                                            // onChange={(e) => handleChangeId(e)}
                                            onChange={(e) => handleChangeId('stu_id', e.target.value)}
                                            value={stuId}
                                        />
                                    </div>

                                    <div className="form-group pw">
                                        <Input
                                            type="password"
                                            name="stu_pw"
                                            className="form-input border-animation set-1"
                                            placeholder="PASSWORD"
                                            maxLength="32"
                                            onKeyPress={handleChangeSubmit}
                                            onChange={(e) => handleChangePw(e)}
                                        />
                                    </div>
                                </div>
                                <button
                                    id="open-second-modal"
                                    data-mact="open"
                                    data-minfo="second-modal"
                                    className="modal_btn blue_btn wide_btn"
                                    onClick={handleLogin}
                                >
                                    {languageApplyInfoData?.login3}
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            {/* 로그인 폼 모달 창 End */}

            {/* 회원가입 폼 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={joinModalOpen}
                onOk={joinhandleOk}
                onCancel={joinhandleCancel}
                width={950}
                style={{
                    top: 10,
                    zIndex: 999
                }}
                footer={[]}
            ></Modal>
            {/* 회원가입 창 End */}

            {/* 아이디 찾기 | 비번 변경 폼 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={searchModalOpen}
                onOk={searchhandleOk}
                onCancel={searchhandleCancel}
                width={750}
                style={{
                    top: 200,
                    zIndex: 999
                }}
                footer={[]}
            >
                <Tabs
                    defaultActiveKey="1"
                    centered
                    items={[
                        {
                            label: (
                                <Button style={{ border: '0px' }} onClick={() => form.resetFields()}>
                                    <span style={{ fontWeight: '700', margin: '0 25px', fontSize: '1.7rem' }}>아이디 찾기</span>
                                </Button>
                            ),
                            key: 'id',
                            children: <Search form={form} formid="1" IdSearch={SearchId} />
                        },
                        {
                            label: (
                                <Button style={{ border: '0px' }} onClick={() => form.resetFields()}>
                                    <span style={{ fontWeight: '700', margin: '0 25px', fontSize: '1.7rem' }}>비밀번호 변경</span>
                                </Button>
                            ),
                            key: 'pw',
                            children: <Search form={form} formid="2" PwChange={ChangePw} />
                        }
                    ]}
                />
            </Modal>
            {/* 아이디 찾기 | 비번 변경 폼 모달 창 End */}

            {/* 메뉴얼 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={manualModalOpen}
                onOk={manualhandleOk}
                onCancel={manualhandleCancel}
                width="100%"
                style={{
                    top: 10,
                    zIndex: 999
                }}
                footer={[]}
            >
                {/* <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document>
                <p>
                    Page {pageNumber} of {numPages}
                </p> */}
                <PDFViewer />
            </Modal>
            {/* 메뉴얼 모달 창 End */}

            {/* 아이디 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={IdModalOpen}
                onOk={IdhandleOk}
                onCancel={IdhandleCancel}
                width="435px"
                style={{
                    top: 10,
                    zIndex: 999
                }}
                footer={null}
            >
                <div style={{ textAlign: 'center', width: '390px', padding: '0px 0 10px' }}>
                    <div style={{ marginTop: '4rem', height: '50px', fontSize: '1.8rem', fontFamily: 'SUIT', fontWeight: '600' }}>
                        {IdModalMessage}
                    </div>
                    {search_IdValue === null ? (
                        ''
                    ) : (
                        <Card style={{ fontSize: '4rem' }}>
                            <b>{search_IdValue}</b>
                        </Card>
                    )}
                </div>
            </Modal>
            {/* 아이디 모달 창 End */}

            {/* 비밀번호 모달 창 Start */}
            <Modal
                maskClosable={false}
                open={PwModalOpen}
                onOk={PwhandleOk}
                onCancel={PwhandleCancel}
                width="500px"
                style={{
                    top: 10,
                    zIndex: 999
                }}
                footer={null}
            >
                <div style={{ textAlign: 'center', width: '450px', padding: '0px 0 10px' }}>
                    <div style={{ marginTop: '4rem', height: '50px', fontSize: '1.8rem', fontFamily: 'SUIT', fontWeight: '600' }}>
                        {PwModalMessage}
                    </div>
                </div>
            </Modal>
            {/* 비밀번호 모달 창 End */}
        </>
    );
};

export default Login;
