import SinglePageGame from "@/components/single-page-game";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <SinglePageGame />
      </div>
    </div>
  );
}
