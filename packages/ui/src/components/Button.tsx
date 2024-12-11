export default async function Button({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return (
        <button
            onClick={async () => {
                "use server"

                console.log("this is on the server!")
            }}
        >
            {children}
        </button>
    )
}
