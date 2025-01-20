/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMutation, UseMutationResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { APIError, getAxiosInstance } from "./axios-instance";

interface UploadImageParams {
    file: File;
    onProgress?: (progress: number) => void;
}

interface UploadImageResponse {
    name: string;
    url: string;
    _id: string;
}

const postUploadImage = async ({
    file,
    onProgress,
}: UploadImageParams): Promise<UploadImageResponse> => {
    const axios = getAxiosInstance();
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            onProgress?.(percentCompleted);
        },
    });
    return res.data.data;
};

const postUploadImages = async (
    uploadParams: UploadImageParams[]
): Promise<UploadImageResponse[]> => {
    const allReqs = [];

    for (let i = 0; i < uploadParams.length; i++) {
        const uploadParam = uploadParams[i];
        if (uploadParam) {
            const { file, onProgress } = uploadParam;
            allReqs.push(postUploadImage({ file, onProgress }));
        }
    }
    const response = await Promise.all(allReqs);
    return response;
};

const useUploadImage = (): UseMutationResult<
    UploadImageResponse,
    APIError,
    UploadImageParams,
    unknown
> => {
    return useMutation({
        mutationFn: postUploadImage,
        mutationKey: ["upload-image"],
        onError: (error: APIError) => {},
    });
};

export { postUploadImage, postUploadImages, useUploadImage };
