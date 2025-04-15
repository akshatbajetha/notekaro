function Sidebar({ width }: { width: number }) {
  return (
    <div
      className="w-60 border-2 h-full flex justify-center items-center"
      style={{
        width: `${width}px`,
        minWidth: "150px",
        maxWidth: "600px",
      }}
    >
      Sidebar
    </div>
  );
}
export default Sidebar;
