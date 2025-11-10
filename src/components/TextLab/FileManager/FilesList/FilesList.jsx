import './FilesList.css'

const FilesList = ({ savedFiles, openFile }) => {

    return (
        <div className='filesListContainer'>
            <h3 className='filesListTitle'>My Files:</h3>
            <div className='filesListButtons'>
                {savedFiles.map((file, index) => (
                    <button
                        key={index}
                        onDoubleClick={() => openFile(file)}
                    >
                        {file.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default FilesList;