import { SeverAPIClient } from "../api/RPC";

type Params = Promise<{ sigle: string }>;
export default async function page({ params }: { params: Params }) {
  const p = await params;
  const sigle = p.sigle;

  const res = await SeverAPIClient.course.sigle[":sigle"].$get({
    param: {
      sigle: sigle,
    },
  });

  if (!res.ok) {
    console.log(res);
    return <div>Failed to load</div>;
  }
  const data = await res.json();

  return <h1>{data.course.name}</h1>;
}

export const runtime = 'edge';