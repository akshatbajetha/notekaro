import { Todo } from "@prisma/client";

interface EmailTemplateProps {
  todos: Todo[];
  userName: string;
}

export const TodoReminderTemplate = ({
  todos,
  userName,
}: EmailTemplateProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#333", textAlign: "center" }}>
        Your Upcoming Todos
      </h1>
      <p style={{ color: "#666", fontSize: "16px" }}>Hello {userName},</p>
      <p style={{ color: "#666", fontSize: "16px" }}>
        Here are your upcoming todos for tomorrow:
      </p>

      <div style={{ marginTop: "20px" }}>
        {todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "5px",
            }}
          >
            <h3 style={{ margin: "0", color: "#333" }}>{todo.title}</h3>
            {todo.dueDate && (
              <p style={{ margin: "5px 0", color: "#666" }}>
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      <p style={{ color: "#666", fontSize: "16px", marginTop: "20px" }}>
        Don&apos;t forget to check your NoteKaro app for more details!
      </p>
    </div>
  );
};
