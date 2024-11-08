import {AiModelConfig} from "../core/AiModelConfig.ts";

export interface AzureOpenaiModelConfig extends AiModelConfig {
    endpoint?: string,
    apiKey: string,
    model?: string,
    undetectableApiKey?: string
}
