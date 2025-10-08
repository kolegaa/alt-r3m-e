"use client";

export default function CheckboxTree({ iterable }) {
    return (
        <>
            <ul className="bg-base-200 border border-base-300 rounded-box">
                {Object.keys(iterable).map((key) => (
                    <li key={key}>
                        <div tabIndex={0} className="collapse">
                            <div className="collapse-title font-semibold">
                                <label className="label">
                                    <input type="checkbox" defaultChecked className="checkbox" />
                                    {key}
                                </label>
                            </div>
                            <div className="collapse-content grid-collumns-2 grid text-sm">
                                {iterable[key].map((item, index) => (
                                    <label key={index} className="label mt-2">
                                        <input value={item} type="checkbox" defaultChecked className="checkbox" />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
