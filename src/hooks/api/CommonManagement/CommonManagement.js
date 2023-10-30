import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const commonManagement = createApi({
    reducerPath: 'commonManagement',
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
        // 학습 > 학습완료 정답확인
        selectLearningComplete: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectLearningComplete.do',
                method: 'POST',
                body: body
            })
        }),

        // 오답문제풀이 > 학습완료 정답확인
        selectWrongAnswerComplete: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectWrongAnswerComplete.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > 학습완료 이미지 조회
        selectCommonLearningImg: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectCommonLearningImg.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > 학습완료 의사색체 이미지 조회
        selectCommonColorImg: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectImg.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > 학습완료 상세물품목록조회
        selectLearnProblemsResult: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectLearnProblemsResult.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectLearningCompleteMutation,
    useSelectWrongAnswerCompleteMutation,
    useSelectCommonLearningImgMutation,
    useSelectCommonColorImgMutation,
    useSelectLearnProblemsResultMutation
} = commonManagement;
