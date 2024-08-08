"use client";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

export async function apiFetch<T>(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: any): Promise<T> {
  const token = Cookies.get("auth-token");
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  const config: AxiosRequestConfig = {
    url: `${baseURL}${endpoint}`,
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data,
  };

  try {
    const response = await axios.request<ApiResponse<T>>(config);
    return response as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response);
      throw error.response;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}
