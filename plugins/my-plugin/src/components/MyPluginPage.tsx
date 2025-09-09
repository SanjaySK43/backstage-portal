import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { MyDynamicDataComponent } from './MyDynamicDataComponent';
import { ApiListComponent } from './ApiListComponent';
import { MyGitHubRepoList } from './MyGitHubRepoList';
import { DeploymentStatusComponent } from './DeploymentStatusComponent';
import { GitHubActionsComponent } from './GitHubActionsComponent';
import { PipelineStatusComponent } from './PipelineStatusComponent';

export const MyPluginPage = () => (
  <Page themeId="tool">
    <Header title="Welcome to My Plugin!" subtitle="Custom dashboard with multiple components">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Plugin Dashboard">
        <SupportButton>This plugin shows dynamic data, APIs, deployments, and GitHub repositories.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <MyDynamicDataComponent />
        </Grid>
        <Grid item>
          <ApiListComponent />
        </Grid>
        <Grid item>
          <DeploymentStatusComponent />
        </Grid>
        <Grid item>
          <MyGitHubRepoList />
        </Grid>
        <Grid item>
          <GitHubActionsComponent />
        </Grid>
        <Grid item>
          <PipelineStatusComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);

