import { MyDynamicDataComponent } from './MyDynamicDataComponent';
import { ApiListComponent } from './ApiListComponent';
import { DeploymentStatusComponent } from './DeploymentStatusComponent';
import { MyGitHubRepoList } from './MyGitHubRepoList';

// Correct - named export
export const MyPluginPage = () => (
  <>
    <MyDynamicDataComponent />
    <ApiListComponent />
    <DeploymentStatusComponent />
    <MyGitHubRepoList />
  </>
);

