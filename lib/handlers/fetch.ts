import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";
import { ActionResponse } from "@/types/global";

interface FetchOptions extends RequestInit {
    timeOut?: number;
}

function isError(error: unknown): error is Error {
    return error instanceof Error;
}

export async function fetchHandler<T>(
    url: string,
    options: FetchOptions = {}
): Promise<ActionResponse<T>> {
    const {
        timeOut = 5000,
        headers: customHeaders = {},
        ...restOptions
    } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeOut);

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
    const config: RequestInit = {
        ...restOptions,
        headers,
        signal: controller.signal,
    };

    try {
        const response = await fetch(url, config);

        clearTimeout(id);

        if (!response.ok) {
            throw new RequestError(
                response.status,
                `HTTP Error: ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        const newError = isError(error) ? error : new Error("Unknown Error");

        if (newError.name === "AbortError") {
            logger.warn(`Request to ${url} timed out`);
        } else {
            logger.error(`Error fetching ${url}: ${newError.message}`);
        }

        return handleError(error, "api") as ActionResponse<T>;
    }
}
