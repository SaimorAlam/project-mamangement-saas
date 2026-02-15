import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StaffMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
    role: string;
  };
}

interface AssignedStaffAvatarsProps {
  manager?: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      profileImage: string | null;
      role: string;
    };
  };
  employees?: StaffMember[];
  viewers?: StaffMember[];
  maxVisible?: number;
}

export function AssignedStaffAvatars({
  manager,
  employees = [],
  viewers = [],
  maxVisible = 3,
}: AssignedStaffAvatarsProps) {
  console.log({ manager, employees, viewers });
  // Combine all staff in order: Manager, Employees, Viewers
  const allStaff: Array<{
    id: string;
    name: string;
    profileImage: string | null;
    role: string;
  }> = [];

  // Add manager first
  if (manager?.user) {
    allStaff.push({
      id: manager.id,
      name: manager.user.name,
      profileImage: manager.user.profileImage,
      role: manager.user.role,
    });
  }

  // Add employees
  employees.forEach((emp) => {
    if (emp.user) {
      allStaff.push({
        id: emp.id,
        name: emp.user.name,
        profileImage: emp.user.profileImage,
        role: emp.user.role,
      });
    }
  });

  // Add viewers
  viewers.forEach((viewer) => {
    if (viewer.user) {
      allStaff.push({
        id: viewer.id,
        name: viewer.user.name,
        profileImage: viewer.user.profileImage,
        role: viewer.user.role,
      });
    }
  });

  const visibleStaff = allStaff.slice(0, maxVisible);
  const remainingCount = Math.max(0, allStaff.length - maxVisible);

  if (allStaff.length === 0) {
    return <span className="text-xs text-gray-500">No staff assigned</span>;
  }
  console.log(allStaff);
  return (
    <div className="flex items-center -space-x-2">
      {visibleStaff.map((staff) => (
        <Avatar
          key={staff.id}
          className="h-8 w-8 border-2 border-white ring-1 ring-gray-200"
          title={`${staff.name} (${staff.role})`}
        >
          <AvatarImage src={staff.profileImage || undefined} alt={staff.name} />
          <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-semibold">
            {staff.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div
          className="h-8 w-8 rounded-full bg-blue-50 border-2 border-white ring-1 ring-gray-200 flex items-center justify-center"
          title={`+${remainingCount} more staff members`}
        >
          <span className="text-[10px] font-semibold text-blue-600">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}
