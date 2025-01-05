/* eslint-disable react/prop-types */
const Button = (props) => {
  const { children, onClick, classname, role, disabled } = props;
  return (
    <>
      <button className={classname} role={role} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </>
  );
};

export default Button;
