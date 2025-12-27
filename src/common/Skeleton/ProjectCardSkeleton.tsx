import { Card, CardContent } from "@/components/ui/card";

const ProjectCardSkeleton = () => {
  return (
    <Card className="w-full max-w-md bg-white border border-[#E2E8F0] shadow-sm animate-pulse flex flex-col">
      <CardContent className="flex flex-col justify-between p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 py-2 px-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-44 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="h-5 w-20 bg-slate-200 rounded" />
        </div>

        {/* Assigned People */}
        <div className="py-2 px-4 flex justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-200" />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Priority */}
        <div className="px-4 py-2 space-y-2">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>

        {/* Progress */}
        <div className="py-2 px-4 space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-10 bg-slate-200 rounded" />
          </div>
          <div className="h-2 w-full bg-slate-200 rounded" />
        </div>

        {/* CTA */}
        <div className="py-2 px-4">
          <div className="h-10 w-full bg-slate-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCardSkeleton;
