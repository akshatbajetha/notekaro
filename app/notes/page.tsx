function page() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="md:text-4xl text-3xl font-bold">
          Welcome to Your <span className="text-blue-600 ">Workspace</span>
        </h2>
        <p className="text-gray-400 md:text-lg text-base">
          Select a note from the sidebar or create a new one
        </p>
      </div>
    </div>
  );
}

export default page;
