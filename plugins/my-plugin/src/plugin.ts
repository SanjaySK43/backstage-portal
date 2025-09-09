import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const myPluginPlugin = createPlugin({
  id: 'my-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const MyPluginPage = createRoutableExtension({
  name: 'MyPluginPage',
  component: () =>
    import('./components/MyPluginPage').then(m => m.MyPluginPage),
  mountPoint: rootRouteRef,
});
