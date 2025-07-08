const Pizza = ({ name, description, image }) => {
  return (
    <div className="pizza">
      <h2>{name}</h2>
      <p>{description}</p>
      <img src={image ? image : "https://picsum.photos/200"} alt={name} />
    </div>
  );
};

export default Pizza;
