import { createReview } from "@/app/actions/reviews";
import ReviewForm from "@/app/components/forms/ReviewForm";
import { useActionState } from "react";

type Params = Promise<{ sigle: number }>;


export default async function Page({ params }: { params: Params }) {
    const p = await params;
    const [state, action] = useActionState(createReview, {
        errors: 0,
        success: 0,
        message: "",
        data: {
            course_id: p.sigle,
            year: 2025,
            section_number: 1,
            liked: false,
            comment: "",
            estimated_credits: 0,
        }
    })

    return (
        <section>
            <ReviewForm action={action} state={state}>

            </ReviewForm>
        </section>
    )

}

export const runtime = "edge";