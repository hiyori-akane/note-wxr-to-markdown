interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Checkbox({ id, checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
