// import Label from "./Label";

/* eslint-disable react/prop-types */
const Input = (props) => {
  const { children, value, id, type, onChange, placeholder } = props;
  return (
    <>
      {/* <Label></Label> */}
      <input
        type={type}
        value={value}
        id={id}
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-accent focus:outline-none transition"
        required
        onChange={onChange}
      >
        {children}
      </input>
    </>
  );
};

export default Input;
