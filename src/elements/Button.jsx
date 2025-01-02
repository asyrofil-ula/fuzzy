/* eslint-disable react/prop-types */
const Button = (props) => {
  const { children, onClick, classname, role } = props;
  return (
    <>
      <button className={classname} role={role} onClick={onClick}>
        {children}
      </button>
    </>
  );
};

export default Button;
