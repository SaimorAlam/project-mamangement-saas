import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";


import BoxContainer from "@/common/BoxContainer";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { useLazyGetTimelineQuery } from "@/store/Api/ClientDashboardApi/ClientDashboardApi";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ChartSkeleton from "@/common/Skeleton/ChartSkeleton";

const ProgramSelectSkeleton = () => {
  return <div className="w-56 h-10 rounded-xl bg-slate-100 animate-pulse" />;
};

interface TimelineProject {
  id: string;
  name: string;
  timelineDays: number;
  savedDays: number;
  overdueDays: number;
}

interface Program {
  id: string;
  programName: string;
}

const ProjectTimelineColumnChart = () => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const { data: programRes, isLoading: programLoading } = useGetAllProgramQuery(
    {},
  );

  const [getTimeline, { data: timelineRes, isFetching }] =
    useLazyGetTimelineQuery();
    
  const programs = useMemo(() => (programRes?.data?.data as Program[]) ?? [], [programRes]);
  const projectData = useMemo(() => (timelineRes?.data?.projects as TimelineProject[]) ?? [], [timelineRes]);

  /* ---------- Default Program Selection ---------- */
  useEffect(() => {
    if (!selectedProgramId && programs.length > 0) {
      setSelectedProgramId(programs[0].id);
    }
  }, [programs, selectedProgramId]);

  /* ---------- fetch timeline on program change ---------- */
  useEffect(() => {
    if (!selectedProgramId) return;
    getTimeline({ programId: selectedProgramId });
  }, [selectedProgramId, getTimeline]);

  /* ---------- chart data ---------- */
  const chartState = useMemo(() => {
    const categories = projectData.map((p) => p.name);

    return {
      series: [
        {
          name: "Timeline Days",
          data: projectData.map((p) => p.timelineDays ?? 0),
        },
        {
          name: "Saved Days",
          data: projectData.map((p) => p.savedDays ?? 0),
        },
        {
          name: "Overdue Days",
          data: projectData.map((p) => p.overdueDays ?? 0),
        },
      ],
      options: {
        chart: {
          type: "bar",
          stacked: true,
          toolbar: { show: false },
          zoom: { enabled: false },
          fontFamily: "'Inter', sans-serif",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "all",
            columnWidth: "35%",
          },
        },
        dataLabels: { enabled: false },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        grid: {
          borderColor: "#cbd5e1",
          strokeDashArray: 4,
          padding: {
            left: 20,
            right: 20,
          },
        },
        xaxis: {
          categories,
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: "#94A3B8",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#94A3B8",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "right",
          markers: { shape: "circle", offsetY: 0 },
          fontSize: "13px",
          fontWeight: 600,
          itemMargin: { horizontal: 15, vertical: 10 },
          labels: { colors: "#64748B" },
        },
        colors: ["#3B82F6", "#10B981", "#EF4444"],
        tooltip: {
          theme: "light",
          y: {
            formatter: (val: number) => `${val} days`,
          },
        },
        noData: {
          text: "No timeline data available",
          style: {
            color: "#94A3B8",
            fontSize: "14px",
          },
        },
      } as ApexOptions,
    };
  }, [projectData]);

  return (
    <BoxContainer className="relative overflow-hidden group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
        <div className="flex items-start gap-3.5">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Project Timeline
            </h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">
              Efficiency and scheduling overview per program
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {programLoading ? (
            <ProgramSelectSkeleton />
          ) : (
            <div className="flex items-center gap-2.5 bg-slate-50 pr-3 rounded-xl border border-slate-100 transition-all hover:border-slate-200">
              <Select
                value={selectedProgramId}
                onValueChange={setSelectedProgramId}
              >
                <SelectTrigger className="w-48 bg-transparent border-none shadow-none focus:ring-0  text-slate-600 font-semibold text-[13px]">
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  {programs.map((program) => (
                    <SelectItem 
                      key={program.id} 
                      value={program.id}
                      className="text-[13px] font-medium rounded-lg"
                    >
                      {program.programName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {isFetching ? (
        <ChartSkeleton />
      ) : (
        <div className="relative z-10">
          <Chart
            options={chartState.options}
            series={chartState.series}
            type="bar"
            height={350}
          />
        </div>
      )}
    </BoxContainer>
  );
};

export default ProjectTimelineColumnChart;
