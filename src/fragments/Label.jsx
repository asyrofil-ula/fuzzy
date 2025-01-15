/* eslint-disable react/prop-types */
const Label = (props) => {
  const { children, htmlFor } = props;
  return (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-gray-700 mb-2">
      {children}
    </label>
  );
};

export default Label;
