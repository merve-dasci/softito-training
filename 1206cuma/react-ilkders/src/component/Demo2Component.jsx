const Selamla = () => {
    return (
        <div className="p-3 border">
            <h4 className="font-bold">Merhaba Dünya</h4>
            <p className="text-gray-500">Ben bir alt bileşenim. Beni istediğiniz kadar çağırabilirsiniz.</p>
        </div>
    );
};

const Demo2Component = () => {
    return (
        <div className="p-4">
            <h3 className="text-xl">Demo 2: Bileşen (Component) Yapısı</h3>
            <p className="mt-2 text-gray-600">Büyük kodları küçük ve tekrar kullanılabilir parçalara bölmeyi öğreniyoruz.</p>
            <div className="mt-4">
                <Selamla />
                <Selamla />
                <Selamla />
            </div>
        </div>
    )
}
export default Demo2Component;