import { useState } from 'react'
import './ToolBar.css'

const ToolBar = ({ fileStyls, updateStyle, onDelete, onSearch, undo, onReplaceChar, keyBoard }) => {

    const [fromCursor, setFromCursor] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [replaceChar, setReplaceChar] = useState("");

    const fonts = [
        "Arial",
        "Verdana",
        "Tahoma",
        "Trebuchet MS",
        "Times New Roman",
        "Georgia",
        "Courier New",
        "Comic Sans MS",
        "Lucida Console",
        "Calibri",
        "Segoe UI"
    ];
    const KeyBoardsName = ['English', 'Hebrew', 'Numbers & Symbols', 'Emojis'];

    return (
        <div className='toolBarContainer'>
            <div className='toolBarInputs'>

                {/* בחירת צבע */}
                <label>
                    Color:
                    <input
                        type="color"
                        value={fileStyls[0].style.color}
                        onChange={(e) => updateStyle({ color: e.target.value }, fromCursor)}
                    />
                </label>

                {/* בחירת צבע רקע */}
                <label>
                    Background:
                    <input
                        type="color"
                        value={fileStyls[0].style.backgroundColor}
                        onChange={(e) => updateStyle({ backgroundColor: e.target.value }, fromCursor)}
                    />
                </label>

                {/* בחירת פונט */}
                <label>
                    Font Family:
                    <select
                        value={fileStyls[0].style.fontFamily}
                        onChange={(e) => updateStyle({ fontFamily: e.target.value }, fromCursor)}
                    >
                        {fonts.map((font, index) => (
                            <option key={index} value={font}>
                                {font}
                            </option>
                        ))}
                    </select>
                </label>

                {/* בחירת גודל גופן */}
                <label>
                    Font Size:
                    <input
                        type="range"
                        min="10"
                        max="80"
                        value={parseInt(fileStyls[0].style.fontSize)}
                        onChange={(e) => updateStyle({ fontSize: e.target.value + "px" }, fromCursor)}
                    />
                    <span className='fontText'>{fileStyls[0].style.fontSize}</span>
                </label>

                {/* בחירה בעיצוב מכאן והלאה */}
                <label>
                    <button
                        className='keyboardButton'
                        style={{
                            backgroundColor: fromCursor ? '#c2a8a1' : '#fff5f2'
                        }}
                        onClick={() => { setFromCursor(!fromCursor); console.log(fromCursor) }}
                    >Design from here on out</button>
                </label>

            </div>

            <div className='searchContainer'>

                <label className="toolBarLabel">
                    <button onClick={() => onSearch(searchText, 'search')}>🔍</button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="searchInput"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button onClick={() => { console.log('delete'); setSearchText(''); onSearch('', 'delete') }}>🗑️</button>
                </label>


                {/* החלפת תו בודד */}
                <label className="toolBarLabel replaceLabel">
                    <input
                        type="text"
                        placeholder="Insert character"
                        className="replaceInput"
                        value={replaceChar}
                        onChange={(e) => setReplaceChar(e.target.value[0] || '')}
                    />
                    <button onClick={() => { onReplaceChar(replaceChar); setReplaceChar('') }} className='keyboardButton'>☑️</button>
                </label>

            </div>

            <div className='toolBarButtons'>

                {/* החלפת מקלדת */}
                <button
                    className='keyboardButton'
                    onClick={() => keyBoard.updateKeyBoardType()}
                >
                    {KeyBoardsName[keyBoard.keyBoardType]}
                </button>

                {/* מחיקת תו */}
                <button
                    onClick={() => onDelete('char')}
                    className='keyboardButton'
                >
                    Delete Char
                </button>

                {/* מחיקת מילה */}
                <button
                    onClick={() => onDelete('word')}
                    className='keyboardButton'
                >
                    Delete Word
                </button>

                {/* מחיקת הכל */}
                <button
                    onClick={() => onDelete('all')}
                    className='keyboardButton'
                >
                    Delete All
                </button>

                {/* היסטוריה */}
                <button
                    onClick={() => undo()}
                    className='keyboardButton'
                >
                    ↪️
                </button>
            </div>
        </div>
    );
}

export default ToolBar;