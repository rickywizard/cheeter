import { useQuery } from '@tanstack/react-query';
import { Response } from '../interfaces/Response.interface';
import { NotificationData } from '../interfaces/NotificationData.interface';

const useNotificationQuery = () => {
  return useQuery<Response<NotificationData[]>>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notification');

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      return result;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useNotificationQuery;
