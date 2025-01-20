/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
    useMutation,
    UseMutationResult,
    useQuery,
    UseQueryOptions,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { MessageProps } from "utils/types";
import { APIError, APIResponse, getAxiosInstance } from "./axios-instance";

// Get Issue Chat

interface GetChatsParams {
    issueId: string;
    enabled?: boolean;
}

type GetChatsResponse = APIResponse<{
    messages: MessageProps[];
}>;

const getIssue = ({ issueId }: GetChatsParams): Promise<GetChatsResponse> => {
    const axios = getAxiosInstance();
    return axios.get(`/issue/${issueId}/chats`);
};

const useGetChats = ({ issueId, enabled }: GetChatsParams) => {
    const appDataOptions: UseQueryOptions<GetChatsResponse, APIError> = {
        queryFn: () => getIssue({ issueId }),
        queryKey: ["chats", issueId],
        enabled: enabled ?? Boolean(issueId),
    };

    return useQuery(appDataOptions);
};

// Download
const downloadAttachment = (url: string): Promise<void> => {
    const mainUrl = String(url);
    return fetch(mainUrl, { mode: "no-cors" })
        .then(async (response) => {
            return response.blob();
        })
        .then((blob) => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            // eslint-disable-next-line no-useless-escape
            a.download = url.replace(/^.*[\\\/]/, "");
            a.href = url;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        });
};

const useDownloadAttachment = (): UseMutationResult<
    void,
    APIError,
    string,
    unknown
> => {
    return useMutation({
        mutationFn: downloadAttachment,
        mutationKey: ["download-attachment"],
        onError: (error: APIError) => {},
    });
};

export { useGetChats, useDownloadAttachment };
