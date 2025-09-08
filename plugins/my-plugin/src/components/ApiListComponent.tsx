import { useEffect, useState } from 'react';
import { InfoCard } from '@backstage/core-components';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

type ApiEntity = {
  metadata: {
    name: string;
    description?: string;
  };
  spec?: {
    type?: string;
    owner?: string;
  };
};

export const ApiListComponent = () => {
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);

  const [apis, setApis] = useState<ApiEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApis() {
      try {
        const response = await catalogApi.getEntities({
          filter: { kind: 'API' },
        });
        setApis(response.items);
      } catch (e) {
        errorApi.post(new Error(`Failed to fetch APIs: ${e}`));
      } finally {
        setLoading(false);
      }
    }
    fetchApis();
  }, [catalogApi, errorApi]);

  if (loading) {
    return <InfoCard title="API List">Loading APIs...</InfoCard>;
  }

  return (
    <InfoCard title="API List">
      <ul>
        {apis.map(api => (
          <li key={api.metadata.name}>
            <strong>{api.metadata.name}</strong> - {api.metadata.description || 'No description'}
          </li>
        ))}
      </ul>
    </InfoCard>
  );
};
