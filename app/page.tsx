import AsciiFooter from "./AsciiFooter";
import ChrisPriggFlower from "./ChrisPriggFlower";

export default function Home() {
  return (
    <div className="chris-prigg-stage flex flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center p-6">
        <ChrisPriggFlower />
      </main>
      <AsciiFooter />
    </div>
  );
}
