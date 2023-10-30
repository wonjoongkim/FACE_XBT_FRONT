/* eslint-disable*/
import PropTypes from 'prop-types';
import React, { useState, useEffect, Component } from 'react';
// import { Link as RouterLink } from 'react-router-dom';

import 'antd/dist/antd.css';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Badge } from 'antd';

// project import
import Dot from 'components/@extended/Dot';
//교육정보 통계api
import { useSelectStatisticsListMutation } from '../../hooks/api/MainManagement/MainManagement';
import './eduinfo.css';

// ==============================|| ORDER TABLE ||============================== //

export const Score02 = () => {
    function createData(no, procYear, procSeq, trySeq, passScore, gainScore, passYn, testDate) {
        return { no, procYear, procSeq, trySeq, passScore, gainScore, passYn, testDate };
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    // ==============================|| ORDER TABLE - HEADER CELL ||============================== //

    const headCells = [
        {
            id: 'no',
            align: 'center',
            disablePadding: false,
            label: 'No'
        },
        {
            id: 'procYear',
            align: 'center',
            disablePadding: false,
            label: '교육 년도'
            //label: 'Training procYear'
        },
        {
            id: 'procSeq',
            align: 'center',
            disablePadding: true,
            label: '차수'
            //label: 'Batch'
        },
        {
            id: 'trySeq',
            align: 'center',
            disablePadding: false,
            label: '학습 차수'
            //label: 'Training course'
            // },
            // {
            //     id: 'aper',
            //     align: 'center',
            //     disablePadding: false,
            //     label: '정답률'
        },
        {
            id: 'passScore',
            align: 'center',
            disablePadding: false,
            label: '과락 점수'
            //label: 'Pass score'
        },
        {
            id: 'gainScore',
            align: 'center',
            disablePadding: false,
            label: '취득 점수'
            //label: 'Gain score'
        },
        {
            id: 'passYn',
            align: 'center',
            disablePadding: false,
            label: '결과'
            //label: 'Results'
        },
        {
            id: 'testDate',
            align: 'center',
            disablePadding: false,
            label: '학습 일지'
            //label: 'Learning testDate'
        }
    ];

    // ==============================|| ORDER TABLE - HEADER ||============================== //

    function OrderTableHead({ order, orderBy }) {
        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            style={{ fontSize: '14px', background: 'rgb(221 219 219)' }}
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            {headCell.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    OrderTableHead.propTypes = {
        order: PropTypes.string,
        orderBy: PropTypes.string
    };

    // ==============================|| ORDER TABLE - STATUS ||============================== //

    const OrderStatus = ({ status }) => {
        let color;
        let title;

        switch (status) {
            case 0:
                color = 'warning';
                title = 'Pending';
                break;
            case 1:
                color = 'success';
                title = 'Approved';
                break;
            case 2:
                color = 'error';
                title = 'Rejected';
                break;
            default:
                color = 'primary';
                title = 'None';
        }

        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Dot color={color} />
                <Typography>{title}</Typography>
            </Stack>
        );
    };

    OrderStatus.propTypes = {
        status: PropTypes.number
    };

    const [order] = useState('asc');
    const [orderBy] = useState('userName');
    const [selected] = useState([]);

    const isSelected = (userName) => selected.indexOf(userName) !== -1;

    //교육정보 통계api
    const [statisticsList] = useSelectStatisticsListMutation();
    const [type, setType] = useState('2');
    const [eduEvaluationList, setEduEvaluationList] = useState([]);
    const [rows, setRows] = useState([]);

    const statisticsListApiCall = async () => {
        const stResponse = await statisticsList({
            type: type,
            languageCode: localStorage.getItem('LangTp')
        });
        //setChartInfo({ ...chartInfo, options: { ...chartInfo.options, xaxis: { categories: chartCategories ,labels: {show: true,rotate: 0}} , yaxis: {title: {text: '발생건수'}}, tooltip: {y: {formatter: function (val) {return val + "건"}}}} });
        //setEduEvaluationList(stResponse?.data?.RET_DATA.eduEvaluationList);

        console.log(stResponse?.data?.RET_DATA.eduEvaluationList);

        let resultList = [];
        for (var i = 0; i < stResponse?.data?.RET_DATA.eduEvaluationList.length; i++) {
            let rData = stResponse?.data?.RET_DATA.eduEvaluationList[i];
            resultList.push(
                createData(
                    i + 1,
                    rData.procYear,
                    rData.procSeq,
                    rData.studyLvl,
                    rData.passScore,
                    rData.gainScore,
                    rData.passYn,
                    rData.testDate
                )
            );
        }
        setRows(resultList);
    };

    const rows1 = [createData(1, '2021', <span>Batch 1</span>, 1, 60, 16, <span>Fail</span>, <span>2021-03-10</span>)];

    useEffect(() => {
        statisticsListApiCall();
    }, [type]);

    return (
        <>
            <Box>
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-of-type': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-of-type': {
                                pr: 3
                            }
                        }}
                    >
                        <OrderTableHead order={order} orderBy={orderBy} />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row.no);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.no}
                                        selected={isItemSelected}
                                    >
                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            {row.no}
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            {row.procYear}
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            {row.procSeq}
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            {row.trySeq}
                                        </TableCell>

                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            <Badge count={row.passScore} color="#faad14" overflowCount={9999} />
                                            {/* {row.totalcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
                                        </TableCell>
                                        {/* <TableCell align="center">{row.aper}%</TableCell> */}
                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            <Badge count={row.gainScore} color="#52c41a" overflowCount={9999} />
                                            {/* {row.bcnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            {row.gainScore > 60 ? (
                                                <font color="#52c41a">{row.passYn}</font>
                                            ) : (
                                                <font color="#faad14">{row.passYn}</font>
                                            )}
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '12%', fontSize: '14px' }}>
                                            {row.testDate}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};
