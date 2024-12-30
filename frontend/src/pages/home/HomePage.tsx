import { useState } from 'react';
import CreatePost from './CreatePost';
import Posts from '../../components/item/Posts';

const HomePage = () => {
  const [feedType, setFeedType] = useState<string>('forYou');

  return (
    <>
      <div className="w-full m-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700 relative">
          <div
            className="absolute bottom-0 h-1 rounded-full bg-primary transition-transform duration-300 z-50"
            style={{
              width: '10%',
              transform:
                feedType === 'forYou'
                  ? 'translateX(200%)'
                  : 'translateX(calc(2 * 350%))',
            }}
          ></div>
          <div
            className={
              'text-center flex-1 p-3 hover:bg-base-200 transition duration-300 cursor-pointer relative'
            }
            onClick={() => setFeedType('forYou')}
          >
            For you
          </div>
          <div
            className="text-center flex-1 p-3 hover:bg-base-200 transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType('following')}
          >
            Following
          </div>
        </div>

        {/*  CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </>
  );
};

export default HomePage;
