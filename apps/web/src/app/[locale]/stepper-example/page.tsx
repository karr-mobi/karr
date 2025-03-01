import { Stepper } from "@karr/ui/components/stepper"

import Loading from "@/components/Loading"

export default function StepperExample() {
    return (
        <div className="mt-12 ">
            <Loading />

            <Stepper className="mt-12">
                <div>Step 1</div>
                <div>Step 2</div>
                <div>
                    Super wide step
                    <br />
                    Steeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeooeeeeeeeeeeeeeeeeeeeeeeeep
                    <br />
                    Step 3
                </div>
                <div>Step 4</div>
                <div>
                    Super tall step
                    <br />
                    <br />
                    Step 5
                </div>
                <div>Step 6</div>
                <div>Step 7</div>
                <div>Step 8</div>
            </Stepper>
        </div>
    )
}
