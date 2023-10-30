import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const theorymanagement = createApi({
    reducerPath: 'theorymanagement',
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
        // 이론평가 > 조회
        selectTheoryList: builder.mutation({
            query: (body) => ({
                url: 'stu/theory/selectTheoryList.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론평가 > 상세
        selectTheory: builder.mutation({
            query: (body) => ({
                url: 'stu/theory/selectTheory.do',
                method: 'POST',
                body: body
            })
        }),

        // 이론평가 > 정답제출
        endTheory: builder.mutation({
            query: (body) => ({
                url: 'stu/theory/endTheory.do',
                method: 'POST',
                body: body
            })
        }),
        // 이론 > 이론강의 리스트
        selectTheoryFileList: builder.mutation({
            query: (body) => ({
                url: 'stu/theory/selectTheoryFileList.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSelectTheoryListMutation, useSelectTheoryMutation, useEndTheoryMutation, useSelectTheoryFileListMutation } =
    theorymanagement;
