import {BubbleMenuItem} from "../../types.ts";
// import {t} from "i18next";
import {InnerEditor} from "../../../../core/AiEditor.ts";
import {AiModelManager} from "../../../../ai/AiModelManager.ts";
import {AiClient} from "../../../../ai/core/AiClient.ts";
import {Instance} from "tippy.js";
import {AzureOpenaiModelConfig} from "../../../../ai/azure/AzureOpenaiModelConfig.ts";

type Holder = {
    editor?: InnerEditor,
    translatePanelInstance?: Instance,
    tippyInstance?: Instance,
    aiClient?: AiClient
}

class AsyncHTTPClient {
    async post(url: string, jsonData: any, headers?: any): Promise<any> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`HTTP request failed: ${error}`);
            return {};
        }
    }
}

class AIToolsClient {
    private client: AsyncHTTPClient;
    private apiKey: string | undefined;
    private grammarlyApiKey: string | undefined;

    constructor(apiKey: string, grammarlyApiKey?: string) {
        this.client = new AsyncHTTPClient();
        this.apiKey = apiKey;
        this.grammarlyApiKey = grammarlyApiKey;
    }

    async humanizeText(content: string, strength: string = "Balanced", purpose: string = "General Writing", readability: string = "University"): Promise<string> {
        const url = "https://humanize.undetectable.ai/submit";
        const headers = {
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
        };
        const payload = {
            content,
            strength,
            purpose,
            readability
        };

        try {
            const submitResponse = await this.client.post(url, payload, headers);
            const docId = submitResponse.id;
            if (!docId) {
                return "Error: Failed to submit content for humanization.";
            }

            const documentPayload = { id: docId };
            const documentUrl = "https://humanize.undetectable.ai/document";

            const timeout = 60 * 1000; // 1 minutes in milliseconds
            const pollingInterval = 5000; // 5 seconds in milliseconds
            const startTime = Date.now();

            while (true) {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime > timeout) {
                    return "Error: Timed out waiting for the output.";
                }

                const documentResponse = await this.client.post(documentUrl, documentPayload, headers);
                const output = documentResponse.output;
                if (output) {
                    return output;
                }

                await new Promise(resolve => setTimeout(resolve, pollingInterval));
            }

        } catch (error) {
            return `Error: Unable to humanize text - ${error}`;
        }
    }

    async gammerlyText(content: string) {
        const url = "https://api.dify.ai/v1/workflows/run"
        const key = this.grammarlyApiKey;

        const headers = {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
        };

        const data = {
            inputs: {
                Para: content
            },
            response_mode: "blocking",
            user: "edutop"
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                return '';
                // throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.data.status === 'succeeded') {
                // 请求成功
                const refinedArticle = responseData.data.outputs['Refined Article'] || '';

                let grammarText = '';
                const contextMatch = refinedArticle.match(/<context>(.*?)<\/context>/s);
                if (contextMatch) {
                    grammarText = contextMatch[1].trim();
                } else {
                    grammarText = refinedArticle.trim();
                }
                return grammarText;
            } else {
                return '';
            }
        } catch (e) {
            console.error(`取纠正语法后的文本内容失败: ${e}`);
            return '';
        }
    }
}

let aiToolsClient: AIToolsClient | null = null;

async function getAiToolsClient(apiKey: string, grammarlyApiKey: string): Promise<AIToolsClient> {
    if (!aiToolsClient) {
        aiToolsClient = new AIToolsClient(apiKey, grammarlyApiKey);
    }
    return aiToolsClient;
}

const startChat = async (holder: Holder) => {
    if (holder.aiClient) {
        holder.aiClient.stop();
    } else {
        const { selection, doc } = holder.editor!.state;
        const selectedText = doc.textBetween(selection.from, selection.to);

        const aiModel = AiModelManager.get("auto");
        const config = aiModel.aiModelConfig as AzureOpenaiModelConfig;

        const grammarlyApiKey = config.difyGrammarlyApiKey ? config.difyGrammarlyApiKey :"";
        let content: string | null = null;
        if (config.undetectableApiKey) {
            const aiToolsClient = await getAiToolsClient(config.undetectableApiKey,grammarlyApiKey);
            // 仿人类写作
            const humanizedText = await aiToolsClient.humanizeText(selectedText);
            // console.log("humanizedText:",humanizedText);
            if(humanizedText.startsWith("Error:")){
                content = humanizedText;
            }
            else{
                // dify 语法纠正
                const garmmarlyText = await aiToolsClient.gammerlyText(humanizedText);
                // console.log("garmmarlyText:",garmmarlyText);
                content = garmmarlyText ? garmmarlyText:humanizedText;
            }

            let parameter="";
            const prompt = `请帮我把以下内容删除多余的空格。注意：只需要删除多余的空格，内容不需要做任何修改！您需要删除多余的空格的内容是：\n${content}`
            if (aiModel) {
                aiModel.chat(selectedText, prompt, parameter, {
                    onStart(aiClient) {
                        holder.aiClient = aiClient;
                    },
                    onStop() {
                        holder.aiClient = undefined;
                    },
                    onMessage(message) {
                        holder.editor?.commands.insertContent(message.content);
                    }
                })
            }
        } else {
            console.error("humanize api key not found");
        }
    }
}

export const Humanize = {
    id: "humanize",
    title: "humanize",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.4668 8.69379L20.7134 8.12811C21.1529 7.11947 21.9445 6.31641 22.9323 5.87708L23.6919 5.53922C24.1027 5.35653 24.1027 4.75881 23.6919 4.57612L22.9748 4.25714C21.9616 3.80651 21.1558 2.97373 20.7238 1.93083L20.4706 1.31953C20.2942 0.893489 19.7058 0.893489 19.5293 1.31953L19.2761 1.93083C18.8442 2.97373 18.0384 3.80651 17.0252 4.25714L16.308 4.57612C15.8973 4.75881 15.8973 5.35653 16.308 5.53922L17.0677 5.87708C18.0555 6.31641 18.8471 7.11947 19.2866 8.12811L19.5331 8.69379C19.7136 9.10792 20.2864 9.10792 20.4668 8.69379ZM2 4C2 3.44772 2.44772 3 3 3H14V5H4V19H20V11H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM7 8H17V11H15V10H13V14H14.5V16H9.5V14H11V10H9V11H7V8Z"></path></svg>`,
    onClick: ({innerEditor}) => {
        // innerEditor.chain().toggleBold().run();
        const holder: Holder = {editor: innerEditor};
        startChat(holder);
    }
} as BubbleMenuItem