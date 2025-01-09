import { revalidatePath } from "next/cache"

import { setAppConfig } from "@karr/config"
import { Button } from "@karr/ui/button"

export default function EditConfig() {
    return (
        <>
            <form
                className="mt-12 flex flex-col gap-4"
                action={async (formData: FormData) => {
                    "use server"

                    const name = formData.get("name") as string

                    if (/^[a-z0-9 \-_]+$/i.test(name)) {
                        setAppConfig("APPLICATION_NAME", name)

                        revalidatePath("/")
                    } else {
                        throw new Error("invalid app name")
                    }
                }}
            >
                <label htmlFor="name">App Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter app name"
                />
                <Button type="submit" wide>
                    Save
                </Button>
            </form>
        </>
    )
}
