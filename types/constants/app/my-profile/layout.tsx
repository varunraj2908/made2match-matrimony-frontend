export default function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <ul className="space-y-3">
          <li>
            <a href="/my-profile/edit">Edit Profile</a>
          </li>
          <li>
            <a href="/my-profile/matches">Matches</a>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}