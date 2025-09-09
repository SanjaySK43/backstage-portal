import { useEffect, useState } from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Button,
  Chip,
  Typography,
  Box,
  Divider,
  Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  apiItem: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
  },
  methodChip: {
    marginRight: theme.spacing(1),
    minWidth: 60,
  },
  responseBox: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.spacing(1),
  },
  loadingText: {
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
}));

type ApiEndpoint = {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  status: 'active' | 'deprecated' | 'beta';
};

export const ApiListComponent = () => {
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const [apis, setApis] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiResponses, setApiResponses] = useState<Record<string, any>>({});
  const [loadingApis, setLoadingApis] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      // Mock API endpoints for demonstration
      const mockApis: ApiEndpoint[] = [
        {
          id: 'users-api',
          name: 'Users API',
          method: 'GET',
          endpoint: 'https://jsonplaceholder.typicode.com/users',
          description: 'Get list of all users',
          status: 'active',
        },
        {
          id: 'posts-api',
          name: 'Posts API',
          method: 'GET',
          endpoint: 'https://jsonplaceholder.typicode.com/posts',
          description: 'Get list of all posts',
          status: 'active',
        },
        {
          id: 'create-post-api',
          name: 'Create Post API',
          method: 'POST',
          endpoint: 'https://jsonplaceholder.typicode.com/posts',
          description: 'Create a new post',
          status: 'active',
        },
        {
          id: 'create-user-api',
          name: 'Create User API',
          method: 'POST',
          endpoint: 'https://jsonplaceholder.typicode.com/users',
          description: 'Create a new user',
          status: 'active',
        },
        {
          id: 'todos-api',
          name: 'Todos API',
          method: 'GET',
          endpoint: 'https://jsonplaceholder.typicode.com/todos',
          description: 'Get list of todo items',
          status: 'beta',
        },
        {
          id: 'create-todo-api',
          name: 'Create Todo API',
          method: 'POST',
          endpoint: 'https://jsonplaceholder.typicode.com/todos',
          description: 'Create a new todo item',
          status: 'beta',
        },
        {
          id: 'comments-api',
          name: 'Comments API',
          method: 'GET',
          endpoint: 'https://jsonplaceholder.typicode.com/comments',
          description: 'Get list of all comments',
          status: 'active',
        },
        {
          id: 'albums-api',
          name: 'Albums API',
          method: 'GET',
          endpoint: 'https://jsonplaceholder.typicode.com/albums',
          description: 'Get list of photo albums',
          status: 'deprecated',
        },
      ];
      
      setApis(mockApis);
    } catch (error) {
      errorApi.post(new Error(`Failed to fetch APIs: ${error}`));
    } finally {
      setLoading(false);
    }
  };

  const getPostData = (apiId: string) => {
    const postDataMap: Record<string, any> = {
      'create-post-api': {
        title: 'Sample Post from Backstage',
        body: 'This is a test post created via the API endpoint in Backstage portal.',
        userId: 1
      },
      'create-user-api': {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '1-555-123-4567',
        website: 'johndoe.com'
      },
      'create-todo-api': {
        title: 'Test todo from Backstage',
        completed: false,
        userId: 1
      }
    };
    return postDataMap[apiId] || {};
  };

  const triggerApi = async (api: ApiEndpoint) => {
    setLoadingApis(prev => new Set(prev).add(api.id));
    
    try {
      const isPostRequest = api.method === 'POST';
      const requestOptions: RequestInit = {
        method: api.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (isPostRequest) {
        requestOptions.body = JSON.stringify(getPostData(api.id));
      }

      const response = await fetch(api.endpoint, requestOptions);
      const data = await response.json();
      
      // Limit response data for display (first 3 items if array)
      const limitedData = Array.isArray(data) ? data.slice(0, 3) : data;
      
      setApiResponses(prev => ({
        ...prev,
        [api.id]: {
          status: response.status,
          data: limitedData,
          timestamp: new Date().toLocaleTimeString(),
          requestData: isPostRequest ? getPostData(api.id) : undefined,
        }
      }));
    } catch (error) {
      setApiResponses(prev => ({
        ...prev,
        [api.id]: {
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toLocaleTimeString(),
        }
      }));
      errorApi.post(new Error(`API call failed: ${error instanceof Error ? error.message : String(error)}`));
    } finally {
      setLoadingApis(prev => {
        const newSet = new Set(prev);
        newSet.delete(api.id);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'beta': return 'default';
      case 'deprecated': return 'secondary';
      default: return 'default';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'primary';
      case 'POST': return 'secondary';
      case 'PUT': return 'default';
      case 'DELETE': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <InfoCard title="API Endpoints">
        <Progress />
      </InfoCard>
    );
  }

  return (
    <InfoCard title="API Endpoints">
      <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
        Click "Test API" to trigger real API calls and see responses
      </Typography>
      
      <List>
        {apis.map((api, index) => (
          <div key={api.id}>
            <Paper className={classes.apiItem} elevation={1}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                      <Chip 
                        label={api.method} 
                        color={getMethodColor(api.method)}
                        size="small"
                        className={classes.methodChip}
                      />
                      <Typography variant="h6">{api.name}</Typography>
                      <Chip 
                        label={api.status} 
                        color={getStatusColor(api.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {api.description}
                      </Typography>
                      <Typography variant="body2" style={{ fontFamily: 'monospace', marginTop: 4 }}>
                        {api.endpoint}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => triggerApi(api)}
                    disabled={loadingApis.has(api.id)}
                  >
                    {loadingApis.has(api.id) ? 'Testing...' : 'Test API'}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              
              {apiResponses[api.id] && (
                <Box className={classes.responseBox}>
                  <Typography variant="subtitle2" gutterBottom>
                    Response ({apiResponses[api.id].timestamp}):
                  </Typography>
                  {apiResponses[api.id].error ? (
                    <Typography color="error">
                      Error: {apiResponses[api.id].error}
                    </Typography>
                  ) : (
                    <Box>
                      <Typography variant="body2">
                        Status: {apiResponses[api.id].status}
                      </Typography>
                      
                      {apiResponses[api.id].requestData && (
                        <Box marginTop={1}>
                          <Typography variant="subtitle2" gutterBottom>
                            Request Body:
                          </Typography>
                          <pre style={{ 
                            fontSize: '11px', 
                            maxHeight: '150px', 
                            overflow: 'auto',
                            backgroundColor: '#e3f2fd',
                            color: '#1565c0',
                            padding: '6px',
                            borderRadius: '4px',
                            border: '1px solid #bbdefb'
                          }}>
                            {JSON.stringify(apiResponses[api.id].requestData, null, 2)}
                          </pre>
                        </Box>
                      )}
                      
                      <Box marginTop={1}>
                        <Typography variant="subtitle2" gutterBottom>
                          Response:
                        </Typography>
                        <pre style={{ 
                          fontSize: '12px', 
                          maxHeight: '200px', 
                          overflow: 'auto',
                          backgroundColor: '#f5f5f5',
                          color: '#333',
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}>
                          {JSON.stringify(apiResponses[api.id].data, null, 2)}
                        </pre>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
            {index < apis.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </InfoCard>
  );
};
