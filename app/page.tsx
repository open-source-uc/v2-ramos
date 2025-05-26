import { ServerAPIClient } from "./api/RPC";
import CourseCard from "./components/CourseCard";
import Header from "./components/Header";

type SearchParams = Promise<{ page?: number }>;
export default async function page({ searchParams }: { searchParams: SearchParams }) {
  const res = await ServerAPIClient.course.$get({
    query: {
      start_promedio: "2",
    },
  });

  if (!res.ok) {
    return <div>Failed to load</div>;
  }

  const data = await res.json();

  return (
    <>
      <Header />
      <section className="flex w-full flex-wrap justify-center gap-5">
        {data.courses.map((course, index) => (
          <CourseCard course={course} key={index} />
        ))}
      </section>
    </>
  );
}

export const runtime = "edge";
