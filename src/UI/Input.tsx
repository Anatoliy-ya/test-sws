import styles from './Input.module.scss';

interface InputProps {
  type: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Input({ type, value, onChange, onKeyDown, className }: InputProps) {
  const classInput = `${styles.input} ${className}`;
  return (
    <div className={styles.inputWrapper}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={classInput}
      />
    </div>
  );
}
