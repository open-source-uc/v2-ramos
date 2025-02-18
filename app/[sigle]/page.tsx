import { ServerAPIClient } from "../api/RPC";
import CourseInfo from "../components/CourseInfo";

type Params = Promise<{ sigle: string }>;
export default async function page({ params }: { params: Params }) {
  const p = await params;
  const sigle = p.sigle;

  const res = await ServerAPIClient.course.sigle[":sigle"].$get({
    param: {
      sigle: sigle,
    },
  });

  if (!res.ok) {
    return <div>Failed to load</div>;
  }
  const data = await res.json();

  return <CourseInfo course={data.course} />;
}

export const runtime = "edge";
