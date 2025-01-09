import { useQuery } from '@tanstack/react-query';
import { Response } from '../interfaces/Response.interface';
import { UserData } from '../interfaces/UserData.interface';

const useProfileQuery = (username: string) => {
  return useQuery<Response<UserData>>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch(`/api/user/profile/${username}`);
      const result = await res.json();

      if (result.error) return null;

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      return result;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useProfileQuery;
