function page() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-medium">Welcome to Your Taskboard</h2>
        <p className="text-gray-400">
          Select a todo list from the sidebar or create a new one
        </p>
      </div>
    </div>
  );
}

export default page;
