const Page = () => {
  return (
    <>
      <div style={{ height: '110vh' }}></div>
      <iframe
        src="http://localhost:3000/simple-player"
        allow="picture-in-picture; clipboard-write; encrypted-media; gyroscope; accelerometer;"
      ></iframe>
    </>
  );
};

export default Page;
