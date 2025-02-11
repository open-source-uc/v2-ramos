import { SeverAPIClient } from "../api/RPC";

type SearchParams = Promise<{ page?: number }>;
type Params = { sigle: string };
export default async function page({ searchParams, params }: { searchParams: SearchParams, params: Params }) {
    const sigle = params.sigle;

    const res = await SeverAPIClient.course.sigle[":sigle"].$get({
        param: {
            sigle: sigle
        }
    })

    if (!res.ok) {
        console.log(res)
        return <div>Failed to load</div>
    }
    const data = await res.json()

    return (
        <h1>{data.course.name}</h1>
    )
}
