import { useQuery } from '@tanstack/react-query';
import { Response } from '../interfaces/Response.interface';
import { UserData } from '../interfaces/UserData.interface';

const useSuggestedUser = () => {
  return useQuery<Response<UserData[]>>({
    queryKey: ['suggestedUser'],
    queryFn: async () => {
      const res = await fetch('/api/user/suggested');

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

export default useSuggestedUser;
