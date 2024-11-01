import {AiEditorOptions, AiEditorEvent} from "../core/AiEditor.ts";
import {EditorEvents} from "@tiptap/core";


export class Footer extends HTMLElement implements AiEditorEvent {

    count: number = 0
    selectCount:number = 0
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
        let wordCountText = this.selectCount ? `单词数: ${this.selectCount} / ${this.count}` : `单词数: ${this.count}`;
        let svgIcon = '';

        if (this.draggable) {
            svgIcon = `<div style="width: 20px;height: 20px;overflow: hidden">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                           <path fill="none" d="M0 0h24v24H0z"></path>
                           <path d="M12 16L6 10H18L12 16Z"></path>
                       </svg>
                   </div>`;
        }

        this.innerHTML = `<div style="display: flex; padding: 10px;">
                          <span style="margin-right: 10px">${wordCountText}</span>
                          ${svgIcon}
                      </div>`;
    }

    onCreate(props: EditorEvents["create"], _: AiEditorOptions): void {
        //this.count = props.editor.storage.characterCount.characters()
        // const str:string = props.editor.storage.markdown.getMarkdown();
        const {doc} = props.editor!.state;
        this.count = this.getCharacterCount(doc.textContent);
        this.updateCharacters();
    }

    onTransaction(props: EditorEvents["transaction"]): void {
        const {selection, doc} = props.editor!.state
        const selectedText = this.getCharacterCount(doc.textBetween(selection.from, selection.to)) ;

        //const str:string = props.editor.storage.markdown.getMarkdown();
        const str:string = doc.textContent;
        const newCount = this.getCharacterCount(str);

        if(selectedText != this.selectCount){
            this.selectCount = selectedText;
            this.updateCharacters();
        }

        if (newCount != this.count) {
            this.count = newCount;
            this.updateCharacters();
        }
    }

    // getCharacterCount(str: string): number {
    //     const chinese = Array.from(str).filter((ch) => /[\u4e00-\u9fa5]/.test(ch));
    //     const english = Array.from(str)
    //         .map((ch) => (/[a-zA-Z0-9\s]/.test(ch) ? ch : ' '))
    //         .join('')
    //         .split(/\s+/)
    //         .filter((s) => s);
    //     return chinese.length + english.length;
    // }
    getCharacterCount(str: string) {
        //console.log(str)
        str = str.replace(/[\u4e00-\u9fa5]+/g, " ");
        // 将换行符，前后空格不计算为单词数
        str = str.replace(/\n|\r|^\s+|\s+$/gi,"");
        // 多个空格替换成一个空格
        str = str.replace(/\s+/gi," ");
        // 更新计数
        var length = 0;
        var match = str.match(/\s/g);
        if (match) {
            length = match.length + 1;
        } else if (str) {
            length = 1;
        }

        return length;
    }


}



