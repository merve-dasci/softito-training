const UrunKutusu = (props) => {
    return (
        <div className="card">
            <h4 className="font-bold">{props.ad}</h4>
            <div className="mt-2">
                {props.stokAdedi > 0 ? (
                    <span className="badge-success">Stokta var({props.stokAdedi} adet)</span>
                ): (
                    <span className="badge-danger">Stokta Yok- Tükendi</span>
                )}

            </div>
            <div className="mt-2">
                {props.indirimdeMi && (
                    <span className="badge-danger">Kampanyalı Urun</span>
                )}
            </div>
        </div>

    );
};

const Demo5ConditionalRendering = () => {
    return (
      <div className="p-4">
        <h3 className="text-xl font-bold">Demo 5: Koşullu Render</h3>
        <p className="mt-2 text-gray-600">
          Koşullara göre ekranda farklı HTML/JSX yapılarını göstermeyi
          öğreniyoruz.
        </p>
        <div className="product-grid">
          <UrunKutusu ad="Televizyon" stokAdedi={5} indirimdeMi={true} />
          <UrunKutusu ad="Mikrodalga" stokAdedi={0} indirimdeMi={false} />
          <UrunKutusu ad="Fırın" stokAdedi={5} indirimdeMi={false} />
        </div>
      </div>
    );
};

export default Demo5ConditionalRendering;