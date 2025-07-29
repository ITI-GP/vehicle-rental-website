export default function Card() {
  const imageUrl =
    "https://plus.unsplash.com/premium_photo-1683134240084-ba074973f75e?q=80&w=1295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="bg-red-500 p-4 rounded-lg shadow-md w-[416px] h-[513px] overflow-hidden">
      {/* Image section */}
      <div className="w-full h-[240px]  mt-[24px] mb-[20px] overflow-hidden rounded-md">
        <img src={imageUrl} alt="vaichal image" className=" object-cover" />
      </div>

      {/* Data section */}
      <div>{/* Add your data content here */}</div>

      {/* Button section */}
      <div>{/* Add your button(s) here */}</div>
    </div>
  );
}
