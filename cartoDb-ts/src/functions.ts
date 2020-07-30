import { CartoDbConfig } from "./models/config-interface";

export async function http<T>(url: string): Promise<T> {
    const response = await fetch(url);
    const body =  await response.json();
    console.log(body)
    return body;
}

export async function getClientConfig(configUrl: string) :Promise<CartoDbConfig> {
    const response = await http<CartoDbConfig>(configUrl);
    return response;
}