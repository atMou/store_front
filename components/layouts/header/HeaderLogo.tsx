function HeaderLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="text-xl font-black tracking-tight bg-linear-to-r from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
          F@ke
        </span>
        <span className="text-xl font-black tracking-tight text-gray-800">
          Lando
        </span>
      </div>
      <div className="h-6 w-1 bg-linear-to-b from-orange-500 to-yellow-500 rounded-full"></div>
      <span className="text-xs mt-1 font-semibold text-gray-500 uppercase tracking-wider">
        Fashion
      </span>
    </div>
  );
}

export default HeaderLogo;
