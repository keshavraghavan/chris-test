import AsciiFooter from "./AsciiFooter";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 items-center justify-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Chris welcome to vibe coding
        </h1>
      </main>
      <AsciiFooter />
    </div>
  );
}
