import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const languageManagement = createApi({
    reducerPath: 'languageManagement',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}`
    }),
    endpoints: (builder) => ({
        // 언어 셋
        selectLanguageApplyInfo: builder.mutation({
            query: (body) => ({
                url: 'common/selectLanguageApplyInfo.do',
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSelectLanguageApplyInfoMutation } = languageManagement;
