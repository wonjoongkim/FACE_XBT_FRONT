// assets
import { ProjectOutlined } from '@ant-design/icons';

// icons
const icons = { ProjectOutlined };

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

export const frontmain = {
    id: '0',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: '/',
            title: '',
            subtitle: '',
            type: 'item',
            url: '/',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        },
        {
            id: '/frontmain',
            title: '',
            subtitle: '',
            type: 'item',
            url: '/frontmain',
            icon: icons.ProjectOutlined,
            breadcrumbs: true
        }
    ]
};
