import {AiEditor} from "../../core/AiEditor.ts";
import {Instance} from "tippy.js";

export type BubbleMenuItem = {
    id: string,
    title?: string,
    icon: string,
    holder?: any,
    onInit?: (editor: AiEditor, tippyInstance: Instance, parentEle: HTMLElement) => any;
    onClick?: (editor: AiEditor, tippyInstance: Instance, parentEle: HTMLElement, holder: any) => void;
}

export type AIBubbleMenuItem = {
    prompt: string,
    icon: string,
    title: string,
    temperature: number,
    top_p: number,
    frequency: number,
    presence: number,
} | string;

export type TranslateMenuItem = {
    title: string,
    language?: string,
} | string;