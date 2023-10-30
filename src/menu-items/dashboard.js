// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '',
            title: '',
            type: 'item',
            url: '/',
            icon: icons.DashboardOutlined,
            breadcrumbs: true
        },
        {
            id: 'frontmain',
            title: '',
            type: 'item',
            url: '/frontmain',
            icon: icons.DashboardOutlined,
            breadcrumbs: true
        }
    ]
};

export default dashboard;
