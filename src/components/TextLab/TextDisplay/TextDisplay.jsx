import './TextDisplay.css'

const TextDisplay = ({ file, fileIndex, onFocus, isActive, handleInput, handleDelete, getCursorIndex }) => {

    { /* פונקציה להאזנה לכתפורים מיוחדים */ }
    const handleKeyboardInput = (e) => {
        e.preventDefault();
        if (e.key.length === 1) {
            console.log('handled input 1:', e.key);
            handleInput(e.key, fileIndex);
        }
        else if (e.key === 'Backspace') {
            console.log('handled delete 1:', 'Backspace');
            handleDelete(fileIndex, 'char');
        }
        else if (e.key === 'Enter') {
            console.log('handled input 2:', '\n');
            handleInput('\n', fileIndex);
        }
    };

    return (
        <div
            className={`textDisplayContainer ${isActive ? "active" : ""}`}
            onDoubleClick={onFocus}
            onFocus={() => { onFocus }}
        >
            <h3 className={`fileName ${isActive ? "active" : ""}`}>File name: {file.name}</h3>
            <div
                className={`editableDiv ${file.text === "" ? "empty" : ""}`}
                contentEditable="true"
                suppressContentEditableWarning={true}
                onMouseUp={(e) => getCursorIndex(e)}
                onKeyDown={handleKeyboardInput}
            >
                {(file.Highlights.length > 0 ? file.Highlights : file.styles).map((obj, index) => (
                    <span
                        key={index}
                        style={obj.style}
                    >
                        {file.text.slice(obj.start, obj.end)}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default TextDisplay;