/* eslint-disable @typescript-eslint/no-explicit-any */
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
  return <div className="w-64 h-10 rounded-md bg-gray-200 animate-pulse" />;
};
/* ---------- component ---------- */

const ProjectTimelineColumnChart = () => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const { data: programRes, isLoading: programLoading } = useGetAllProgramQuery(
    {},
  );

  const [getTimeline, { data: timelineRes, isFetching }] =
    useLazyGetTimelineQuery();
  const programs = programRes?.data?.data ?? [];
  const projectData = timelineRes?.data?.ProjectData ?? [];

  /* ---------- fetch timeline on program change ---------- */

  useEffect(() => {
    if (!selectedProgramId) return;
    getTimeline({ programId: selectedProgramId });
  }, [selectedProgramId, getTimeline]);

  /* ---------- chart data ---------- */

  const chartState = useMemo(() => {
    const categories = projectData.map((p: any) => p.name);

    return {
      series: [
        {
          name: "Completion Time",
          data: projectData.map((p: any) => p.completionTime ?? 0),
        },
        {
          name: "Saved Time",
          data: projectData.map((p: any) => p.savedTime ?? 0),
        },
        {
          name: "Overdue Time",
          data: projectData.map((p: any) => p.overdueTime ?? 0),
        },
      ],
      options: {
        chart: {
          type: "bar",
          stacked: true,
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            columnWidth: "50%",
          },
        },
        dataLabels: { enabled: false },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories,
          labels: {
            rotate: -30,
            style: {
              fontSize: "13px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "13px",
              fontWeight: 500,
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          markers: { shape: "circle" },
          fontSize: "13px",
          fontWeight: 500,
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.4,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        colors: ["#8D79F6", "#169E7B", "#DA4352"],
        tooltip: {
          y: {
            formatter: (val: number) => `${val} units`,
          },
        },
        noData: {
          text: "No timeline data available",
        },
      } as ApexOptions,
    };
  }, [projectData]);

  /* ---------- render ---------- */

  return (
    <BoxContainer>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Project Timeline</h2>

        {programLoading || isFetching ? (
          <ProgramSelectSkeleton />
        ) : (
          <Select
            value={selectedProgramId}
            onValueChange={setSelectedProgramId}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program: any) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.programName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isFetching ? (
        <ChartSkeleton />
      ) : (
        <Chart
          options={chartState.options}
          series={chartState.series}
          type="bar"
          height={350}
        />
      )}
    </BoxContainer>
  );
};

export default ProjectTimelineColumnChart;
