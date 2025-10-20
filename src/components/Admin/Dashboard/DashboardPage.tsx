import { DashboardChurchStatsCards } from "./DashboardCards";
import { DashboardUserTable } from "./DashboardUserTable";
import DonationChart from "./DonationChart";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className=" max-w-7xl space-y-6">
        <h1 className="text-xl font-semibold text-gray-800">Church List</h1>

        <DashboardChurchStatsCards/>
        <DonationChart/>
        <DashboardUserTable/>

        {/* <ChurchTable /> */}
      </div>
    </div>
  )
}