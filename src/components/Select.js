import { useEffect, useRef } from "react"
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { imageUrl } from "../util/api";

const Select = ({ options, value, onChange, multiple = false, dropdownParent = "", hasImage = false }) => {
    const selectRef = useRef(null);
    useEffect(() => {
        const curr = selectRef.current;
        if (hasImage) {
            function formatOption(option) {
                if (!option.id) {
                    return option.text;
                }
    
                var $option = $(
                    `<span class="d-flex align-items-center">
                            ${option.image ? `<img src="${imageUrl}/uploads/users/${option.image}" alt="${option.text}" class="option-box-image"/>` : ""}
                            <span class="flex-grow-1 pl-2">${option.text}</span>
                        </span>`
                );
    
                return $option;
            }
            $(selectRef.current).select2({
                width: "100%",
                dropdownParent: dropdownParent,
                data: options.map(item => {
                    return {
                        id: item.value,
                        text: item.label,
                        image: item.image
                    };
                }),
                templateResult: formatOption,
                templateSelection: formatOption
            });
        } else {
            $(selectRef.current).select2({
                width: "100%",
                multiple,
                dropdownParent: dropdownParent
            });
        }
        $(selectRef.current).val(value).trigger('change');
        $(selectRef.current).on("change", function () {
            onChange($(this).val());
        });
        return () => {
            $(curr).select2('destroy');
        }
    }, [value, onChange, multiple, dropdownParent, hasImage, options]);
    return (
        <select defaultValue={value} ref={selectRef}>
            {
                options.map((el, index) => {
                    return (
                        <option key={index} value={el.value}>{el.label}</option>
                    )
                })
            }
        </select>
    )
}

export default Select;