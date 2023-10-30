import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const evaluationManagement = createApi({
    reducerPath: 'evaluationManagement',
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
        // 학습 > 학습자와 학습정보조회
        selectEvaluation: builder.mutation({
            query: (body) => ({
                url: 'stu/evaluation/selectEvaluation.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > 이미지조회
        selectImg: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectImg.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > PASS, OPEN, (PROHIBITED, RISRICTED) 처리
        updateEvaluationAnswer: builder.mutation({
            query: (body) => ({
                url: 'stu/evaluation/updateEvaluationAnswer.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > 합격/불합격
        endEvaluation: builder.mutation({
            query: (body) => ({
                url: 'stu/evaluation/endEvaluation.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSelectEvaluationMutation, useSelectImgMutation, useUpdateEvaluationAnswerMutation, useEndEvaluationMutation } =
    evaluationManagement;
