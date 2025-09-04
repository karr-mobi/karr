import type { AnyFieldApi } from "@tanstack/react-form"

export function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <p className="mt-2 text-red-800 text-sm">
                    {field.state.meta.errors
                        .map((error) => error.message)
                        .join(", ")}
                </p>
            ) : null}
            {field.state.meta.isValidating ? (
                <p className="text-sm">Validating...</p>
            ) : null}
        </>
    )
}
