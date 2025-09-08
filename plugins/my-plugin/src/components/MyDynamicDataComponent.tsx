import React, { useEffect, useState } from 'react';
import { InfoCard } from '@backstage/core-components';

type DataItem = {
  id: number;
  name: string;
  status: string;
};

export const MyDynamicDataComponent = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call with dummy data and delay
    setTimeout(() => {
      const dummyData = [
        { id: 1, name: 'Component A', status: 'Running' },
        { id: 2, name: 'Component B', status: 'Stopped' },
        { id: 3, name: 'Component C', status: 'Starting' },
      ];
      setData(dummyData);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return <InfoCard title="My Dynamic Data">Loading...</InfoCard>;
  }

  return (
    <InfoCard title="My Dynamic Data">
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.name} — {item.status}
          </li>
        ))}
      </ul>
    </InfoCard>
  );
};
