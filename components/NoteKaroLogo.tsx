import Link from "next/link";

function NoteKaroLogo() {
  return (
    <Link
      href={"/"}
      className="relative flex pb-1 items-end h-full w-full text-neutral-700 dark:text-neutral-300 mr-5"
    >
      <h1 className="text-2xl font-bold tracking-tight">NoteKaro</h1>
    </Link>
  );
}
export default NoteKaroLogo;
