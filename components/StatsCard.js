export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}