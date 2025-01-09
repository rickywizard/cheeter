import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ProfileRequest } from '../interfaces/ProfileRequest.interface';

const useUpdateProfileMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileRequest) => {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
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
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
      ]);

      onSuccessCallback();
    },
  });
};

export default useUpdateProfileMutation;
