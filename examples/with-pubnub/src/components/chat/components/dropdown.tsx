import type React from "react";
import { type ReactNode, useState } from "react";

// Define props if needed
interface DropdownProps {
  title: string; // For customization,
  children: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the visibility of the dropdown content
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="max-w-md mx-auto mt-5 border border-gray-300 shadow-lg rounded-md overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleDropdown}
        onKeyDown={(event) => {
          // Check if the key pressed is 'Enter' or 'Space'
          if (event.key === "Enter" || event.key === " ") {
            toggleDropdown();
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed="false"
      >
        <h2 className="text-lg leading-6 font-medium text-pubnub-white">
          {title}
        </h2>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "transform rotate-90" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Toggle</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="">
          {/* Make this div scrollable */}
          <div className="p-4 max-h-60 overflow-auto">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
