import { UserSchema } from "~/types/users";

export const useUser = () => {
    const fetchMe = () => {
        return useAPI("/auth/me", {
            transform: (rawData: unknown) => {
                const parsed = UserSchema.safeParse(rawData);

                if (!parsed.success) {
                    throw parsed.error;
                }
                return parsed.data;
            },
        });
    };

    return {
      fetchMe,
    }
};
