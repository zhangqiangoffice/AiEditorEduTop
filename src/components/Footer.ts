import {AiEditorOptions, AiEditorEvent} from "../core/AiEditor.ts";
import {EditorEvents} from "@tiptap/core";


export class Footer extends HTMLElement implements AiEditorEvent {

    count: number = 0
    draggable: boolean = true;

    constructor() {
        super();
    }

    initDraggable(draggable?: boolean) {
        this.draggable = !!draggable;

        if (!this.draggable) {
            return;
        }

        let startX: number, startY: number, minWidth = 300, minHeight = 300, rootWith: number, rootHeight: number,
            root: HTMLElement;
        const onMouseUp = (e: MouseEvent) => {
            e.preventDefault();
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMousemove);
        }

        const onMousemove = (event: MouseEvent) => {
            const distanceX = event.clientX - startX;
            const distanceY = event.clientY - startY;

            if (distanceX == 0 && distanceY == 0) return;

            let newWidth = rootWith + distanceX;
            let newHeight = rootHeight + distanceY;

            if (newWidth < minWidth) {
                newWidth = minWidth;
            }

            if (newHeight < minHeight) {
                newHeight = minHeight;
            }

            root.style.width = `${newWidth}px`;
            root.style.height = `${newHeight}px`;
        }

        this.addEventListener("mousedown", (e) => {
            const target = (e.target as HTMLElement).closest("svg");
            if (target) {
                e.preventDefault();
                document.addEventListener("mouseup", onMouseUp);
                document.addEventListener("mousemove", onMousemove);
                root = (e.target as HTMLElement).closest(".aie-container")?.parentElement!;
                rootWith = root.clientWidth;
                rootHeight = root.clientHeight;
                startX = e.clientX;
                startY = e.clientY;
            }
        });

        this.addEventListener("mouseup", onMouseUp)
    }

    updateCharacters() {
        if (!this.draggable) {
            this.innerHTML = `<div style="display: flex; padding: 10px;"> 
                                <span style="margin-right: 10px"> 单词数: ${this.count} </span>
                            </div>
                            `;
        } else {
            this.innerHTML = `<div style="display: flex; padding: 10px;"> 
                                <span>  单词数:  ${this.count} </span>
                                <div style="width: 20px;height: 20px;overflow: hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 16L6 10H18L12 16Z"></path></svg>
                                </div>
                            </div>
                            `;
        }
    }

    onCreate(props: EditorEvents["create"], _: AiEditorOptions): void {
        //this.count = props.editor.storage.characterCount.characters()
        const str:string = props.editor.storage.markdown.getMarkdown();
        this.count = this.getCharacterCount(str);
        this.updateCharacters()
    }

    onTransaction(props: EditorEvents["transaction"]): void {
        const str:string = props.editor.storage.markdown.getMarkdown();
        const newCount = this.getCharacterCount(str);
        if (newCount != this.count) {
            this.count = newCount
            this.updateCharacters()
        }
    }

    getCharacterCount(str: string): number {
        const chinese = Array.from(str).filter((ch) => /[\u4e00-\u9fa5]/.test(ch));
        const english = Array.from(str)
            .map((ch) => (/[a-zA-Z0-9\s]/.test(ch) ? ch : ' '))
            .join('')
            .split(/\s+/)
            .filter((s) => s);
        return chinese.length + english.length;
    }

}



