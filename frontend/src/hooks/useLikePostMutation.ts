import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PostData } from '../interfaces/PostData.interface';
import { Response } from '../interfaces/Response.interface';

const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/post/like/${postId}`, {
        method: 'POST',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      return result;
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (res, variables) => {
      // toast.success(res.message);
      // console.log(res);

      // update the cache directly for that post
      queryClient.setQueryData(
        ['posts'],
        (cachedData: Response<PostData[]>) => {
          // console.log(cachedData);

          const postId = variables;

          const { data, ...rest } = cachedData;
          const updatedPosts = data?.map((post) => {
            if (post._id === postId) {
              return { ...post, likes: res.data };
            }
            return post;
          });

          return { ...rest, data: updatedPosts };
        }
      );
    },
  });
};

export default useLikePostMutation;
