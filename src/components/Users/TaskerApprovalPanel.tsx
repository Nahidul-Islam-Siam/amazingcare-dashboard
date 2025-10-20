// components/TaskerApprovalPanel.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActiveTasker {
  driverId: string;
  driverName: string;
  joiningDate: string;
}

interface PendingTasker {
  driverId: string;
  driverName: string;
}

export default function TaskerApprovalPanel({
  activeTaskers,
  pendingTaskers,
}: {
  activeTaskers: ActiveTasker[];
  pendingTaskers: PendingTasker[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Active Taskers */}
      <Card className="rounded-[12px] border bg-white p-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Tasker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Driver ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Driver Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Joining Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeTaskers.map((tasker, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{tasker.driverId}</td>
                    <td className="py-3 px-4 text-gray-900">{tasker.driverName}</td>
                    <td className="py-3 px-4 text-gray-900">{tasker.joiningDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Taskers */}
      <Card className="rounded-[12px] border bg-yellow-50 p-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Pending Taskers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Driver ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Driver Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {pendingTaskers.map((tasker, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{tasker.driverId}</td>
                    <td className="py-3 px-4 text-gray-900">{tasker.driverName}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
