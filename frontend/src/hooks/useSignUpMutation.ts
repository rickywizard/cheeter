import { useMutation } from '@tanstack/react-query';
import { SignUpRequest } from '../interfaces/SignUpRequest.interface';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useSignUpMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignUpRequest) => {
      const res = await fetch('/api/auth/signup', {
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
      navigate('/login');
    },
  });
};

export default useSignUpMutation;
