/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Tag, Badge } from 'antd';
import { Typography } from '@mui/material';
import 'antd/dist/antd.css';

//교육정보 통계api
import { useSelectStatisticsListMutation } from '../../hooks/api/MainManagement/MainManagement';

// 다국어 언어
import { useSelectLanguageApplyInfoMutation } from '../../hooks/api/LanguageManagement/LanguageManagement';

export const Score02 = () => {
    // 다국어 언어 api 정보
    const [SelectLanguageApplyInfoApi] = useSelectLanguageApplyInfoMutation();
    const [languageApplyInfoData, setLanguageApplyInfoData] = useState([]);

    // 다국어 Api Call
    const LanguageApplyInfo_ApiCall = async (languageKey) => {
        const SelectLanguageApplyInfoResponse = await SelectLanguageApplyInfoApi({
            groupId: 'edu', //화면아이디
            languageCode: languageKey
        });
        setLanguageApplyInfoData(SelectLanguageApplyInfoResponse?.data?.RET_DATA);
    };

    // 교육정보조회 api 정보
    const [EducationalevalApi] = useSelectStatisticsListMutation();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [count, setCount] = useState(dataSource.length);

    const Educationaleval_ApiCall = async () => {
        const EducationalevalResponse = await EducationalevalApi({
            type: '2',
            languageCode: localStorage.getItem('LangTp')
        });
        //console.log(EducationalevalResponse?.data?.RET_DATA?.eduEvaluationList);
        setDataSource([
            ...EducationalevalResponse?.data?.RET_DATA?.eduEvaluationList.map((d, i) => ({
                key: i,
                rowdata0: i + 1 /* No */,
                rowdata1: d.procYear /* 교육년도 */,
                rowdata2: d.procSeq /* 차수 */,
                rowdata3: d.trySeq /* 학습 차수 */,
                rowdata4: d.passScore /* 과락 점수 */,
                rowdata5: d.gainScore /* 취득 점수 */,
                rowdata6: d.passYn /* 결과 */,
                rowdata7: d.testDate /* 학습일자 */
            }))
        ]);
        setLoading(false);
    };

    const defaultColumns = [
        {
            width: '70px',
            title: 'No.',
            dataIndex: 'rowdata0',
            align: 'center'
        },
        {
            title: languageApplyInfoData.edu5,
            dataIndex: 'rowdata1',
            align: 'center'
        },
        {
            title: languageApplyInfoData.edu6,
            dataIndex: 'rowdata2',
            align: 'center'
        },
        {
            title: languageApplyInfoData.edu7,
            dataIndex: 'rowdata3',
            align: 'center'
        },
        {
            title: languageApplyInfoData.edu8,
            dataIndex: 'rowdata4',
            align: 'center',
            render: (_, { rowdata4 }) => (
                <>
                    <Badge count={rowdata4} color="#faad14" overflowCount={9999} />
                </>
            )
        },
        {
            title: languageApplyInfoData.edu9,
            dataIndex: 'rowdata5',
            align: 'center',
            render: (_, { rowdata5 }) => (
                <>
                    <Badge count={rowdata5} color="#87d068" overflowCount={9999} />
                </>
            )
        },
        {
            width: '80px',
            title: languageApplyInfoData.edu10,
            dataIndex: 'rowdata6',
            align: 'center',
            render: (_, { rowdata6 }) =>
                rowdata6 === 'Pass' ? (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }} color="#87d068">
                        {rowdata6}
                    </Tag>
                ) : (
                    <Tag style={{ width: '60px', borderRadius: '5px', padding: '0 10px' }}> {rowdata6}</Tag>
                )
        },
        {
            title: languageApplyInfoData.edu11,
            dataIndex: 'rowdata7',
            align: 'center'
        }
    ];

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            })
        };
    });

    useEffect(() => {
        LanguageApplyInfo_ApiCall(localStorage.getItem('LangTp'));
        setLoading(true);
        Educationaleval_ApiCall();
    }, []);

    return (
        <>
            <Typography variant="body1">
                <Table bordered={true} dataSource={dataSource} loading={loading} columns={columns} />
            </Typography>
        </>
    );
};
