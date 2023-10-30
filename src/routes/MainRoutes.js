/* eslint-disable no-unused-vars */
// project import
import MainLayout from 'layout/MainLayout';

// 메인 대시보드
import { FrontMain } from 'pages/frontmain';
import { EduInfo } from 'pages/eduinfo';
import { LearningS } from 'pages/learning/LearningS';
import { LearningC } from 'pages/learning/LearningC';
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            // 메인
            path: '/',
            element: <FrontMain />
        },
        {
            // 메인
            path: 'frontmain',
            element: <FrontMain />
        },
        {
            // 메인
            path: 'eduinfo',
            element: <EduInfo />
        },
        {
            // 학습 (슬라이드 방식)
            path: 'learningS',
            element: <LearningS />
        },
        {
            // 학습 (컷 방식)
            path: 'learningC',
            element: <LearningC />
        }
    ]
};

export default MainRoutes;
