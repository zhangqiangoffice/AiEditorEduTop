import {AiClient} from "../core/AiClient.ts";
import {AiMessageListener} from "../core/AiMessageListener.ts";
import {AiModel} from "../core/AiModel.ts";
import {AiGlobalConfig} from "../AiGlobalConfig.ts";
import {AzureOpenaiModelConfig} from "./AzureOpenaiModelConfig.ts"; // 假设你有一个 AzureModelConfig 文件
import {AzureSseClient} from "../core/client/sse/AzureSseClient.ts";
import {InnerEditor} from "../../core/AiEditor.ts";

export class AzureOpenaiAiModel extends AiModel {

    constructor(editor: InnerEditor, globalConfig: AiGlobalConfig) {
        super(editor, globalConfig, "azure");
        this.aiModelConfig = {
            endpoint: "https://edutop.openai.azure.com",
            model: "GPT4O", // 假设 Azure 也提供这个模型
            ...globalConfig.models["azure"]
        } as AzureOpenaiModelConfig;
    }

    createAiClient(url: string, listener: AiMessageListener): AiClient {
        const config = this.aiModelConfig as AzureOpenaiModelConfig;
        return new AzureSseClient({
            url,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "api-key": config.apiKey, // Azure 的 API Key 认证方式
            }
        }, {
            onStart: listener.onStart,
            onStop: listener.onStop,
            onMessage: (bodyString: string) => {
                const message = JSON.parse(bodyString) as any;
                //console.log("message:",message);
                if (!message.choices.length) {
                    //Azure返回的第一个message没有finish_reason字段
                    return;
                }

                listener.onMessage({
                    status: message.choices[0].finish_reason === "stop" ? 2 : 1,
                    role: "assistant",
                    content: message.choices[0].delta?.content || "",
                    index: message.choices[0].index,
                });
                // 通知 ai 消费情况
                if (this.globalConfig.onTokenConsume && message.choices[0].usage?.["total_tokens"]) {
                    this.globalConfig.onTokenConsume(this.aiModelName, this.aiModelConfig!, message.choices[0].usage["total_tokens"]);
                }
            }
        });
    }

    wrapPayload(prompt: string) {
        const config = this.aiModelConfig as AzureOpenaiModelConfig;
        const payload = {
            "model": config.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            "stream": true
        };
        return JSON.stringify(payload);
    }

    createAiClientUrl(): string {
        const config = this.aiModelConfig as AzureOpenaiModelConfig;
        return `${config.endpoint}/openai/deployments/${config.model}/chat/completions?api-version=2024-08-01-preview`;
    }
}
//https://edutop.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview
//https://edutop.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview
