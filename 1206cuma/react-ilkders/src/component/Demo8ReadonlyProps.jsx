const DegistirilemeyenKart = (props) => {
    const deneVeHataGoster = () => {
        try {
            props.baslik = "Yeni Başlık";
        } catch (hata) {
            alert("Hata Yakalandı! Props Değiştirilemez: " + hata.message);
        }
    };

    return (
        <div className="card">
            <h4 className="font-bold">{props.baslik}</h4>
            <p className="text-gray-500">Prop Degeri: {props.baslik}</p>
            <button onClick={deneVeHataGoster} className="btn-red">Prop Değiştirmeyi Dene</button>
        </div>
    )

};

const Demo8ReadonlyProps = () => {
    return (
      <div className="p-4">
        <h3 className="text-xl font-bold">
          Demo 8: Salt Okunur (Readonly) Props
        </h3>
        <p className="mt-2 text-gray-600">
          Props (Özellikler) tek yönlü veri akışı sağlar ve doğrudan
          değiştirilmez. Bu denemeyi yaparak bunu görüyoruz.
        </p>
        <div className="mt-4">
          <DegistirilemeyenKart baslik="Degistirilemeyen Baslik" />
        </div>
      </div>
    );
};
export default Demo8ReadonlyProps;