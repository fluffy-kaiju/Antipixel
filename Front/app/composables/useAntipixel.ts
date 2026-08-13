import { z } from "zod";
import { AntipixelSchema } from "~/types/antipixels";

export const useAntipixel = () => {
    const fetchAntipixels = (limit?: number, offset?: number) => {
        return useAPI("/antipixel", {
            transform: (rawData: unknown) => {
                const parsed = z
                    .array(AntipixelSchema)
                    .safeParse(rawData);

                if (!parsed.success) {
                    throw parsed.error;
                }
                return parsed.data;
            },
        });
    };

    return {
        fetchAntipixels,
    };
};
