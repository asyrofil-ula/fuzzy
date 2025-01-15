/* eslint-disable react/prop-types */
const Card = (props) => {
  const { children, title } = props;
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-white shadow-lg rounded-lg border border-gray-300 p-6">
        <div className="card-body text-center">
          <h1 className="card-title text-2xl font-extrabold text-gray-800">
            {title}
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Card;
