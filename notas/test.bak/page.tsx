import { trpc } from "@/lib/trpc/react";

const YourComponent = () => {
  const { data, error, isLoading } = trpc.authorized.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
};

export default YourComponent;
