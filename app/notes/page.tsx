"use client";
import { FormEvent } from "react";

function page() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");

    const response = fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log((await response).json());
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Submit</button>
    </form>
  );
}
export default page;
