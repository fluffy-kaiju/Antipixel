export const useAPI = createUseFetch({
    baseURL: "http://localhost:3000",
    onRequest({ request, options, error }) {
        const token = useCookie<string | undefined>("auth_token");
        if (token?.value) {
            options.headers.set("Authorization", `Bearer ${token.value}`);
        }
    },
});
