
export default function Button({ type = "submit", className = "", disabled = false, children, }) {
    return (
        <button
            type={type}
            className={`btn  ${disabled ? '' : ''} ${className} `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

