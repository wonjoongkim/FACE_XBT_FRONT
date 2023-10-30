/* eslint-disable */
// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// third-party
import ReactApexChart from 'react-apexcharts';

//교육정보 통계api
import { useSelectStatisticsListMutation } from '../../hooks/api/MainManagement/MainManagement';

import './eduinfo.css';

// ==============================|| INCOME AREA CHART ||============================== //
export const Score03 = () => {
    //교육정보 통계api
    const [statisticsList] = useSelectStatisticsListMutation();
    const [categories, setCategories] = useState([]); // 타이틀
    const [totalCnt, setTotalCnt] = useState([null]);
    const [averageCnt, setAverageCnt] = useState([null]);
    const [wrongAnswerCnt, setWrongAnswerCnt] = useState([null]);
    // const [type, setType] = useState('3');

    const statisticsListApiCall = async () => {
        const stResponse = await statisticsList({
            type: 3,
            languageCode: localStorage.getItem('LangTp')
        });
        //setChartInfo({ ...chartInfo, options: { ...chartInfo.options, xaxis: { categories: chartCategories ,labels: {show: true,rotate: 0}} , yaxis: {title: {text: '발생건수'}}, tooltip: {y: {formatter: function (val) {return val + "건"}}}} });
        setTotalCnt(stResponse?.data?.RET_DATA.totalCnt);
        setAverageCnt(stResponse?.data?.RET_DATA.averageCnt);
        setWrongAnswerCnt(stResponse?.data?.RET_DATA.wrongAnswerCnt);
        setCategories(stResponse?.data?.RET_DATA.categories);

        console.log('result:', stResponse?.data?.RET_DATA);
        console.log('setTotalCnt:', stResponse?.data?.RET_DATA.totalCnt);
        console.log('setAverageCnt:', stResponse.data.RET_DATA.averageCnt);
        console.log('setWrongAnswerCnt:', stResponse.data.RET_DATA.wrongAnswerCnt);
        console.log('setCategories:', stResponse.data.RET_DATA.categories);
        console.log(stResponse.data.RET_DATA.categories);
    };

    // chart options
    const areaChartOptions = {
        chart: {
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 10,
                left: 5,
                blur: 5,
                opacity: 0.1
            },
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#52c41a', '#6D9DCC', '#faad14'],
        dataLabels: {
            enabled: true
        },
        stroke: {
            width: [3, 3, 3],
            curve: 'straight',
            dashArray: [0, 5, 0],
            curve: 'smooth'
        },
        yaxis: {
            min: -10,
            max: 40,
            tickAmount: 3
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.7
            }
        },
        legend: {
            tooltipHoverFormatter: function (val, opts) {
                return (
                    val +
                    ' : ' +
                    opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                    ' '
                );
            }
        },
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        },
        xaxis: {
            categories: categories
            //categories: ['average', 'Total Count', 'Error Count']
        },
        yaxis: {
            title: {
                text: 'count'
            }
        }
    };

    const seriesData = {
        series: [
            {
                name: 'Average',
                data: categories.length <= 0 ? [] : averageCnt
            },
            {
                name: 'Total Count',
                data: categories.length <= 0 ? [] : totalCnt
            },
            {
                name: 'Error Count',
                data: categories.length <= 0 ? [] : wrongAnswerCnt
            }
        ]
    };

    useEffect(() => {
        statisticsListApiCall();
    }, []);

    return (
        <div id="chart">
            <ReactApexChart options={areaChartOptions} series={seriesData.series} type="line" width={'100%'} height={400} />
        </div>
    );
};
