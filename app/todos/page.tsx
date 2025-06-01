function page() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="md:text-4xl text-3xl font-bold">
          Welcome to Your{" "}
          <span className="text-green-600 dark:text-green-400">Taskboard</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Select a todo list from the sidebar or create a new one
        </p>
      </div>
    </div>
  );
}

export default page;
