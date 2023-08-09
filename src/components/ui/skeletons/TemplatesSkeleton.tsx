export const TemplatesSkeleton = () => {
  return (
    <div className="grid animate-pulse gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <TemplateSkeleton />
      <TemplateSkeleton />
      <TemplateSkeleton />
      <TemplateSkeleton />
      <TemplateSkeleton />
      <TemplateSkeleton />
    </div>
  );
};
export const TemplateSkeleton = () => {
  return (
    <div className="rounded-box flex h-48 flex-col gap-2 bg-base-300 p-2 justify-between">
      <div className="flex flex-col gap-2">
        <div className="h-10 rounded-lg bg-base-200"></div>
        <div className="h-6 w-1/2 rounded-lg bg-base-200"></div>
        <div className="h-6 w-3/4 rounded-lg bg-base-200"></div>
      </div>

      <div className="mt-2 flex justify-end">
        <div className="h-10 w-24 rounded-lg bg-base-200"></div>
      </div>
    </div>
  );
};
