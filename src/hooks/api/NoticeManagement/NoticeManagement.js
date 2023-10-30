import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const noticeManagement = createApi({
    reducerPath: 'noticeManagement',
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
        //공지사항 목록조회
        selectNoticeList: builder.mutation({
            query: (body) => ({
                url: 'stu/main/selectNoticeList.do',
                method: 'POST',
                body: body
            })
        }),
        //공지사항 상세조회
        selectNotice: builder.mutation({
            query: (body) => ({
                url: 'stu/main/selectNotice.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSelectNoticeListMutation, useSelectNoticeMutation } = noticeManagement;
