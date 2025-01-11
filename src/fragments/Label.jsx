/* eslint-disable react/prop-types */
const Label = (props) => {
  const { children, htmlFor } = props;
  return (
    <label htmlFor={htmlFor} className="label label-text font-bold">
      {children}
    </label>
  );
};

export default Label;
