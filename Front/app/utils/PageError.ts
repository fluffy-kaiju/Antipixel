export const PageError = {
    notFound: () => {
        const statusText = "Page Not Found";
        console.error(statusText);
        return createError({ status: 404, statusText });
    },
    badAntipixelId: (badInput: unknown) => {
        const statusText = `Invalid Antipixel ID Format [${badInput}]`;
        console.error(statusText);
        return createError({
            status: 400,
            statusText,
        });
    },
} as const;
