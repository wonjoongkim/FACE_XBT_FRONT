/* eslint-disable */
import React, { useState, useEffect, Component } from 'react';
import Chart from 'react-apexcharts';

import { Link, useNavigate, useParams } from 'react-router-dom';

//교육정보 통계api
import { useSelectStatisticsListMutation } from '../../hooks/api/MainManagement/MainManagement';
import './eduinfo.css';

export const Score01 = () => {
    //교육정보 통계api
    const [statisticsList] = useSelectStatisticsListMutation();

    const [categories, setCategories] = useState([]); // 타이틀
    const [level1, setLevel1] = useState([]);
    const [level2, setLevel2] = useState([]);
    const [level3, setLevel3] = useState([]);
    const [level4, setLevel4] = useState([]);
    const [level5, setLevel5] = useState([]);
    // const [type, setType] = useState('1');

    const scoreData = {
        //colors: ['#C3E0FC','#A2C4E5','#C8D7E7','#7EA4CA','#9FBCD7','#DAE1E7','#6D9DCC']
        series: [
            {
                name: 'level 1',
                data: level1,
                color: '#C3E0FC'
            },
            {
                name: 'level 2',
                data: level2,
                color: '#A2C4E5'
            },
            {
                name: 'level 3',
                data: level3,
                color: '#C8D7E7'
            },
            {
                name: 'level 4',
                data: level4,
                color: '#7EA4CA'
            },
            {
                name: 'level 5',
                data: level5,
                color: '#9FBCD7'
            }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                }
            },
            dataLabels: {
                enabled: true,
                //offsetY: -20,
                style: {
                    colors: ['#5A687B']
                }
            },
            stroke: {
                show: true,
                width: 10,
                colors: ['transparent']
            },
            xaxis: {
                labels: { show: true, rotate: 0 },
                //categories: ['2023년 1차', '2023년 2차', '2023년 3차']
                categories: categories
            },
            yaxis: {
                title: {
                    text: 'score'
                }
            },
            fill: {
                opacity: 1,
                colors: ['#C3E0FC', '#A2C4E5', '#C8D7E7', '#7EA4CA', '#9FBCD7', '#DAE1E7', '#6D9DCC']
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val;
                    }
                }
            }
        }
    };
    const statisticsListApiCall = async () => {
        const stResponse = await statisticsList({
            type: 1,
            languageCode: localStorage.getItem('LangTp')
        });
        //setChartInfo({ ...chartInfo, options: { ...chartInfo.options, xaxis: { categories: chartCategories ,labels: {show: true,rotate: 0}} , yaxis: {title: {text: '발생건수'}}, tooltip: {y: {formatter: function (val) {return val + "건"}}}} });
        setCategories(stResponse?.data?.RET_DATA.categories);
        setLevel1(stResponse?.data?.RET_DATA.level1);
        setLevel2(stResponse?.data?.RET_DATA.level2);
        setLevel3(stResponse?.data?.RET_DATA.level3);
        setLevel4(stResponse?.data?.RET_DATA.level4);
        setLevel5(stResponse?.data?.RET_DATA.level5);
    };

    useEffect(() => {
        statisticsListApiCall();
    }, []);

    return (
        <>
            <div id="chart">
                <Chart options={scoreData.options} series={scoreData.series} type="bar" height={600} />
            </div>
        </>
    );
};
