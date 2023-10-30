import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const selectUnitGroupManagement = createApi({
    reducerPath: 'selectUnitGroupManagement',
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
        // 반입금지물품 > 리스트 조회
        selectUnitGroupList: builder.mutation({
            query: (body) => ({
                url: 'stu/practice/selectUnitGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 반입금지물품 > 정답 조회
        selectUnitGroupAnswer: builder.mutation({
            query: (body) => ({
                url: 'stu/practice/selectUnitGroupAnswer.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSelectUnitGroupListMutation, useSelectUnitGroupAnswerMutation } = selectUnitGroupManagement;
