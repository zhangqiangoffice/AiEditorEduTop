import {AiClientListener} from "../../AiClientListener.ts";
import {AiClient} from "../../AiClient.ts";

type SSEConfig = { url: string, method: string, headers?: Record<string, any> }

export class AzureSseClient implements AiClient {
    isStop: boolean = false
    config: SSEConfig;
    fetch?: Response;
    isOpen: boolean = false;
    payload?: string;
    listener: AiClientListener;
    ctrl = new AbortController();

    private buffer: string = ""; // 用于缓存不完整的数据
    private message: object = {}; // 用于检查是否残缺

    constructor(config: SSEConfig, listener: AiClientListener) {
        this.config = config;
        this.listener = listener;
    }


    start(payload: string) {
        this.payload = payload;
        this.onOpen()
        this.listener.onStart(this);
    }

    stop() {
        if (this.fetch) {
            // 取消请求
            this.ctrl.abort();

            if (!this.isStop) {
                this.listener.onStop();
                this.isStop = true;
            }
        }
    }

    async send(payload: string) {
        if (this.isOpen) {
            try {
                const response = await fetch(this.config.url,
                    {
                        method: this.config.method || "POST",
                        headers: this.config.headers,
                        body: payload
                    }
                );
                if (!response.ok) {
                    this.onError();
                    return
                }

                const reader = response.body?.getReader();
                if (!reader) {
                    this.onError();
                    return
                }
                const decoder = new TextDecoder("utf-8");

                while (true) {
                    let {value, done} = await reader.read();
                    if (done) {
                        this.onClose();
                        break;
                    }
                    let responseText = decoder.decode(value);

                    if (!responseText) {
                        return;
                    }

                    this.buffer += responseText;

                    let lines = this.buffer.split("\n\n");
                    this.buffer = ""; // 清空缓存，准备重新填充
                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i].trim();
                        if (line.indexOf("data:") === 0) {
                            let fullMessage = line.substring(5).trim();
                            if (fullMessage) {
                                try {
                                    //console.log("Parsing JSON:", jsonData); // 调试输出
                                     this.message = JSON.parse(fullMessage);
                                    //console.log("message",message);
                                    this.onMessage(fullMessage);
                                } catch (e) {
                                    // 如果 JSON 解析失败，说明数据不完整，将其放回缓存等待下一个数据块
                                    if(this.message){
                                        console.warn("Incomplete JSON, adding back to buffer"); // 警告输出
                                    }
                                    this.buffer += line + "\\n\\n";
                                }
                            }
                        }
                    }

                    //const lines = responseText.split("\n\n");
                    // console.log("lines:",lines);
                    // let fullMessage = "";
                    // let index = 0;
                    // for (let line of lines) {
                    //     console.log("line:",line);
                    //     if (line.indexOf("data:") == 0) {
                    //         if (fullMessage) {
                    //             this.onMessage(fullMessage);
                    //         }
                    //         fullMessage = line.substring(5);
                    //         console.log("fullMessage:",fullMessage);
                    //     } else {
                    //         if (index != lines.length - 1) {
                    //             fullMessage += "\n\n";
                    //         }
                    //         fullMessage += line;
                    //     }
                    //     index++;
                    // }
                    // if (fullMessage) {
                    //     this.onMessage(fullMessage);
                    // }
                }
            } catch (e) {
                console.log(e)
                this.onError()
            }
        }
    }

    protected onOpen() {
        this.isOpen = true;
        this.send(this.payload!);
    }

    protected onMessage(answer: string) {
        this.listener.onMessage(answer)
    }

    protected onClose() {
        this.isOpen = false;
        if (!this.isStop) {
            this.listener.onStop();
            this.isStop = true;
        }
    }

    protected onError() {
        this.isOpen = false;
        if (!this.isStop) {
            this.listener.onStop();
            this.isStop = true;
        }
    }
}