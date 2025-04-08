import { Stepper } from "@karr/ui/components/stepper"
import { Marquee } from "@karr/ui/components/marquee"

import Loading from "@/components/Loading"

export default function StepperExample() {
    return (
        <div className="mt-12 ">
            <Loading />

            <div className="flex flex-col gap-4 my-4">
                <Marquee
                    baseVelocity={-3}
                    direction="left"
                    className="bg-green-500 text-white py-2"
                >
                    Karr is very cool
                </Marquee>

                <Marquee
                    baseVelocity={-3}
                    direction="right"
                    className="bg-purple-500 text-white py-2"
                >
                    It's made by finxol
                </Marquee>
            </div>

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
