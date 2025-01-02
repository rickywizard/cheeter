import { useEffect } from 'react';
import PostItem from '../../components/item/PostItem';
import PostSkeleton from '../../components/skeleton/PostSkeleton';
import usePostQuery from '../../hooks/usePostQuery';

const Posts = ({ feedType }: { feedType: string }) => {
  const { data, isLoading, refetch, isRefetching } = usePostQuery(feedType);

  const posts = data?.data;

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
