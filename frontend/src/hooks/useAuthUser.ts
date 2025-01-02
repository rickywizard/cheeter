import { useQuery } from '@tanstack/react-query';
import { Response } from '../interfaces/Response.interface';
import { UserData } from '../interfaces/UserData.interface';

const useAuthUser = () => {
  return useQuery<Response<UserData>>({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
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

export default useAuthUser;
