// components/StatBox.jsx
const StatBox = ({ imageSrc, number, label, bgColor }) => {
  return (
    <div className="flex items-center bg-white shadow-md rounded-lg p-4 w-64">
      <div className={`w-14 h-14 flex items-center justify-center rounded-md ${bgColor}`}>
        <img src={imageSrc} alt={label} className="w-6 h-6" />
      </div>
      <div className="ml-4">
        <h3 className="text-2xl font-bold text-gray-800">{number}</h3>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
};

export default StatBox;
