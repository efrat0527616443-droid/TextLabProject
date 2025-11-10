import './TextEditor.css'
import { useState } from 'react'
import ToolBar from './ToolBar/ToolBar';
import KeyBoard from './keyBoard/KeyBoard';

const TextEditor = ({ file, fileIndex, cursorIndex, updateFile, handleDelete, handleInput }) => {

    const [keyBoardType, setKeyBoardType] = useState(0);

    {/* פונקציה להחלפת מקלדת */ }
    const updateKeyBoardType = () => {
        setKeyBoardType(prev => (prev + 1) % 4);
        setTimeout(() => console.log(keyBoardType), 0);
    }


    {/* פונקציה לעידכון סטייל */ }
    const updateStyle = (newStyle, applyMode) => {
        console.log(cursorIndex);

        let newStyles = [];

        if (!applyMode) {
            newStyles = file.styles.map(range => ({
                ...range,
                style: { ...range.style, ...newStyle }
            }));
        } else {
            file.styles.forEach(range => {
                if (cursorIndex <= range.start) {
                    newStyles.push({ ...range, style: { ...range.style, ...newStyle } });
                } else if (cursorIndex > range.start && cursorIndex < range.end) {
                    newStyles.push({ start: range.start, end: cursorIndex, style: range.style });
                    newStyles.push({ start: cursorIndex, end: range.end, style: { ...range.style, ...newStyle } });
                } else {
                    newStyles.push(range);
                }
            });
        }

        updateFile(fileIndex, (prevFile => ({ ...prevFile, styles: newStyles })));
        console.log(cursorIndex);
    };


    {/* פונקציה לעדכון מערך המודגשים */ }
    const mergeStylesWithHighlights = (ranges, type, fileIndex) => {
        if (type === 'delete') {
            updateFile(fileIndex, { Highlights: [] });
            file.Highlights.map((obj) => console.log(`start: ${obj.start}`))
            return;
        }

        if (!file || !file.styles) return;

        const highlights = [];

        file.styles.forEach(styleRange => {
            let lastEnd = styleRange.start;

            ranges.forEach(highlight => {
                if (highlight.end <= styleRange.start || highlight.start >= styleRange.end) return;

                const overlapStart = Math.max(styleRange.start, highlight.start);
                const overlapEnd = Math.min(styleRange.end, highlight.end);

                if (overlapStart > lastEnd) {
                    highlights.push({
                        start: lastEnd,
                        end: overlapStart,
                        style: { ...styleRange.style }
                    });
                }

                highlights.push({
                    start: overlapStart,
                    end: overlapEnd,
                    style: {
                        ...styleRange.style, textDecoration: "underline", textDecorationColor: "red", textDecorationThickness: "2px"
                    }
                });

                lastEnd = overlapEnd;
            });

            if (lastEnd < styleRange.end) {
                highlights.push({
                    start: lastEnd,
                    end: styleRange.end,
                    style: { ...styleRange.style }
                });
            }
        });

        updateFile(fileIndex, { Highlights: highlights });
    };


    {/* פונקציה להחזרת ההיסטוריה */ }
    const undoFile = (fileIndex) => {
        if (!file.history || file.history.length === 0) return;

        const lastSnapshot = file.history[file.history.length - 1];

        const newData = {
            text: lastSnapshot.text,
            styles: lastSnapshot.styles,
            history: file.history.slice(0, -1)
        };
        updateFile(fileIndex, newData, false);
    };


    {/* פונקציה להחלפת תו */ }
    const handleReplaceChar = (newChar, fileIndex) => {
        if (cursorIndex === null || cursorIndex < 0) return;

        if (!file.text || cursorIndex >= file.text.length) return;

        const newText = file.text.slice(0, cursorIndex - 1) + newChar + file.text.slice(cursorIndex);

        const updatedFile = {
            ...file,
            text: newText
        };

        updateFile(fileIndex, updatedFile);
    };


    {/* חיפוש ערך בטקסט */ }
    const onSearch = (str, type) => {
        if (type === 'delete') {
            mergeStylesWithHighlights([], type, fileIndex);
            return;
        }

        if (!str) return;

        const matches = [];
        let index = 0;
        while (index < file.text.length) {
            const foundIndex = file.text.indexOf(str, index);
            if (foundIndex === -1) break;
            matches.push({ start: foundIndex, end: foundIndex + str.length });
            index = foundIndex + str.length;
        }

        mergeStylesWithHighlights(matches, type, fileIndex);
    };

    return (
        <div className='TextEditorContainer'>
            <ToolBar
                fileStyls={file.styles}
                updateStyle={updateStyle}
                onDelete={(deleteType) => handleDelete(fileIndex, deleteType)}
                onSearch={onSearch}
                undo={() => undoFile(0)}
                onReplaceChar={(char) => handleReplaceChar(char, fileIndex)}
                keyBoard={{
                    keyBoardType: keyBoardType,
                    updateKeyBoardType: updateKeyBoardType
                }}
            />
            <KeyBoard
                keyBoardType={keyBoardType}
                onInput={(char) => handleInput(char, fileIndex)}
            />
        </div>
    );
}

export default TextEditor;