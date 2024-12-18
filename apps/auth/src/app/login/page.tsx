import { Button } from "@ui/components"

export default function Login() {
    return (
        <div className="">
            <h1 className="">
                Login to the app
            </h1>

            <Button
                onClick={async () => {
                    "use server"

                    console.log("logging in!")
                }}
            >
                Click me!
            </Button>
        </div>
    )
}
