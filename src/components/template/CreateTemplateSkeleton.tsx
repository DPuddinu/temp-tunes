const CreateTemplateSkeleton = () => {
  return (
    <div className="min-h-60 flex w-full animate-pulse flex-col gap-2 rounded-xl bg-base-300 p-2 sm:max-w-sm">
      <div className="h-16 w-full rounded-xl bg-base-200"></div>
      <div className="h-16 w-full rounded-xl bg-base-200"></div>
      <div className="h-16 w-full rounded-xl bg-base-200"></div>

      <div className="flex gap-2">
        <div className="h-16 grow rounded-xl bg-base-200"></div>
        <div className="h-16 w-16 rounded-full bg-base-200"></div>
      </div>

      <div className="flex h-16 w-full items-center justify-center rounded-xl bg-base-200"></div>
    </div>
  );
};

export default CreateTemplateSkeleton;
