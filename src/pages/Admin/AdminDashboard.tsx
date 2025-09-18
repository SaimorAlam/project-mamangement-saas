import { CustomerInsights } from "@/components/admin/customerInsight/customerInsight"
import { MetricsCards } from "@/components/admin/metricsCards/metricsCards"

const AdminDashboard = () => {
  return (
    <>
      <MetricsCards />
      <CustomerInsights />
    </>
  )
}

export default AdminDashboard