import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginData } from '../interfaces/LoginData.interface';
import toast from 'react-hot-toast';

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await fetch('/api/auth/login', {
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
      // console.log(res);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};

export default useLoginMutation;
