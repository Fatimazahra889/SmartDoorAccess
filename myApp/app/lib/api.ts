const BASE_URL = 'http://846f-41-141-173-42.ngrok-free.app'; 

export type AccessLog = {
  name: string;
  timestamp: string; 
  time: string;
  granted: boolean;
};

export type LogsResponse = {
  logs: AccessLog[];
};

export async function getLogs(): Promise<AccessLog[]> {
  const response = await fetch(`${BASE_URL}/logs`);
  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }
  return await response.json();
}
