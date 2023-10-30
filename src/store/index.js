// third-party
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { loginManagement } from '../hooks/api/LoginManagement/LoginManagement';
import { mainManagement } from '../hooks/api/MainManagement/MainManagement';
import { noticeManagement } from '../hooks/api/NoticeManagement/NoticeManagement';
import { learningManagement } from '../hooks/api/LearningManagement/LearningManagement';
import { commonManagement } from '../hooks/api/CommonManagement/CommonManagement';
import { evaluationManagement } from '../hooks/api/EvaluationManagement/EvaluationManagement';
import { wrongAnswerManagement } from '../hooks/api/WrongAnswerManagement/WrongAnswerManagement';
import { selectUnitGroupManagement } from '../hooks/api/SelectUnitGroupManagement/SelectUnitGroupManagement';
import { practiceManagement } from '../hooks/api/PracticeManagement/PracticeManagement';
import { languageManagement } from '../hooks/api/LanguageManagement/LanguageManagement';
import { theorymanagement } from '../hooks/api/TheoryManagement/TheoryManagement';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

export const store = configureStore({
    reducer: {
        [mainManagement.reducerPath]: mainManagement.reducer,
        [loginManagement.reducerPath]: loginManagement.reducer,
        [noticeManagement.reducerPath]: noticeManagement.reducer,
        [learningManagement.reducerPath]: learningManagement.reducer,
        [commonManagement.reducerPath]: commonManagement.reducer,
        [evaluationManagement.reducerPath]: evaluationManagement.reducer,
        [wrongAnswerManagement.reducerPath]: wrongAnswerManagement.reducer,
        [selectUnitGroupManagement.reducerPath]: selectUnitGroupManagement.reducer,
        [practiceManagement.reducerPath]: practiceManagement.reducer,
        [languageManagement.reducerPath]: languageManagement.reducer,
        [theorymanagement.reducerPath]: theorymanagement.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(mainManagement.middleware)
            .concat(loginManagement.middleware)
            .concat(noticeManagement.middleware)
            .concat(learningManagement.middleware)
            .concat(commonManagement.middleware)
            .concat(evaluationManagement.middleware)
            .concat(wrongAnswerManagement.middleware)
            .concat(selectUnitGroupManagement.middleware)
            .concat(practiceManagement.middleware)
            .concat(languageManagement.middleware)
            .concat(theorymanagement.middleware)
});

setupListeners(store.dispatch);
