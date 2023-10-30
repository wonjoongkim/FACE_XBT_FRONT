import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const mainManagement = createApi({
    reducerPath: 'mainManagement',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}`,
        prepareHeaders: (headers) => {
            const jwtToken = localStorage.getItem('userToken');
            if (jwtToken) {
                headers.set('authorization', `Bearer ${jwtToken}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        selectScheduleList: builder.mutation({
            query: (body) => ({
                url: 'stu/main/selectScheduleList.do',
                method: 'POST',
                body: body
            })
        }),

        selectBaselineUserInfo: builder.mutation({
            query: (body) => ({
                url: 'stu/main/selectBaselineUserInfo.do',
                method: 'POST',
                body: body
            })
        }),

        //  교육정보 탭1, 학습점수조회
        //  교육정보 탭2, 교육평가조회
        //  교육정보 탭3, 오답조회
        selectStatisticsList: builder.mutation({
            query: (body) => ({
                url: 'stu/main/selectStatisticsList.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSelectScheduleListMutation, useSelectBaselineUserInfoMutation, useSelectStatisticsListMutation } = mainManagement;
