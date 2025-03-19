"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader } from "lucide-react";
import { sentenceCase } from 'utils';

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */


interface Option {
	label: string;
	value: string;
}

interface SelectProps {
	options: Option[];
	value: Option;
	onChange: (value: Option) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	triggerClassName?: string;
	dropdownClassName?: string;
  showBreakLine?:boolean;
  loading?:boolean;
  RenderView?: any | null; //TODO:: change type
}

export const SelectDropdown = ({
	options,
	value,
	onChange,
	placeholder = "Select an option",
	disabled = false,
	className = "",
	triggerClassName = "",
	dropdownClassName = "",
  showBreakLine = false,
  loading = false,
  RenderView,
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
	const [shouldOpenUp, setShouldOpenUp] = useState(false);
	const selectRef = useRef<HTMLDivElement | null>(null);

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen((prev) => !prev);
		}
	};

	const closeDropdown = () => {
		setIsOpen(false);
		setHighlightedIndex(null);
	};

	const handleOptionSelect = (selectedValue: Option) => {
		onChange(selectedValue);
		closeDropdown();
	};

	// === Filter options based on search term === //
	const filteredOptions = useMemo(() => {
    console.log("searching--->", searchTerm);
		if (!searchTerm) return options;

		const lowerSearchTerm = searchTerm.toLowerCase();
		return options
			?.filter((o) => o.label.toLowerCase().includes(lowerSearchTerm))
			.sort((a, b) => {
				const aStartsWith = a.label.toLowerCase().startsWith(lowerSearchTerm);
				const bStartsWith = b.label.toLowerCase().startsWith(lowerSearchTerm);
				return aStartsWith === bStartsWith ? 0 : aStartsWith ? -1 : 1;
			});
	}, [options, searchTerm]);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (!isOpen) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === options.length - 1 ? 0 : prev + 1));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setHighlightedIndex((prev) => (prev === null || prev === 0 ? options.length - 1 : prev - 1));
		} else if (event.key === "Enter" && highlightedIndex !== null) {
			event.preventDefault();
			const selectedOption = options[highlightedIndex];
			if (selectedOption) {
				handleOptionSelect(selectedOption);
			}
		} else if (event.key === "Escape") {
			closeDropdown();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				closeDropdown();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isOpen && selectRef.current) {
			const rect = selectRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const dropdownHeight = 200; // Approximate height of the dropdown content
			setShouldOpenUp(rect.bottom + dropdownHeight > viewportHeight);
		}
	}, [isOpen]);

	return (
		<div ref={selectRef} className={`pam-relative pam-w-full sm:pam-w-fit ${className}`} tabIndex={0} onKeyDown={handleKeyDown}>
			<button
				className={`pam-flex pam-rounded-lg pam-border pam-justify-between pam-border-line pam-text-sm ${triggerClassName}
					${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${isOpen ? "pam-bg-gray-100" : "pam-bg-white/10"}`}
				onClick={toggleDropdown}
				disabled={disabled}
				type="button"
			>
        <div className="pam-flex pam-px-3 pam-py-2 pam-h-full pam-items-center pam-w-5/6">
           {(value?.label && RenderView) ? <RenderView value={value} /> : <div className="pam-text-sm pam-items-center">{value?.label || `| Choose ${placeholder}`}</div>}
        </div>
        <div className={`pam-flex pam-h-full pam-items-center pam-justify-center pam-w-1/6 ${showBreakLine ? "pam-border-l pam-border-line":""}`}>
          {loading ? <Loader size={20} /> : <ChevronDown size={20} color="#000" />}
        </div>
			</button>

			{isOpen && (
				<div
					className={`pam-absolute pam-z-10 pam-mt-2 pam-h-fit pam-max-h-40 pam-w-full pam-overflow-y-auto pam-overflow-x-hidden pam-rounded-lg pam-border pam-shadow-lg pam-backdrop-blur-lg ${shouldOpenUp ? "pam-bottom-full mb-2" : "pam-top-full mt-2"} ${dropdownClassName}`}
					role="listbox"
				>
          <div className="pam-sticky pam-top-0 pam-z-20 pam-w-full pam-p-2 pam-shadow-lg pam-backdrop-blur-lg pam-bg-white">
            <input
              className="pam-w-full pam-px-4 pam-py-2 pam-rounded-lg pam-border pam-justify-between pam-border-line pam-text-sm "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${placeholder}...`}
            />
          </div>
          <ul>
            {filteredOptions.map((option: Option, index) => (
              <li
                key={option.value}
                className={`pam-relative pam-flex pam-cursor-pointer pam-items-center pam-rounded pam-p-2 pam-px-4 pam-py-2 pam-text-base outline-none hover:pam-bg-white/20
                ${(highlightedIndex === index || option.label === value?.label) ? "pam-bg-white/30" : ""}`}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={value?.value === option.value}
              >
                {RenderView ? <RenderView value={option} />: sentenceCase(option.label)}
                {option.label === value?.label && (
                  <span className="pam-absolute pam-right-3 pam-flex pam-h-3.5 pam-w-3.5 pam-items-center pam-justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </li>
            ))}
          </ul>
				</div>
			)}
		</div>
	);
};
