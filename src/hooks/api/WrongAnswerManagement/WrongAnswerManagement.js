import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const wrongAnswerManagement = createApi({
    reducerPath: 'wrongAnswerManagement',
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
        // 오답문제풀이 > 학습자와 오답문제풀이정보조회
        selectWrongAnswer: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectWrongAnswer.do',
                method: 'POST',
                body: body
            })
        }),

        // 오답문제풀이 > 의사색체 이미지조회
        selectImg: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectImg.do',
                method: 'POST',
                body: body
            })
        }),

        // 오답문제풀이 > PASS, OPEN, (PROHIBITED, RISRICTED) 처리
        updateWrongAnswer: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/updateWrongAnswer.do',
                method: 'POST',
                body: body
            })
        }),

        // 오답문제풀이 > 합격/불합격
        endWrongAnswer: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/endWrongAnswer.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSelectWrongAnswerMutation, useSelectImgMutation, useUpdateWrongAnswerMutation, useEndWrongAnswerMutation } =
    wrongAnswerManagement;
