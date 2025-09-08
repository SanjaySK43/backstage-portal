import { useEffect, useState } from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { useApi, githubAuthApiRef, errorApiRef } from '@backstage/core-plugin-api';

type GitHubRepo = {
  id: number;
  full_name: string;
  html_url: string;
};

export const GitHubRepoList = () => {
  const githubAuth = useApi(githubAuthApiRef);
  const errorApi = useApi(errorApiRef);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const token = await githubAuth.getAccessToken(['repo']);
        const response = await fetch('https://api.github.com/user/repos?per_page=50', {
          headers: { Authorization: `token ${token}` },
        });
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        const data: GitHubRepo[] = await response.json();
        if (isMounted) setRepos(data);
      } catch (e) {
        errorApi.post(new Error(`Failed to load GitHub repos: ${e}`));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [githubAuth, errorApi]);

  if (loading) return <InfoCard title="GitHub Repositories"><Progress /></InfoCard>;

  return (
    <InfoCard title="GitHub Repositories">
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.full_name}
            </a>
          </li>
        ))}
      </ul>
    </InfoCard>
  );
};
