const ProfilKarti = ({isim = "Misafir Kullanıcı", rol="Ziyaretçi"}) => {
    return (
        <div className="card">
            <h4 className="font-bold">{isim}</h4>
            <p className="text-gray-500">Rol: {rol}</p>
        </div>
    );
};




const Demo9DefaultProps = () => {
    return (
        <div className="p-4">
            <h3 className="text-xl font-bold">Demo 9: Varsayılan (Default) Props</h3>
            <p className="mt-2 text-gray-600">Bileşene veri gönderilmediğinde varsayılan parametre değerlerinin nasıl çalıştığını öğreniyoruz.</p>
            <div className="product-grid">
                <ProfilKarti isim="Ahmet Yılmaz" rol="Yönetici"/>
                <ProfilKarti isim="Merve Daşçi" />
                <ProfilKarti />
            </div>
        </div>

    )
};
export default Demo9DefaultProps;