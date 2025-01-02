const Label = (props) => {
  const { children, htmlFor } = props;
  return <label htmlFor={htmlFor} className="label">{children}</label>;
};

export default Label;
