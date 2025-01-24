/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ConfigContextType } from "context/config-context";
import { getRequestSignature } from "../utils";

// A variable to store the Axios instance globally
let axiosInstance: AxiosInstance = axios.create(); // Default to a basic Axios instance

// Function to set the Axios instance globally
const setAxiosInstance = (config: ConfigContextType) => {
    if (config.axiosInstance) {
        axiosInstance = config.axiosInstance;
    } else {
        axiosInstance.defaults.baseURL = config.baseURL;
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${config.token}`;
        axiosInstance.interceptors.request.use((request) => {
            const uri = request.url;
            const mainUrl = String(`/v1${uri?.split("?")[0]}`);
            const { timeStamp, signature } = getRequestSignature({
                url: mainUrl,
                publicKey: config?.publicKey || "",
                clientId: config?.clientId || "",
            });
            request.headers["x-signature"] = signature;
            request.headers["x-timestamp"] = timeStamp;
            return request;
        });
    }
};

// Function to get the Axios instance globally
const getAxiosInstance = (): AxiosInstance => {
    return axiosInstance;
};

type APIResponse<T = unknown> = AxiosResponse<{
    message: string;
    status: string;
    data: T;
}>;

type APIError<T = unknown> = AxiosError<{
    message: string;
    status: string;
    data?: T;
}>;

export { setAxiosInstance, getAxiosInstance, APIResponse, APIError };
