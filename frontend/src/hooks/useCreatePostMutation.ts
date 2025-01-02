import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostRequest } from '../interfaces/PostRequest.interface';
import toast from 'react-hot-toast';

const useCreatePostMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostRequest) => {
      const res = await fetch('/api/post/create', {
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
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccessCallback();
    },
  });
};

export default useCreatePostMutation;
