import { queryUser } from '@/action/queryUser';
import { useQuery } from '@tanstack/react-query';

export function useUserData() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      return queryUser().then(response => {
        return response; 
      });
    },
  });

  return {
    user: data,
    isLoading,
    isError,
    error,
  };
}
