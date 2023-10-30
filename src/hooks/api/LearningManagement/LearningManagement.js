import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const learningManagement = createApi({
    reducerPath: 'learningManagement',
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
        selectLearning: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectLearning.do',
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
        updateLearningAnswer: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/updateLearningAnswer.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > 합격/불합격
        endLearning: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/endLearning.do',
                method: 'POST',
                body: body
            })
        }),

        // 학습 > 학습완료 정답확인
        selectLearningComplete: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectLearningComplete.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectLearningMutation,
    useSelectImgMutation,
    useUpdateLearningAnswerMutation,
    useEndLearningMutation,
    useSelectLearningCompleteMutation
} = learningManagement;
