"use client";

import { useState, useEffect } from "react";

export default function CheckboxTree({ dict, onChange }) {
    const [checkedNodes, setCheckedNodes] = useState([]);
    const [activeKeys, setActiveKeys] = useState([]);

    // Initialize states based on dict prop
    useEffect(() => {
        if (dict) {
            // Initialize checkedNodes with all items from dict
            const initialCheckedNodes = Object.values(dict).flat();
            setCheckedNodes(initialCheckedNodes);
            
            // Initialize activeKeys with all keys from dict
            const initialActiveKeys = Object.keys(dict);
            setActiveKeys(initialActiveKeys);
        }
    }, [dict]);

    // Notify parent component when checkedNodes change
    useEffect(() => {
        onChange(checkedNodes);
    }, [checkedNodes, onChange]);

    const handleCheckboxChange = (key, item, checked) => {
        let newCheckedNodes;
        if (checked) {
            newCheckedNodes = [...checkedNodes, item];
        } else {
            newCheckedNodes = checkedNodes.filter((node) => node !== item);
        }
        setCheckedNodes(newCheckedNodes);

        // Update active key state based on whether all items in category are checked
        const allItemsChecked = dict[key].every(item => newCheckedNodes.includes(item));
        if (allItemsChecked && !activeKeys.includes(key)) {
            setActiveKeys([...activeKeys, key]);
        } else if (!allItemsChecked && activeKeys.includes(key)) {
            setActiveKeys(activeKeys.filter((node) => node !== key));
        }
    };

    const handleKeyChange = (key, checked) => {
        let newCheckedNodes;
        if (checked) {
            newCheckedNodes = [...checkedNodes, ...dict[key]];
            setActiveKeys([...activeKeys, key]);
        } else {
            newCheckedNodes = checkedNodes.filter((node) => !dict[key].includes(node));
            setActiveKeys(activeKeys.filter((node) => node !== key));
        }
        setCheckedNodes(newCheckedNodes);
    };

    return (
        <ul className="bg-base-200 border border-base-300 rounded-box">
            {Object.keys(dict).map((key) => (
                <li key={key}>
                    <div tabIndex={0} className="collapse">
                        <div className="collapse-title font-semibold">
                            <label className="label">
                                <input
                                    type="checkbox"
                                    checked={activeKeys.includes(key)}
                                    className="checkbox"
                                    onChange={(event) => handleKeyChange(key, event.target.checked)}
                                />
                                {key}
                            </label>
                        </div>
                        <div className="collapse-content grid-collumns-2 grid text-sm">
                            {dict[key].map((item, index) => (
                                <label key={index} className="label mt-2">
                                    <input
                                        value={item}
                                        type="checkbox"
                                        checked={checkedNodes.includes(item)}
                                        className="checkbox"
                                        onChange={(event) => handleCheckboxChange(key, item, event.target.checked)}
                                    />
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
