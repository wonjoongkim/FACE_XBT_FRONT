import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginManagement = createApi({
    reducerPath: 'loginManagement',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}`
    }),
    endpoints: (builder) => ({
        // 로그인
        login: builder.mutation({
            query: (body) => ({
                url: 'stu/login.do',
                method: 'POST',
                body: body
            })
        }),

        // 아이디 찾기
        selectUserId: builder.mutation({
            query: (body) => ({
                url: 'stu/selectUserId.do',
                method: 'POST',
                body: body
            })
        }),
        // 비밀번호 변경
        updateUserPwd: builder.mutation({
            query: (body) => ({
                url: 'stu/updateUserPwd.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useLoginMutation, useSelectUserIdMutation, useUpdateUserPwdMutation } = loginManagement;
