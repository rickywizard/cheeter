import { useQuery } from '@tanstack/react-query';

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
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
