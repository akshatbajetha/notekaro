function page({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen flex justify-center items-center">
      This a TODO List with ID {params.id}
    </div>
  );
}
export default page;
