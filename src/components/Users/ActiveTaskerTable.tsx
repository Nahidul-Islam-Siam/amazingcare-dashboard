import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActiveTasker {
  driverId: string;
  driverName: string;
  joiningDate: string;
}

export default function ActiveTaskerTable({ activeTaskers }: { activeTaskers: ActiveTasker[] }) {
  return (
    <Card className="rounded-[12px] border border-gray-200  bg-[rgba(211,202,157,0.10)] p-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900">Active Tasker</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Driver ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Driver Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Joining Date</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {activeTaskers.map((tasker, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
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
  );
}
