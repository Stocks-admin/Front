interface ToggleSwitchProps {
  option1: string;
  option2: string;
  selected: 0 | 1;
  onChange?: (selected: 0 | 1) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({
  option1,
  option2,
  selected = 0,
  onChange,
  disabled = false,
}: ToggleSwitchProps) => {
  const handleClick = (selected: 0 | 1) => {
    onChange && onChange(selected);
  };

  return (
    <label
      htmlFor={`toggle-${option1}-${option2}`}
      className={`inline-flex items-center rounded-full cursor-pointer text-[#cbcbcb] bg-white font-semibold shadow-lg px-2 py-1 ${
        disabled && "opacity-50 cursor-default"
      }`}
    >
      <span
        className={`px-4 py-2 rounded-full ${
          selected === 0 && "bg-gradient font-bold text-white"
        }`}
        onClick={() => !disabled && handleClick(0)}
      >
        {option1}
      </span>
      <span
        className={`px-4 py-2 rounded-full ${
          selected === 1 && "bg-gradient font-bold text-white"
        }`}
        onClick={() => !disabled && handleClick(1)}
      >
        {option2}
      </span>
    </label>
  );
};

export default ToggleSwitch;
