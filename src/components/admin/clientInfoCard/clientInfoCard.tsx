import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

const clientInfoCard = () => {
    return (
        <Card className="border border-gray-200 h-44">
            <CardContent className="">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                        {`${}`}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Total User</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {metrics.totalUsers.current}/{metrics.totalUsers.total}
                        </p>
                    </div>
                </div>
                <div className="mt-8 bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-700">{metrics.totalUsers.percentage}% of capacity used</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default clientInfoCard