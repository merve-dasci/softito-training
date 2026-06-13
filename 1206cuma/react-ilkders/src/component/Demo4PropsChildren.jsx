const Kart = (props) => {
    return (
        <div className="card">{props.children}</div>
    );
};

const Demo4PropsChildren = () => {
    return (
      <div className="p-4">
        <h3 className="text-xl font-bold">Demo 4: props.children kullanımı</h3>
        <p className="mt-2 text-gray-600">
          Bileşenleri sarmalayıcı (wrapper) kutular olarak kullanıp içerik
          yerleştirmeyi öğreniyoruz.
        </p>
        <div className="product-grid">
          <Kart>
            <h4 className="font-bold">Kart 1 Başlık</h4>
            <p className="text-sm">Bu birinci kartın içerik metnidir.</p>
          </Kart>

          <Kart>
            <h4 className="font-bold">Kart 2 Başlık</h4>
            <button className="btn-pink">Kart Butonu</button>
          </Kart>
        </div>
      </div>
    );
};

export default Demo4PropsChildren;