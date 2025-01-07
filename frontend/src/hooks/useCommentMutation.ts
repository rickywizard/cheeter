import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CommentRequest } from '../interfaces/CommentRequest.interface';
import { Response } from '../interfaces/Response.interface';
import { PostData } from '../interfaces/PostData.interface';

interface CommentMutationProps {
  postId: string;
  data: CommentRequest;
}

const useCommentMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, data }: CommentMutationProps) => {
      const res = await fetch(`/api/post/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
      toast.success(res.message);
      // console.log(res);

      queryClient.setQueryData(
        ['posts'],
        (cachedData: Response<PostData[]>) => {
          // console.log(cachedData);

          const postId = variables.postId;

          const { data, ...rest } = cachedData;
          const updatedPosts = data?.map((post) => {
            if (post._id === postId) {
              return { ...post, comments: res.data };
            }
            return post;
          });

          return { ...rest, data: updatedPosts };
        }
      );

      onSuccessCallback();
    },
  });
};

export default useCommentMutation;
