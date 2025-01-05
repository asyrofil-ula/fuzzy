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
        className="input input-bordered input-info w-full max-w-xs"
        required
        onChange={onChange}
      >
        {children}
      </input>
    </>
  );
};

export default Input;
