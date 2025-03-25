export default function InputError({ message, className = '', ...props }) {
    return message ? (

        <div className="mt-1">
            <span className="text-danger ps-2" >
                {message}

            </span>
        </div>

    ) : null;
}
