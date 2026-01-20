"use client";
import DropdownControl from "@/components/atoms/DropdownControl";
import LoadingDots from "@/components/feedback/LoadingDots";
import ListCard from "@/components/organisms/ListCard";
import StatsCard from "@/components/organisms/StatsCard";
import useFormatPrice from "@/hooks/ui/useFormatPrice";
import { BarChart2, DollarSign, LineChart, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";

const AreaChartComponent = dynamic(
  () => import("@/components/charts/AreaChartComponent"),
  { ssr: false }
);
const BarChartComponent = dynamic(
  () => import("@/components/charts/BarChartComponent"),
  { ssr: false }
);

interface FormData {
  timePeriod: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  useCustomRange?: boolean;
}

const Dashboard = () => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      timePeriod: "allTime",
      useCustomRange: false,
    },
  });
  const formatPrice = useFormatPrice();

  const timePeriodOptions = [
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Year", value: "lastYear" },
    { label: "All Time", value: "allTime" },
  ];

  const loading = false;
  const error = null;
  const data = {
    revenueAnalytics: {
      totalRevenue: 0,
      changes: { revenue: 0 },
      monthlyTrends: { revenue: [], labels: [] },
    },
    orderAnalytics: {
      totalSales: 0,
      changes: { sales: 0 },
    },
    interactionAnalytics: {
      totalInteractions: 0,
    },
    userAnalytics: {
      totalUsers: 0,
      changes: { users: 0 },
    },
    productPerformance: [],
  };

  const topItems =
    data?.productPerformance?.slice(0, 10).map((p: any) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      revenue: formatPrice(p.revenue),
    })) || [];

  const salesByProduct = {
    categories: data?.productPerformance?.map((p: any) => p.name) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data?.productPerformance?.map((p: any) => p.revenue) || [],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingDots />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading dashboard data
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Dashboard Overview
        </h1>
        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <DropdownControl
            control={control}
            name="timePeriod"
            options={timePeriodOptions}
            label="Time Period"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(data?.revenueAnalytics?.totalRevenue || 0)}
          percentage={data?.revenueAnalytics?.changes?.revenue}
          caption="since last period"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Sales"
          value={data?.orderAnalytics?.totalSales || 0}
          percentage={data?.orderAnalytics?.changes?.sales}
          caption="since last period"
          icon={<BarChart2 className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Interactions"
          value={data?.interactionAnalytics?.totalInteractions || 0}
          percentage={0}
          caption="all interactions"
          icon={<LineChart className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Users"
          value={data?.userAnalytics?.totalUsers || 0}
          percentage={data?.userAnalytics?.changes?.users}
          caption="since last period"
          icon={<Users className="w-5 h-5" />}
        />
      </div>
      <AreaChartComponent
        title="Revenue Trends"
        data={data?.revenueAnalytics?.monthlyTrends?.revenue || []}
        categories={data?.revenueAnalytics?.monthlyTrends?.labels || []}
        color="#22c55e"
        percentageChange={data?.revenueAnalytics?.changes?.revenue}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard
          title="Top Products"
          viewAllLink="/shop"
          items={topItems}
          itemType="product"
        />
        <BarChartComponent
          title="Sales by Product"
          data={salesByProduct.data}
          categories={salesByProduct.categories}
          color="#4CAF50"
        />
      </div>
    </div>
  );
};

export default Dashboard;
