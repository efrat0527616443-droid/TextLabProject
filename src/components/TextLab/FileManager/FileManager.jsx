import { useState } from 'react'
import FilesList from './FilesList/FilesList'
import './FileManager.css'

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

const FileManager = ({ userID, activeFiles, currentFile, newFile, closeFile, openFile }) => {

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserData = users.find(u => u.id === userID);
    const [savedFiles, setSavedFiles] = useState(currentUserData ? currentUserData.files : []);

    {/* עידכון מערך הקבצים המעודכן */ }
    const updateFilesInLS = (callbacke) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.id === userID);
        if (index !== -1) {
            users[index].files = callbacke(users[index].files);
        }
        localStorage.setItem("users", JSON.stringify(users));
    }


    {/* מיזוג סגנונות סמוכים זהים */ }
    function mergeAdjacentStyles() {
        let styles = activeFiles[currentFile].styles;
        if (!styles || styles.length === 0) return [];

        const merged = [styles[0]];

        for (let i = 1; i < styles.length; i++) {
            const prev = merged[merged.length - 1];
            const curr = styles[i];

            const isAdjacentOrOverlap = prev.end >= curr.start;

            const isSameStyle = JSON.stringify(prev.style) === JSON.stringify(curr.style);

            if (isSameStyle && isAdjacentOrOverlap) {
                prev.end = Math.max(prev.end, curr.end);
            } else {
                merged.push(curr);
            }
        }

        return merged;
    }


    {/* שמירת קובץ */ }
    const save = (type) => {
        mergeAdjacentStyles();
        updateFilesInLS((files) => {
            const fileID = activeFiles[currentFile].id;
            const index = files.findIndex(file => file.id === fileID);

            /* שמירת קובץ חדש */
            if (index === -1) {
                if (type === 'saveAs') {
                    const fileName = prompt("Enter a file name: ", activeFiles[currentFile].name);
                    activeFiles[currentFile].name = fileName ? fileName : "Untitled";
                }
                files.push(activeFiles[currentFile])
            }
            /* שמירת קובץ קיים */
            else {
                if (type === 'saveAs') {
                    const fileName = prompt("Enter a file name: ", activeFiles[currentFile].name);
                    activeFiles[currentFile].name = fileName ? fileName : "Untitled";
                }
                files[index] = activeFiles[currentFile];
            }
            return [...files];
        })
        alert('The file was saved successfully! 👍')
        updateSavesFiles();
    }


    {/* סגירת קובץ */ }
    const close = () => {
        const toSave = confirm('Would you like to save the changes?');
        console.log('toSave:', toSave);
        if (toSave) {
            activeFiles[currentFile].history = [];
            save('save');
        }
        closeFile();
    }


    {/* עדכון רשימת הקבצים */ }
    const updateSavesFiles = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.id === userID);
        if (index !== -1) {
            console.log('users[index].files:', users[index].files);
            setSavedFiles(users[index].files);
        }
    }


    return (

        <div className='FileManagerContainer'>
            <div className='FileManagerButtons'>
                <button onClick={newFile}>New File</button>
                {currentFile !== -1 &&
                    <>
                        <button onClick={close}>Close</button>
                        <button onClick={() => save('save')}>Save</button>
                        <button onClick={() => save('saveAs')}>Save as</button>
                    </>
                }
            </div>

            <FilesList
                openFile={(file) => openFile(file)}
                savedFiles={savedFiles}
            />
        </div>
    )
}

export default FileManager