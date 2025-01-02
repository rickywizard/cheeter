import { useQuery } from '@tanstack/react-query';
import { Response } from '../interfaces/Response.interface';
import { PostData } from '../interfaces/PostData.interface';

const usePostQuery = (feedType: string) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case 'forYou':
        return '/api/post/all';
      case 'following':
        return '/api/post/following';
      default:
        return '/api/post/all';
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  return useQuery<Response<PostData[]>>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT);

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

export default usePostQuery;
