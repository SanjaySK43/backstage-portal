import { createDevApp } from '@backstage/dev-utils';
import { myPluginPlugin } from '../src/plugin';
import { MyPluginPage as MyPluginPageComponent } from '../src/components/MyPluginPage';

createDevApp()
  .registerPlugin(myPluginPlugin)
  .addPage({
    element: <MyPluginPageComponent />,
    title: 'Root Page',
    path: '/my-plugin',
  })
  .render();
