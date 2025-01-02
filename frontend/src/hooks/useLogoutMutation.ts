import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
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
    onSuccess: (res) => {
      toast.success(res.message);
      // console.log(res);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};

export default useLogoutMutation;
