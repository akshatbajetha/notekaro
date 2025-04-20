async function page({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen flex justify-center items-center">
      Main Content
    </div>
  );
}
export default page;

/* TODO: Collapsible sections, basically a section header which contains todos, every section has an add task button, and an add task button at the top, Draggable tasks to reorder or change sections, delete and edit button in front of every todo Option menu in front of section to edit name and delete
      
Every add task can have Date, priority level, and by defaulted completed is false
*/

/* 
TODO: First start with basic things, 
A top add task button,
On click, open a input section and A few dummy buttons Date and Priority below it,
On the bottom right cancel and Add task button
*/
