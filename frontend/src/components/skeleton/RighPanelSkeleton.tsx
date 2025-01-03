const RightPanelSkeleton = () => {
  return (
    <div className="flex flex-col w-60 my-1">
      <div className="flex gap-2 items-center">
        <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>
        <div className="flex flex-1 justify-between">
          <div className="flex flex-col gap-1">
            <div className="skeleton h-2 w-12 rounded-full"></div>
            <div className="skeleton h-2 w-16 rounded-full"></div>
          </div>
          <div className="skeleton h-7 w-16 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
export default RightPanelSkeleton;
