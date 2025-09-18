import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/ProgressBarCustom"
import { cn } from "@/lib/utils"
import { Eye, Pencil, Trash, } from "lucide-react"


const TableCustomerInsight = ({ customer }) => {
    const statusColors = {
        Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Suspended: "bg-red-100 text-red-700 border-red-200",
        Trial: "bg-yellow-100 text-yellow-700 border-yellow-200",
        Expired: "bg-gray-100 text-gray-600 border-gray-200",
    }

    const alertColors = {
        Critical: "text-red-600",
        Warning: "text-yellow-600",
    }
    return (
        <tr key={customer.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-900">{customer.companyName}</td>
            <td className="px-4 py-3">
                <Badge variant="outline" className="border-blue-600 text-blue-600 rounded-3xl">
                    {customer.plan}
                </Badge>
            </td>
            <td className="px-4 py-3 text-center">{customer.dashboardUpdates}</td>
            <td
                className={cn(
                    "px-4 py-3 text-center font-medium",
                    customer.alertType
                        ? alertColors[customer.alertType as keyof typeof alertColors]
                        : "text-gray-900",
                )}
            >
                {customer.alerts} {customer.alertType}
            </td>
            <td className="px-4 py-3 text-center">{customer.users}</td>
            <td className="px-4 py-3 w-48">
                <ProgressBar value={(customer.storageUsage / customer.storageTotal) * 100} className="h-2 mb-1" />
                <span className="text-xs text-gray-600">
                    {customer.storageUsage}/{customer.storageTotal} Gb
                </span>
            </td>
            <td className="px-4 py-3 text-center">
                <Badge
                    variant="outline"
                    className={cn(
                        "text-xs font-medium w-28 py-1",
                        statusColors[customer.status as keyof typeof statusColors],
                    )}
                >
                    {customer.status}
                </Badge>
            </td>
            <td className="px-4 py-3 flex justify-center gap-3">
                <Eye className="w-4 h-4 text-blue-600 cursor-pointer" />
                <Pencil className="w-4 h-4 text-green-600 cursor-pointer" />
                <Trash className="w-4 h-4 text-red-600 cursor-pointer" />
            </td>
        </tr>
    )
}

export default TableCustomerInsight