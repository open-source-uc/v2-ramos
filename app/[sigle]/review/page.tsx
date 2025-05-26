import { ServerAPIClient } from "@/app/api/RPC";

import Criticar from "./criticar";

type Params = Promise<{ sigle: string }>;

export default async function page({ params }: { params: Params }) {
  const p = await params;
  const res = await ServerAPIClient.course.sigle[":sigle"].$get({
    param: {
      sigle: p.sigle,
    },
  });

  if (res.status !== 200) {
    return <div>Failed to load</div>;
  }

  const data = await res.json();

  return (
    <section>
      <Criticar course={data.course} />
    </section>
  );
}
