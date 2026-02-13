import { useGetProfileQuery } from "@/store/Api/UserApi/UserApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Globe,
  Shield,
  User,
} from "lucide-react";

export default function ProfilePage() {
  const { data: profileData, isLoading, error } = useGetProfileQuery({});

  const user = profileData?.data;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load profile data. Please try again later.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Profile Header */}
      <Card className="border-none  bg-linear-to-r from-blue-50 to-indigo-50">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-8">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={user.profileImage || ""} alt={user.name} />
            <AvatarFallback className="text-2xl bg-blue-600 text-white">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm font-medium bg-white text-blue-600 shadow-xs"
              >
                {user.role}
              </Badge>
              <Badge
                variant={
                  user.userStatus === "ACTIVE" ? "default" : "destructive"
                }
                className={`px-3 py-1 text-sm font-medium text-white ${
                  user.userStatus === "ACTIVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }`}
              >
                {user.userStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card className=" border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-blue-500" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900 font-medium">
                  {user.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <Globe className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Language & Timezone
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-gray-700">
                    {user.language}
                  </Badge>
                  {user.timezone && (
                    <Badge variant="outline" className="text-gray-700">
                      {user.timezone}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-indigo-500" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Joined Date</p>
                <p className="text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-pink-100 rounded-full text-pink-600">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Last Active</p>
                <p className="text-gray-900">{formatDate(user.lastActive)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-teal-100 rounded-full text-teal-600">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Security</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-sm ${user.verification2FA ? "text-green-600" : "text-gray-500"}`}
                  >
                    2FA: {user.verification2FA ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
