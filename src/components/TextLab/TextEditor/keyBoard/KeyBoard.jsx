import './KeyBoard.css'

const KeyBoard = ({ keyBoardType, onInput }) => {

    const KeyBoards = [
        // English letters
        [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
            ['SPACE', 'ENTER'] // מקשים מיוחדים
        ],

        // Hebrew letters
        [
            ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'],
            ['כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            ['SPACE', 'ENTER']
        ],

        // Numbers & Symbols
        [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
            ['-', '_', '=', '+', '[', ']', '{', '}', ';', ':', '"', "'", "<", ">", "/", "?", "\\", "|", "~", "`"],
            ['SPACE', 'ENTER']
        ],

        // Emojis
        [
            ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊'],
            ['😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤩'],
            ['🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮'],
            ['😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤'],
            ['SPACE', 'ENTER']
        ]
    ];

    const handleKeyClick = (key) => {
        console.log('handled input 3:', key);
        if (key === 'SPACE') onInput(' ');
        else if (key === 'ENTER') onInput('\n');
        else onInput(key);
    }

    return (
        <div className='keyBoardContainer'>
            {KeyBoards[keyBoardType].map((row, rowIndex) => (
                <div key={rowIndex} className='keyBoardRow'>
                    {row.map((key, keyIndex) => (
                        <button
                            key={keyIndex}
                            className={`keyBoardKey ${key === 'SPACE' ? 'spaceKey' : ''} ${key === 'ENTER' ? 'enterKey' : ''}`}
                            onClick={() => handleKeyClick(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default KeyBoard;
