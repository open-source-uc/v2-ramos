import { SeverAPIClient } from "./api/RPC";

type SearchParams = Promise<{ page?: number }>;
export default async function page({ searchParams }: { searchParams: SearchParams }) {
  const res = await SeverAPIClient.course.$get({
    query: {
      start_promedio: "2",
    },
  });

  if (!res.ok) {
    console.log(res);
    return <div>Failed to load</div>;
  }

  const data = await res.json();

  return (
    <>
      <div className="w-full py-5 text-center">
        <h2 className="text-4xl font-extrabold dark:text-white">Ramos UC | Top OFGs</h2>
      </div>
      <section className="flex w-full flex-wrap justify-center gap-5">
        {data.courses.map((course, index) => (
          <article
            key={index}
            className="order flex min-h-[250px] w-full max-w-sm flex-col justify-between gap-3 rounded-lg border-gray-200 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <section>
              <a href="#">
                <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {course.sigle} - {course.name}
                </h4>
              </a>
              <div className="flex list-inside list-disc flex-col text-lg font-semibold text-gray-500 dark:text-gray-400">
                <p>
                  Promedio: <span className="font-bold">{course.promedio === -1 ? "N/A" : course.promedio}</span>
                </p>
                <p>
                  Créditos estimados:{" "}
                  <span className="font-bold">
                    {course.promedio_creditos_est === 0 ? "N/A" : course.promedio_creditos_est}
                  </span>
                </p>
              </div>
            </section>
            <section className="flex items-start justify-between gap-4 text-lg">
              <div>
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Detalles:</h5>
                <ul className="list-inside list-disc text-gray-500 dark:text-gray-400">
                  <li>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Área:</span> {course.area_id}
                  </li>
                  <li>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Créditos:</span> {course.credits}
                  </li>
                  <li>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Escuela:</span> {course.school_id}
                  </li>
                </ul>
              </div>
            </section>
            <section>
              <a
                href={`/${course.sigle}`}
                className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Ver Críticasss
              </a>
            </section>
          </article>
        ))}
      </section>
    </>
  );
}

export const runtime = "edge";
