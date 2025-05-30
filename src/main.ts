import {AiEditor} from "./core/AiEditor.ts";
// import { config } from "./spark.ts";
// import {OpenaiModelConfig} from "./ai/openai/OpenaiModelConfig.ts";
// @ts-ignore
window.aiEditor = new AiEditor({
    element: "#aiEditor",
    placeholder: "点击输入内容1...",
    contentRetention: true,
    // draggable:false,
    // editable:false,
    content: 'AiEditor 是一个面向 AI 的下一代富文本编辑器。<p> <strong>提示：</strong> <br/>1、输入 空格 + "/" 可以快速弹出 AI 菜单 <br/> 2、输入 空格 + "@" 可以提及某人</p> ',
    textSelectionBubbleMenu: {
        // enable:false
        //[AI, Bold, Italic, Underline, Strike, Code]
        // items: ["ai", "Bold", "Italic", "Underline", "Strike", "code"],
    },

    // toolbarKeys: ["undo", "redo", "brush", "eraser", "divider", "heading", "font-family", "font-size", "divider", "bold", "italic", "underline"
    //     , "strike", "link", "code", "subscript", "superscript", "hr", "todo", "emoji", "divider", "highlight", "font-color", "divider"
    //     , "align", "line-height", "divider", "bullet-list", "ordered-list", "indent-decrease", "indent-increase", "break", "divider"
    //     , "image", "video", "attachment", "quote", "container", "code-block", "table", "divider", "source-code", "printer", "fullscreen",
    //     {
    //
    //         toolbarKeys: ["undo", "redo", "brush", "font-color", "line-height"]
    //     },
    //     "ai",
    // ],
    // toolbarExcludeKeys: ["undo", "redo", "brush", "eraser", "heading", "font-family", "font-size"],

    // fontSize:{
    //     defaultValue:18
    // },
    // image: {
    //     //[AlignLeft, AlignCenter, AlignRight, Delete]
    //     bubbleMenuItems: ["AlignLeft", "AlignCenter", "AlignRight", "delete"]
    // },
    link: {
        //[Edit, UnLink, Visit]
        bubbleMenuItems: ["Edit", "UnLink", "visit"],
    },
    codeBlock: {
        languages: [
            {name: 'Auto', value: 'auto'},
            {name: 'Plain Text', value: 'plaintext', alias: ['text', 'txt']},
            {name: 'Bash', value: 'bash', alias: ['sh']},
            {name: 'BASIC', value: 'basic', alias: []},
            {name: 'C', value: 'c', alias: ['h']},
            {name: 'Clojure', value: 'clojure', alias: ['clj', 'edn']},
            {name: 'CMake', value: 'cmake', alias: ['cmake.in']},
        ]
    },
    emoji:{
        // values:['😀', '😃', '😄', '😁', '😆', '😅',],
    },
    // lineHeight:{
    //     values:["1.0","1.1"],
    // },
    // onSave:()=>{
    //     alert("保存")
    //     return true;
    // },
    // image:{
    //     uploadUrl:"http://localhost:8080/api/v1/aieditor/upload/image"
    // },
    ai: {
        models: {
            // spark: {
            //     ...config
            // },
            // openai: {
            //     endpoint: "https://shuchong.xyz",
            //     model: "gpt-3.5-turbo",
            //     apiKey: "sk-***",
            //     undetectableApiKey:"",
            //     difyGrammarlyApiKey:""
            // },
            // azure:{
            //     // endpoint: "https://edutop.openai.azure.com",
            //     // model: "GPT4O",
            //     apiKey: "f1da31d5239b4fb5ace2184e40bb0f5f",
            //     undetectableApiKey:"",
            //     difyGrammarlyApiKey:""
            // }
            // gitee:{
            //     endpoint:"https://ai.gitee.com/api/inference/serverless/KGHCVOPBV7GY/chat/completions",
            //     apiKey:"***",
            // }
        },
        // bubblePanelEnable:false,
        // bubblePanelModel: "openai",
        onTokenConsume: (modelName, _modelConfig, count) => {
            console.log(modelName, " token count:" + count)
        },

        // bubblePanelMenus: [
        //     {
        //         prompt: `<content>{content}</content>\n请帮我优化一下这段内容，并直接返回优化后的结果。\n注意：你应该先判断一下这句话是中文还是英文，如果是中文，请给我返回中文的内容，如果是英文，请给我返回英文内容，只需要返回内容即可，不需要告知我是中文还是英文。`,
        //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.1986 9.94447C14.7649 9.5337 14.4859 8.98613 14.4085 8.39384L14.0056 5.31138L11.275 6.79724C10.7503 7.08274 10.1433 7.17888 9.55608 7.06948L6.49998 6.50015L7.06931 9.55625C7.17871 10.1435 7.08257 10.7505 6.79707 11.2751L5.31121 14.0057L8.39367 14.4086C8.98596 14.4861 9.53353 14.7651 9.94431 15.1987L12.0821 17.4557L13.4178 14.6486C13.6745 14.1092 14.109 13.6747 14.6484 13.418L17.4555 12.0823L15.1986 9.94447ZM15.2238 15.5079L13.0111 20.1581C12.8687 20.4573 12.5107 20.5844 12.2115 20.442C12.1448 20.4103 12.0845 20.3665 12.0337 20.3129L8.49229 16.5741C8.39749 16.474 8.27113 16.4096 8.13445 16.3918L3.02816 15.7243C2.69958 15.6814 2.46804 15.3802 2.51099 15.0516C2.52056 14.9784 2.54359 14.9075 2.5789 14.8426L5.04031 10.3192C5.1062 10.1981 5.12839 10.058 5.10314 9.92253L4.16 4.85991C4.09931 4.53414 4.3142 4.22086 4.63997 4.16017C4.7126 4.14664 4.78711 4.14664 4.85974 4.16017L9.92237 5.10331C10.0579 5.12855 10.198 5.10637 10.319 5.04048L14.8424 2.57907C15.1335 2.42068 15.4979 2.52825 15.6562 2.81931C15.6916 2.88421 15.7146 2.95507 15.7241 3.02833L16.3916 8.13462C16.4095 8.2713 16.4739 8.39766 16.5739 8.49245L20.3127 12.0338C20.5533 12.2617 20.5636 12.6415 20.3357 12.8821C20.2849 12.9357 20.2246 12.9795 20.1579 13.0112L15.5078 15.224C15.3833 15.2832 15.283 15.3835 15.2238 15.5079ZM16.0206 17.435L17.4348 16.0208L21.6775 20.2634L20.2633 21.6776L16.0206 17.435Z"></path></svg>`,
        //         title: 'improve-writing',
        //         temperature: 1,
        //         top_p: 1,
        //         frequency: 0,
        //         presence: 0,
        //     },
        //     {
        //         prompt: `<content>{content}</content>\n请帮我检查一下这段内容，是否有拼写错误或者语法上的错误。\n注意：你应该先判断一下这句话是中文还是英文，如果是中文，请给我返回中文的内容，如果是英文，请给我返回英文内容，只需要返回内容即可，不需要告知我是中文还是英文。`,
        //         icon: ` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 19C12.8284 19 13.5 19.6716 13.5 20.5C13.5 21.3284 12.8284 22 12 22C11.1716 22 10.5 21.3284 10.5 20.5C10.5 19.6716 11.1716 19 12 19ZM6.5 19C7.32843 19 8 19.6716 8 20.5C8 21.3284 7.32843 22 6.5 22C5.67157 22 5 21.3284 5 20.5C5 19.6716 5.67157 19 6.5 19ZM17.5 19C18.3284 19 19 19.6716 19 20.5C19 21.3284 18.3284 22 17.5 22C16.6716 22 16 21.3284 16 20.5C16 19.6716 16.6716 19 17.5 19ZM13 2V4H19V6L17.0322 6.0006C16.2423 8.3666 14.9984 10.5065 13.4107 12.302C14.9544 13.6737 16.7616 14.7204 18.7379 15.3443L18.2017 17.2736C15.8917 16.5557 13.787 15.3326 12.0005 13.7257C10.214 15.332 8.10914 16.5553 5.79891 17.2734L5.26257 15.3442C7.2385 14.7203 9.04543 13.6737 10.5904 12.3021C9.46307 11.0285 8.50916 9.58052 7.76789 8.00128L10.0074 8.00137C10.5706 9.03952 11.2401 10.0037 11.9998 10.8772C13.2283 9.46508 14.2205 7.81616 14.9095 6.00101L5 6V4H11V2H13Z"></path></svg>`,
        //         title: 'check-spelling-and-grammar',
        //         temperature: 1,
        //         top_p: 1,
        //         frequency: 0,
        //         presence: 0,
        //     },
        //     '<hr/>',
        //     {
        //         prompt: `<content>{content}</content>\n请帮我翻译以上内容，在翻译之前，想先判断一下这个内容是不是中文，如果是中文，则翻译问英文，如果是其他语言，则需要翻译为中文，注意，你只需要返回翻译的结果，不需要对此进行任何解释，不需要除了翻译结果以外的其他任何内容。`,
        //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 15V17C5 18.0544 5.81588 18.9182 6.85074 18.9945L7 19H10V21H7C4.79086 21 3 19.2091 3 17V15H5ZM18 10L22.4 21H20.245L19.044 18H14.954L13.755 21H11.601L16 10H18ZM17 12.8852L15.753 16H18.245L17 12.8852ZM8 2V4H12V11H8V14H6V11H2V4H6V2H8ZM17 3C19.2091 3 21 4.79086 21 7V9H19V7C19 5.89543 18.1046 5 17 5H14V3H17ZM6 6H4V9H6V6ZM10 6H8V9H10V6Z"></path></svg>`,
        //         title: 'translate',
        //         temperature: 1,
        //         top_p: 1,
        //         frequency: 0,
        //         presence: 0,
        //     },
        //     {
        //         prompt: `<content>{content}</content>\n请帮我总结以上内容，并直接返回总结的结果\n注意：你应该先判断一下这句话是中文还是英文，如果是中文，请给我返回中文的内容，如果是英文，请给我返回英文内容，只需要返回内容即可，不需要告知我是中文还是英文。`,
        //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9H15C13.6941 9 12.5831 8.16562 12.171 7.0009L11 7C9.9 7 9 7.9 9 9L9.0009 9.17102C10.1656 9.58312 11 10.6941 11 12C11 13.3059 10.1656 14.4169 9.0009 14.829L9 15C9 16.1 9.9 17 11 17L12.1707 17.0001C12.5825 15.8349 13.6937 15 15 15H18C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21H15C13.6941 21 12.5831 20.1656 12.171 19.0009L11 19C8.79 19 7 17.21 7 15H5C3.34315 15 2 13.6569 2 12C2 10.3431 3.34315 9 5 9H7C7 6.79086 8.79086 5 11 5L12.1707 5.00009C12.5825 3.83485 13.6937 3 15 3H18ZM18 17H15C14.4477 17 14 17.4477 14 18C14 18.5523 14.4477 19 15 19H18C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17ZM8 11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H8C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11ZM18 5H15C14.4477 5 14 5.44772 14 6C14 6.55228 14.4477 7 15 7H18C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"></path></svg>`,
        //         title: 'summarize',
        //         temperature: 1,
        //         top_p: 1,
        //         frequency: 0,
        //         presence: 0,
        //     },
        //     {
        //         prompt: `Please paraphrase this and keep the same meaning: <content>{content}</content>\n`,
        //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path></svg>`,
        //         title: 'paraphrase-writing',
        //         temperature: 0.7,
        //         top_p: 0.95,
        //         frequency: 1.0,
        //         presence: 1.0,
        //     },
        //     {
        //         prompt: `Please vividly show this, not to tell: <content>{content}</content>\n`,
        //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 5V19H16V5H8ZM4 5V7H6V5H4ZM18 5V7H20V5H18ZM4 9V11H6V9H4ZM18 9V11H20V9H18ZM4 13V15H6V13H4ZM18 13V15H20V13H18ZM4 17V19H6V17H4ZM18 17V19H20V17H18Z"></path></svg>`,
        //         title: 'vividly-writing',
        //         temperature: 0.7,
        //         top_p: 0.95,
        //         frequency: 1.0,
        //         presence: 1.0,
        //     },
        //     {
        //         prompt: `Please choose sentences from the content containing example that can be elaborated on. List the sentences in JSON format: <content>{content}</content>\n`,
        //         icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.82929 20C7.41746 21.1652 6.30622 22 5 22C3.34315 22 2 20.6569 2 19C2 17.6938 2.83481 16.5825 4 16.1707V7.82929C2.83481 7.41746 2 6.30622 2 5C2 3.34315 3.34315 2 5 2C6.30622 2 7.41746 2.83481 7.82929 4H16.1707C16.5825 2.83481 17.6938 2 19 2C20.6569 2 22 3.34315 22 5C22 6.30622 21.1652 7.41746 20 7.82929V16.1707C21.1652 16.5825 22 17.6938 22 19C22 20.6569 20.6569 22 19 22C17.6938 22 16.5825 21.1652 16.1707 20H7.82929ZM7.82929 18H16.1707C16.472 17.1476 17.1476 16.472 18 16.1707V7.82929C17.1476 7.52801 16.472 6.85241 16.1707 6H7.82929C7.52801 6.85241 6.85241 7.52801 6 7.82929V16.1707C6.85241 16.472 7.52801 17.1476 7.82929 18ZM5 6C5.55228 6 6 5.55228 6 5C6 4.44772 5.55228 4 5 4C4.44772 4 4 4.44772 4 5C4 5.55228 4.44772 6 5 6ZM19 6C19.5523 6 20 5.55228 20 5C20 4.44772 19.5523 4 19 4C18.4477 4 18 4.44772 18 5C18 5.55228 18.4477 6 19 6ZM19 20C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18C18.4477 18 18 18.4477 18 19C18 19.5523 18.4477 20 19 20ZM5 20C5.55228 20 6 19.5523 6 19C6 18.4477 5.55228 18 5 18C4.44772 18 4 18.4477 4 19C4 19.5523 4.44772 20 5 20Z"></path></svg>`,
        //         title: 'automatic-selecting',
        //         temperature: 0.7,
        //         top_p: 0.95,
        //         frequency: 0,
        //         presence: 0,
        //     },
        // ],


    },
    i18n: {
        zh: {
            // "undo": "撤销(可自定义国际化内容...)",
            // "redo": "重做(可自定义国际化内容!)",
        }
    },
    onMentionQuery: (query) => {
        return [
            'Michael Yang', 'Jean Zhou', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder'
            , 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John'
            , 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey'
            , 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
        ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
    }
})
