/* eslint-disable react/prop-types */
const Card = (props) => {
  const { children, title } = props;
  return (
    <div className="flex justify-center">
      <div className="card justify-center w-96 bg-gray-100 shadow-xl gap-2 border border-gray-300">
        <div className="card-body">
          <h1 className="card-title text-center text-xl font-bold text-gray-800">
            {title}
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Card;
