import { useState } from 'react'
import './TextLab.css'
import FileManager from './FileManager/FileManager'
import TextDisplay from './TextDisplay/TextDisplay';
import TextEditor from './TextEditor/TextEditor';

{/* הגדרות ערכי ברירת מחדל לכל קובץ בסיסי */ }
// const defaultFile = {
//     id: Date.now(),
//     name: "Untitled",
//     text: "",
//     styles: [
//         {
//             start: 0,
//             end: 1,
//             style: {
//                 fontSize: "16px",
//                 fontFamily: "Arial",
//                 color: "#000000",
//                 backgroundColor: "#ffffff",
//                 direction: "ltr",
//             }
//         }
//     ],
//     Highlights: [],
//     historyMaxLength: 20,
//     history: []
// };





const TextLab = ({ userID }) => {

    const [files, setFiles] = useState([]);

    const [currentFile, setCurrentFile] = useState(-1);

    const [cursorIndex, setCursorIndex] = useState(0);


    {/* פונקציה למציאת אינדקס הסמן */ }
    const getCursorIndex = (e) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return 0;

        const editableDiv = e.currentTarget; // הדיב שבו התרחש האירוע
        const range = selection.getRangeAt(0);

        // לוודא שהסמן באמת בתוך הדיב הזה
        if (!editableDiv.contains(range.startContainer)) return -1;

        // Range חדש מהתחלה של הדיב עד הסמן
        const preRange = document.createRange();
        preRange.selectNodeContents(editableDiv);
        preRange.setEnd(range.startContainer, range.startOffset);

        const cursorPos = preRange.toString().length;

        setCursorIndex(cursorPos);

        console.log(`Cursor:`, cursorIndex);
    };


    {/* פונקציה לעידכון שדה בתוך קובץ */ }
    const updateFile = (fileIndex, newData, saveHistory = true) => {
        setFiles(prevFiles => {
            const updated = [...prevFiles];
            const file = updated[fileIndex];

            const mergedData = typeof newData === 'function' ? newData(file) : newData;
            const newFileState = { ...file, ...mergedData };

            if (saveHistory) {
                const newHistory = [...file.history];
                if (newHistory.length >= file.historyMaxLength) {
                    newHistory.shift();
                }
                newHistory.push({
                    text: file.text,
                    styles: [...file.styles]
                });
                newFileState.history = newHistory;
            }

            updated[fileIndex] = newFileState;

            return updated;
        });
    };


    {/* פונקציה לעידכון הטקסט */ }
    const handleInput = (newChar, fileIndex) => {
        files[fileIndex].styles.map(range => console.log(`char: ${newChar}, file.start: ${range.start}, file.end: ${range.end}, file.style: ${range.style}`));
        console.log(`cursorIndex: ${cursorIndex}`);

        const file = files[fileIndex];

        const newText = file.text.slice(0, cursorIndex) + newChar + file.text.slice(cursorIndex);

        const newStyles = file.styles.map(range => {
            if (range.start > cursorIndex) {
                return { ...range, start: range.start + 1, end: range.end + 1 };
            } else if (range.end >= cursorIndex) {
                return { ...range, end: range.end + 1 };
            }
            return range;
        });

        updateFile(fileIndex, { text: newText, styles: newStyles });
        setTimeout(() => setCursorIndex(cursorIndex + 1), 0);
    };


    {/* פונקציה למחיקת טקסט */ }
    const handleDelete = (fileIndex, deleteType) => {
        const file = files[fileIndex];

        if (deleteType === 'all') {
            updateFile(fileIndex, {
                text: "", styles: [
                    {
                        start: 0,
                        end: 1,
                        style: {
                            fontSize: "16px",
                            fontFamily: "Arial",
                            color: "#000000",
                            backgroundColor: "#ffffff",
                            direction: "ltr",
                        }
                    }]
            });
            setTimeout(() => setCursorIndex(0), 0);
            return;
        }

        let newText = file.text;
        let startIndex = cursorIndex;
        let endIndex = cursorIndex;

        if (deleteType === 'char') {
            if (cursorIndex === 0) return;
            startIndex = cursorIndex - 1;
        }
        else if (deleteType === 'word') {
            const beforeCursor = file.text.slice(0, cursorIndex);
            const matchBefore = beforeCursor.match(/(\S+)$/);
            startIndex = matchBefore ? cursorIndex - matchBefore[0].length : cursorIndex;

            if (startIndex > 0 && file.text[startIndex - 1] === ' ') {
                startIndex = startIndex - 1;
            }
            const afterCursor = file.text.slice(cursorIndex);
            const matchAfter = afterCursor.match(/^(\S+)/);
            endIndex = matchAfter ? cursorIndex + matchAfter[0].length : cursorIndex;
        }

        newText = newText.slice(0, startIndex) + newText.slice(endIndex);

        const newStyles = file.styles.flatMap(range => {
            if (range.end <= startIndex) {
                return range;
            }
            else if (range.start >= endIndex) {
                const shift = endIndex - startIndex;
                return { ...range, start: range.start - shift, end: range.end - shift };
            }
            else if (range.start < startIndex && range.end > endIndex) {
                const shift = endIndex - startIndex;
                return { start: range.start, end: range.end - shift, style: range.style };
            }
            else if (range.start < startIndex && startIndex < range.end) {
                return { ...range, end: startIndex };
            }
            else if (range.start < endIndex && endIndex < range.end) {
                const shift = endIndex - startIndex;
                return { ...range, start: startIndex, end: range.end - shift };
            }
        });

        updateFile(fileIndex, { text: newText, styles: newStyles });
        setTimeout(() => setCursorIndex(startIndex), 0);
    };

    
    {/* הגדרות ערכי ברירת מחדל לכל קובץ בסיסי */ }
    const createNewFile = (name = "Untitled") => ({
        id: Date.now(),
        name,
        text: "",
        styles: [
            {
                start: 0,
                end: 1,
                style: {
                    fontSize: "16px",
                    fontFamily: "Arial",
                    color: "#000000",
                    backgroundColor: "#ffffff",
                    direction: "ltr",
                }
            }
        ],
        Highlights: [],
        historyMaxLength: 20,
        history: []
    });


    {/* פונקציה ליצירת קובץ פעיל חדש */ }
    const newFile = () => {
        const fileName = prompt("Enter a file name: ", "Untitled");
        const file = createNewFile(fileName);
        setFiles(prevFiles => {
            const newFiles = [...prevFiles, file];
            setCurrentFile(newFiles.length - 1);
            newFiles.map(file => console.log(file));
            setCursorIndex(0);
            return newFiles;
        });
    }


    {/* פונקציה לסגירת קובץ פעיל חדש */ }
    const closeFile = () => {
        setFiles(prevFiles => {
            const updated = [...prevFiles];
            updated.splice(currentFile, 1);
            setCurrentFile(currentFile - 1);
            setCursorIndex(0);
            console.log('Closed file. New files list:', updated);
            return updated;
        });
    }


    {/* פונקציה לפתיחת קובץ פעיל חדש */ }
    const openFile = (file) => {
        const index = files.findIndex(f => f.id === file.id);

        setFiles(prevFiles => {
            let updated = [];
            if (index === -1) {
                updated = [...prevFiles, file];
                setCurrentFile(updated.length - 1);
            } else {
                updated = [...prevFiles];
                updated[index] = file;
                setCurrentFile(index);

            }
            setCursorIndex(0);
            return updated;
        });
    }


    return (
        <div className='textLabContainer'>
            <FileManager
                userID={userID}
                activeFiles={files}
                currentFile={currentFile}
                newFile={newFile}
                closeFile={closeFile}
                openFile={(file) => openFile(file)}
            />

            <div className='textDisplayContainer2'>
                {files.map((file, index) => (
                    <TextDisplay
                        key={index}
                        file={file}
                        fileIndex={index}
                        onFocus={() => { setCurrentFile(index); setCursorIndex(0); }}
                        isActive={currentFile === index}
                        handleInput={handleInput}
                        handleDelete={(fileIndex, type) => handleDelete(fileIndex, type)}
                        getCursorIndex={getCursorIndex}
                    />
                ))}
            </div>

            {currentFile > -1 && <TextEditor
                file={files[currentFile]}
                fileIndex={currentFile}
                cursorIndex={cursorIndex}
                updateFile={updateFile}
                handleDelete={handleDelete}
                handleInput={handleInput}
            />}
        </div>
    )
}

export default TextLab