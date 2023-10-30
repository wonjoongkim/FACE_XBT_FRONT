/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Row, Col, Space, Tabs, Button, Divider, Form, Input, Card, Radio, Modal, Checkbox } from 'antd';

export const Search = (props) => {
    // const [form] = Form.useForm();
    const [mode, setMode] = useState(props.formid);
    const [searchContainer, setSearchContainer] = useState({}); // 항목 컨테이너
    const [changaeContainer, setChangaeContainer] = useState({}); // 항목 컨테이너

    const onFinish = (values) => {
        //console.log('Success:', values);
        setSearchContainer(null);
        setChangaeContainer(null);
        props.form.resetFields();
    };
    const onFinishFailed = (errorInfo) => {
        //console.log('Failed:', errorInfo);
        setSearchContainer(null);
        setChangaeContainer(null);
        props.form.resetFields();
    };

    const SearchId = () => {
        // console.log(searchContainer);
        props.IdSearch(searchContainer);
        setSearchContainer(null);
    };

    const Changepw = () => {
        // console.log(changaeContainer);
        props.PwChange(changaeContainer);
        setChangaeContainer(null);
    };

    useEffect(() => {
        props.form.resetFields();
        setSearchContainer(null);
    }, []);

    return (
        <>
            {mode === '1' ? (
                <Card>
                    <Form
                        form={props.form}
                        name="idsearch"
                        labelCol={{
                            span: 8
                        }}
                        wrapperCol={{
                            span: 16
                        }}
                        style={{
                            maxWidth: 600
                        }}
                        initialValues={{
                            remember: true
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="이름"
                            name="userNm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!'
                                }
                            ]}
                        >
                            <Input
                                style={{ border: '1px solid #cbc7c7' }}
                                onChange={(e) => setSearchContainer({ ...searchContainer, userNm: e.target.value })}
                                value={searchContainer?.userNm}
                                autoComplete="off"
                            />
                        </Form.Item>

                        <Form.Item
                            label="휴대폰 번호"
                            name="hpNo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Usermobile!'
                                }
                            ]}
                        >
                            <Input
                                type="mobile"
                                style={{ border: '1px solid #cbc7c7' }}
                                onChange={(e) => setSearchContainer({ ...searchContainer, hpNo: e.target.value })}
                                value={searchContainer?.hpNo}
                                autoComplete="off"
                            />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16
                            }}
                        >
                            <Button type="primary" htmlType="Search" onClick={SearchId}>
                                아이디 찾기
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            ) : (
                <Card>
                    <Form
                        form={props.form}
                        name="pwchange"
                        labelCol={{
                            span: 8
                        }}
                        wrapperCol={{
                            span: 16
                        }}
                        style={{
                            maxWidth: 600
                        }}
                        initialValues={{
                            remember: true
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="이름"
                            name="userNm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!'
                                }
                            ]}
                        >
                            <Input
                                style={{ border: '1px solid #cbc7c7' }}
                                onChange={(e) => setChangaeContainer({ ...changaeContainer, userNm: e.target.value })}
                                value={changaeContainer?.userNm}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item
                            label="아이디"
                            name="userId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your user Id!'
                                }
                            ]}
                        >
                            <Input
                                type="id2"
                                style={{ border: '1px solid #cbc7c7' }}
                                onChange={(e) => setChangaeContainer({ ...changaeContainer, userId: e.target.value })}
                                value={changaeContainer?.userId}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item
                            label="휴대폰 번호"
                            name="hpNo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Usermobile!'
                                }
                            ]}
                        >
                            <Input
                                type="mobile"
                                style={{ border: '1px solid #cbc7c7' }}
                                onChange={(e) => setChangaeContainer({ ...changaeContainer, hpNo: e.target.value })}
                                value={changaeContainer?.hpNo}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item
                            label="변경할 비밀번호"
                            name="Change Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Change Password!'
                                }
                            ]}
                        >
                            <Input.Password
                                type="password"
                                style={{ border: '1px solid #cbc7c7', borderRadius: '10px' }}
                                onChange={(e) => setChangaeContainer({ ...changaeContainer, userPw: e.target.value })}
                                value={changaeContainer?.userPw}
                                autoComplete="off"
                            />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16
                            }}
                        >
                            <Button type="primary" htmlType="submit" onClick={Changepw}>
                                비밀번호 변경
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </>
    );
};
