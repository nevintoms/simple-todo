export default function Button({ text, handleOnClick }) {
    return (
        <div className="ml-5 py-2 px-5 rounded-lg bg-gray-500">
            <button onClick={handleOnClick}>
                {text}
            </button>
        </div>
    )
}

