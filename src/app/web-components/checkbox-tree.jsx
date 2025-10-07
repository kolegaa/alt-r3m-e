export default function CheckboxTree({ iterable }) {

    return (
        <ul>
            {Object.keys(iterable).map((key) => (
                <li key={key}>
                    <div tabIndex={0} className="collapse">
                        <div className="collapse-title font-semibold">
                            <label className="label">
                                <input type="checkbox" defaultChecked className="checkbox" />
                                {key}
                            </label>
                        </div>
                        <div className="collapse-content text-sm">
                            {iterable[key].map((item, index) => (
                                <label key={index} className="label">
                                    <input type="checkbox" defaultChecked className="checkbox" />
                                    {item}
                                </label>
                            ))}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
