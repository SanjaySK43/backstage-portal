import { createDevApp } from '@backstage/dev-utils';
import { myDashboardPlugin, MyDashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(myDashboardPlugin)
  .addPage({
    element: <MyDashboardPage />,
    title: 'Root Page',
    path: '/my-dashboard',
  })
  .render();
