/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
    useMutation,
    UseMutationOptions,
    useQuery,
    UseQueryOptions,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CollectionStatus } from "utils/enums";
import { CollectionProps } from "utils/types";
import { APIError, APIResponse, getAxiosInstance } from "./axios-instance";
import { triggerGlobalError } from "./error-handler";

// Create Issue
interface CreateIssueParams {
    content: string;
    collection: string;
    password: string;
    attachments: Array<string>;
}

interface CreateIssueResponse {
    name: string;
    url: string;
    _id: string;
}

const postCreateIssue = (
    params: CreateIssueParams
): Promise<CreateIssueResponse> => {
    const axios = getAxiosInstance();
    return axios.post(`/issue`, params);
};

const usePostCreateIssue = () => {
    const appDataOptions: UseMutationOptions<
        CreateIssueResponse,
        APIError,
        CreateIssueParams
    > = {
        mutationFn: postCreateIssue,
        onError: (err) => {
            triggerGlobalError(err.response?.data?.message as string);
        },
    };

    return useMutation(appDataOptions);
};

// Submit Defense
interface SubmitDefenseParams {
    issueId: string;
    content: string;
    attachments: Array<string>;
}

interface SubmitDefenseResponse {
    name: string;
    url: string;
    _id: string;
}

const postSubmitDefense = ({
    issueId,
    content,
    attachments,
}: SubmitDefenseParams): Promise<SubmitDefenseResponse> => {
    const axios = getAxiosInstance();
    return axios.post(`/issue/${issueId}/defense`, { content, attachments });
};

const useSubmitIssue = () => {
    const appDataOptions: UseMutationOptions<
        SubmitDefenseResponse,
        APIError,
        SubmitDefenseParams
    > = {
        mutationFn: postSubmitDefense,
        onError: (err) => {
            triggerGlobalError(err.response?.data?.message as string);
        },
    };

    return useMutation(appDataOptions);
};

// Get Issue

interface GetIssueParams {
    issueId: string;
    enabled?: boolean;
    retry?: number;
}

type GetIssueResponse = APIResponse<{
    _id: string;
    data: {
        name: string;
        description: string;
        createdAt: string;
        deliveryDate: string;
        usdExpectedAmount: string;
        status: CollectionStatus;
        collections: CollectionProps[];
    };
    plaintiff: {
        firstName: string;
        lastName: string;
        profileImage: {
            url: string;
            name: string;
        };
        profile: {
            bio: {
                title: string;
            };
        };
    };
    defender: {
        firstName: string;
        lastName: string;
        profileImage: {
            url: string;
            name: string;
        };
    };
    status: string;
    createdAt: string;
    updatedAt: string;
    issue: {
        content: string;
        attachments: { url: string; name: string; _id: string }[];
    };
    defense: {
        content: string;
        attachments: { url: string; name: string; _id: string }[];
    };
}>;

const getIssue = ({ issueId }: GetIssueParams): Promise<GetIssueResponse> => {
    const axios = getAxiosInstance();
    return axios.get(`/issue/${issueId}`);
};

const useGetIssue = ({ issueId, enabled, retry = 3 }: GetIssueParams) => {
    const appDataOptions: UseQueryOptions<GetIssueResponse, APIError> = {
        queryFn: () => getIssue({ issueId }),
        queryKey: ["issue", issueId],
        enabled: enabled ?? Boolean(issueId),
        retry,
    };

    return useQuery(appDataOptions);
};

// Get Issue Invite

interface GetIssueInviteParams {
    issueId: string;
    enabled?: boolean;
    retry?: number;
}

type GetIssueInviteResponse = APIResponse<{
    _id: string;
    status: string;
    issueId: string;
}>;

const getIssueInvite = ({
    issueId,
}: GetIssueInviteParams): Promise<GetIssueInviteResponse> => {
    const axios = getAxiosInstance();
    return axios.get(`/issue/${issueId}/invite`);
};

const useGetIssueInvite = ({
    issueId,
    enabled,
    retry = 3,
}: GetIssueInviteParams) => {
    const appDataOptions: UseQueryOptions<GetIssueInviteResponse, APIError> = {
        queryFn: () => getIssueInvite({ issueId }),
        queryKey: ["issue-invite", issueId],
        enabled: enabled ?? Boolean(issueId),
        retry,
    };

    return useQuery(appDataOptions);
};

// Jury Accept Invite
interface AcceptJuryInviteParams {
    issueId: string;
}

interface AcceptJuryInviteResponse {
    name: string;
    url: string;
    _id: string;
}

const postAcceptJuryInvite = ({
    issueId,
}: AcceptJuryInviteParams): Promise<AcceptJuryInviteResponse> => {
    const axios = getAxiosInstance();
    return axios.post(`/issue/${issueId}/jury/accept`, {});
};

const useAcceptJuryInvite = () => {
    const appDataOptions: UseMutationOptions<
        AcceptJuryInviteResponse,
        APIError,
        AcceptJuryInviteParams
    > = {
        mutationFn: postAcceptJuryInvite,
        onError: (err) => {
            triggerGlobalError(err.response?.data?.message as string);
        },
    };

    return useMutation(appDataOptions);
};

// Jury Decline Invite
interface DeclineJuryInviteParams {
    issueId: string;
}

interface DeclineJuryInviteResponse {
    name: string;
    url: string;
    _id: string;
}

const postDeclineJuryInvite = ({
    issueId,
}: DeclineJuryInviteParams): Promise<DeclineJuryInviteResponse> => {
    const axios = getAxiosInstance();
    return axios.post(`/issue/${issueId}/jury/decline`, {});
};

const useDeclineJuryInvite = () => {
    const appDataOptions: UseMutationOptions<
        DeclineJuryInviteResponse,
        APIError,
        DeclineJuryInviteParams
    > = {
        mutationFn: postDeclineJuryInvite,
        onError: (err) => {
            triggerGlobalError(err.response?.data?.message as string);
        },
    };

    return useMutation(appDataOptions);
};

// Jury Submit Verdict
interface SubmitVerdictParams {
    verdict: string;
    comment: string;
    issueId: string;
}

const submitVerdict = ({
    verdict,
    comment,
    issueId,
}: SubmitVerdictParams): Promise<APIResponse> => {
    const axios = getAxiosInstance();
    return axios.post(`/issue/${issueId}/jury`, { verdict, comment });
};

const useSubmitVerdict = () => {
    const appDataOptions: UseMutationOptions<
        APIResponse,
        APIError,
        SubmitVerdictParams
    > = {
        mutationFn: submitVerdict,
        onError: (err) => {
            triggerGlobalError(err.response?.data?.message as string);
        },
    };

    return useMutation(appDataOptions);
};

export {
    usePostCreateIssue,
    useGetIssue,
    useGetIssueInvite,
    useSubmitIssue,
    useAcceptJuryInvite,
    useDeclineJuryInvite,
    useSubmitVerdict,
};
