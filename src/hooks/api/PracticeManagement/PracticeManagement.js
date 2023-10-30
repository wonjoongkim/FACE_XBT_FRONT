import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const practiceManagement = createApi({
    reducerPath: 'practiceManagement',
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
        // 물품연습 > 그룹조회목록
        selectUnitGroupList: builder.mutation({
            query: (body) => ({
                url: 'stu/practice/selectUnitGroupList.do',
                method: 'POST',
                body: body
            })
        }),

        // 물품연습 > 그룹물품목록조회
        selectUnitList: builder.mutation({
            query: (body) => ({
                url: 'stu/practice/selectUnitList.do',
                method: 'POST',
                body: body
            })
        }),

        // 물품연습 > 단품상세조회
        selectUnit: builder.mutation({
            query: (body) => ({
                url: 'stu/practice/selectUnit.do',
                method: 'POST',
                body: body
            })
        }),

        // 물품연습 > 이미지목록가져오기
        selectCommonPracticeImg: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectCommonPracticeImg.do',
                method: 'POST',
                body: body
            })
        }),

        // 물품연습 > 의사색체이미지조회
        selectUnitImg: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectUnitImg.do',
                method: 'POST',
                body: body
            })
        }),

        // 물품연습 > 3d이미지각조조절
        selectLearnProblemsResult: builder.mutation({
            query: (body) => ({
                url: 'stu/learning/selectThreedAngle.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const {
    useSelectUnitGroupListMutation,
    useSelectUnitListMutation,
    useSelectUnitMutation,
    useSelectCommonPracticeImgMutation,
    useSelectUnitImgMutation,
    useSelectLearnProblemsResultMutation
} = practiceManagement;
