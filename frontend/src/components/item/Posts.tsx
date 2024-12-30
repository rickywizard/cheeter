import PostItem from '../../components/item/PostItem';
import PostSkeleton from '../../components/skeleton/PostSkeleton';
import { POSTS } from '../../utils/dummyData';

const Posts = ({ feedType }: { feedType?: string }) => {
  const isLoading = false;

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && POSTS && (
        <div>
          {POSTS.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
