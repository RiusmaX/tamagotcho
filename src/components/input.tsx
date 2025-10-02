function InputField ({
  type,
  name,
  value,
  onChange
}: {
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}): React.ReactNode {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    />
  )
}

export default InputField
